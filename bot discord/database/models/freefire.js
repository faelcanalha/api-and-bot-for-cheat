const mongoose = require('mongoose');

const ffUsers = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    hwid: { type: String, default: null },
    expiry: { type: Date, required: true },
    payment: {
      paypal: {
        paymentId: { type: String },
        token: { type: String },
        PayerID: { type: String },
      },
    },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('freefire', ffUsers);
