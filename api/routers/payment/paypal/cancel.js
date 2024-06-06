async function cancel(req, res) {
  try {
    const { paymentId } = req.query;

    paypal.payment.void(paymentId, {}, function (error, response) {
      if (error) {
        res.status(500).json('Failed to cancel payment');
      } else {
        res.send('Payment has been cancelled');
      }
    });
  } catch {
    return res.status(500).json({ message: 'invalid error' });
  }
}

module.exports = cancel;
