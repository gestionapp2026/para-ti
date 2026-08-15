const mongoose = require('mongoose');

const pointEventSchema = new mongoose.Schema(
  {
    delta: {
      type: Number,
      required: true,
      min: -100,
      max: 100,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PointEvent', pointEventSchema);
