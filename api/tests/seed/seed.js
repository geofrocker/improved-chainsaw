const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrpt = require('bcryptjs');
const config = require('../../config');
const User = require('../../models/user');
const Location = require('../../models/location');

const user1ID = new ObjectID();
const users = [
  {
    _id: user1ID,
    username: 'geofrocker',
    email: 'geofrocker@gmail.com',
    password: '123abc!',
    tokens: [
      {
        token: jwt.sign(
          {
            user: { _id: user1ID, username: 'geofrocker', password: '123abc!' },
          },
          config.env.SECRET_KEY,
          {
            expiresIn: '2d',
          },
        ),
      },
    ],
  },
  {
    username: 'geofrocker2',
    email: 'geofrocker2@gmail.com',
    password: '123abc!',
    tokens: [
      {
        token: jwt
          .sign(
            { username: 'geofrocker2', password: '123abc!' },
            config.env.SECRET_KEY,
            {
              expiresIn: '2d',
            },
          )
          .toString(),
      },
    ],
  },
];

const locations = [
  {
    _id: new ObjectID(),
    name: 'Mbarara',
    totalMale: 200,
    totalFemale: 2000,
    author: user1ID,
    subLocations: [
      {
        _id: new ObjectID(),
        name: 'Bihagwe',
        totalMale: 1500,
        totalFemale: 200,
      },
    ],
  },
];

const populateUsers = (done) => {
  const userOne = new User(users[0]);
  User.createUser(userOne, (err1, user1) => {
    done();
  });
  const userTwo = new User(users[1]);
  User.createUser(userTwo, (err, user) => {
    done();
  });
};

const populateLocations = (done) => {
  Location.add(locations[0], (err, location) => {
    done();
  });
};

module.exports = {
  locations,
  users,
  populateUsers,
  populateLocations,
};
