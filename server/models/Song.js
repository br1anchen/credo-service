const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  name: String,
  lang: String,
  lyrics: [String]
});

module.exports = mongoose.model('Song', SongSchema);
