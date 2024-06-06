const ff = require('../../../database/models/freefire');
const paypal = require('paypal-rest-sdk');
require('dotenv').config({
  path: './.env',
});
const moment = require('moment');

paypal.configure({
  mode: 'live',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

async function sucess(req, res) {
  try {
    const { userId, paymentId, token, PayerID } = req.query;

    paypal.payment.get(paymentId, async function (error, payment) {
      if (error) {
        res.status(401).send('Unauthorized');
      } else {
        const ffFind = await ff.findById(userId).exec();
        if (ffFind) return res.send('User already exists.');

        let date;
        switch (payment?.transactions[0]?.description) {
          case '1month':
            date = moment().add(30, 'day').toDate();
            break;
          case '3months':
            date = moment().add(90, 'day').toDate();
            break;
          case 'permanent':
            date = moment().add(9999999999, 'day').toDate();
            break;
          default:
            date = null;
        }

        if (!date) return res.status(400).send('Invalid description');

        const findPaymentId = await ff
          .findOne({
            'payment.paypal.paymentId': req.query.paymentId,
          })
          .exec();
        if (findPaymentId) return res.status(401).send('Unauthorized');

        ff.create({
          _id: req.query.userId,
          expiry: date,
          payment: {
            paypal: {
              paymentId: paymentId,
              token: token,
              PayerID: PayerID,
            },
          },
          createdBy: 'API',
        });
        res.send('Sucess, your login has been created');
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'invalid error' });
  }
}
module.exports = sucess;
