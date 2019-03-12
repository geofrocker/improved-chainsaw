/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubLocationSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Location name field is required'],
    validate: [/^[A-Za-z0-9_-]{4,}$/, 'Invalid location submitted'],
  },
  totalMale: {
    type: Number,
    required: [true, 'Number of males is required'],
  },
  totalFemale: {
    type: Number,
    required: [true, 'Number of Females is required'],
  },
  total: {
    type: Number,
    default: 0,
  },
});

SubLocationSchema.pre('save', function (next) {
  this.total = this.totalMale + this.totalFemale;
  next();
});

module.exports = SubLocationSchema;
