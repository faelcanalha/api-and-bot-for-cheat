const mongoose = require('mongoose');

const application = new mongoose.Schema({
  _id: { type: String, required: true },
  key: { type: String, required: true },
  ffversion: { type: String, required: true },
  ffDownloadLink: { type: String, required: true },
});

module.exports = mongoose.model('application', application);
