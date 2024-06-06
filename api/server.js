const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

require('colors');
require('./database/connect');

app.use(bodyParser.json());

router.get('/freefire/init', require('./routers/freefire/init'));
router.get('/freefire/login', require('./routers/freefire/login'));

router.get(
  '/payment/paypal/sucess',
  require('./routers/payment/paypal/sucess')
);
router.get(
  '/payment/paypal/cancel',
  require('./routers/payment/paypal/cancel')
);

app.use('/api', router);

app.listen(5555, () => {
  console.log('sucess '.green + `server started in 5555.`);
});
