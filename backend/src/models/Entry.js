const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    date: {
      // Dia al que pertenece el contenido, formato YYYY-MM-DD
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['letter', 'phrase', 'collage'],
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    content: {
      // Texto de la carta o de la frase
      type: String,
      trim: true,
      maxlength: 8000,
      default: '',
    },
    images: {
      // Imagenes del collage en base64 (data URLs)
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Entry', entrySchema);
