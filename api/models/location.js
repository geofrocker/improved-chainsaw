/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const subLocationSchema = require('./subLocation');

const { Schema } = mongoose;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Location name field is required'],
    validate: [/^[A-Za-z0-9_-]{4,}$/, 'Invalid location submitted'],
    unique: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  totalMale: {
    type: Number,
    default: 0,
  },
  totalFemale: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  subLocations: [subLocationSchema],
});

LocationSchema.pre('save', function (next) {
  this.total = 0;
  this.totalFemale = 0;
  this.totalMale = 0;
  for (let i = 0; i < this.subLocations.length; i += 1) {
    this.total += this.subLocations[i].total;
    this.totalFemale += this.subLocations[i].totalFemale;
    this.totalMale += this.subLocations[i].totalMale;
  }

  next();
});

LocationSchema.pre('updateOne', function (next) {
  const update = this.getUpdate();
  this.updateOne(
    {},
    {
      $set: {
        total: parseInt(update.totalMale, 10) + parseInt(update.totalFemale, 10),
      },
    },
  );
  next();
});

LocationSchema.plugin(mongoosePaginate);
LocationSchema.index({ '$**': 'text' });

const Location = mongoose.model('location', LocationSchema);
module.exports = Location;

module.exports.add = (location, callback) => {
  Location.create(location, callback);
};

module.exports.getLocationById = function (_id, callback) {
  const query = { _id };
  Location.findOne(query).exec(callback);
};

module.exports.delete = function (_id, callback) {
  const query = { _id };
  Location.deleteOne(query, callback);
};

module.exports.update = function (_id, body, callback) {
  const query = { _id };
  Location.updateOne(query, body, callback);
};
