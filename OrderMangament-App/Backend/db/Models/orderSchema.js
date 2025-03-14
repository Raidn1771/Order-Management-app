const { Schema, model } = require('mongoose');
const { data } = require('react-router-dom');
const { v4: uuidv4 } = require('uuid');

const orderSchema = Schema(
  {
    orderId: { type: String, unique: true, default: uuidv4 },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const orderList = model('orderlist', orderSchema);

module.exports = orderList;
