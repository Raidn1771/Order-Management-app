const express = require('express');

const router = express.Router();

const orderRouter = require('./orderRoute');
const userRoute = require('./userRoute');

router.use('/orders', orderRouter);
router.use('/user', userRoute);

module.exports = router;
