const express = require('express');
const Order = require('../db/Models/orderSchema');
const router = express.Router();
const checktoken = require('../Middlewares/check-token');

router.post('/', checktoken, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    const order = new Order({ items, totalPrice });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to create order', error: err.message });
  }
});

router.get('/', checktoken, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch orders', error: err.message });
  }
});

router.get('/', checktoken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find().skip(skip).limit(limit);
    const total = await Order.countDocuments();

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch orders', error: err.message });
  }
});

router.put('/:orderId', checktoken, async (req, res) => {
  try {
    const { items, totalPrice, status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { items, totalPrice, status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to update order', error: err.message });
  }
});

router.delete('/:orderId', checktoken, async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete order', error: err.message });
  }
});

module.exports = router;
