const mongoose = require('mongoose');
const { TitleCase } = require('../utils/strings');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true
  },
  species: {
    type: String,
    required: [true, 'Species is required'],
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'],
    trim: true
  },
  breed: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicalHistory: [{
    date: Date,
    description: String,
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  vaccinations: [{
    name: String,
    date: Date,
    nextDue: Date
  }]
}, {
  timestamps: true
});

// Normalize name and species
petSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.name = TitleCase(this.name);
  }
  if (this.isModified('species')) {
    this.species = TitleCase(this.species);
  }
  next();
});

petSchema.index({ owner: 1 });
petSchema.index({ species: 1 });

module.exports = mongoose.model('Pet', petSchema);
