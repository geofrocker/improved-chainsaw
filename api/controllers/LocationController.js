const Location = require('./../models/location');
const SubLocation = require('../models/subLocation');
const User = require('../models/user');

const LocationController = () => {
  const addLocation = (req, res) => {
    req.body.author = req.userId;
    Location.add(req.body, (err, location) => {
      if (err && err.code === 11000) {
        res
          .status(400)
          .send({ message: 'Location with same name already exists' });
      } else if (err) {
        res
          .status(500)
          .send({ message: 'An error occured', error: err.message });
      } else {
        res.status(201).send(location);
      }
    });
  };

  const getLocations = (req, res) => {
    Location.find({})
      .populate('author', 'username', User)
      .exec((error, locations) => {
        if (error) res.status(500).send({ error });
        if (locations.length > 0) {
          res.status(200).send({ locations });
        } else {
          res.status(404).send({ message: 'No locations found' });
        }
      });
  };

  const getLocation = (req, res) => {
    Location.getLocationById(req.params.id, (err, location) => {
      if (err) res.status(500).send({ error: err.message });
      if (location) {
        res.status(200).send({ location });
      } else {
        res.status(404).send({ message: 'Location not found' });
      }
    });
  };

  const updateLocation = (req, res) => {
    req.body.author = req.userId;
    Location.update(req.params.id, req.body, (err, location) => {
      if (err) res.status(500).send({ error: err.message });
      if (!location.n) {
        res.status(404).send({ message: 'Location not found' });
      }
      if (!err) {
        res
          .status(201)
          .send({ message: 'Location updated successfully', location });
      }
    });
  };

  const deleteLocation = (req, res) => {
    Location.delete(req.params.id, (err, location) => {
      if (!location.n) {
        res.status(404).send({ message: 'Location not found' });
      }
      if (!err) {
        res
          .status(200)
          .send({ message: 'Location deleted Successfully', location });
      }
    });
  };

  return {
    addLocation,
    getLocations,
    getLocation,
    updateLocation,
    deleteLocation,
  };
};

module.exports = LocationController;
