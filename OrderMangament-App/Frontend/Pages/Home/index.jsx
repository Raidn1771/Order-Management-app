import React, { useEffect, useState } from 'react';
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../../Utils/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../Components/Navbar';
import './Home.css';

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newOrder, setNewOrder] = useState({ items: '', totalPrice: 0 });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getOrders();
        setOrders(data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCreateOrder = async () => {
    try {
      const orderData = {
        items: newOrder.items
          .split(',')
          .map(name => ({ name: name.trim(), quantity: 1 })),
        totalPrice: newOrder.totalPrice,
        status: 'Pending',
      };
      const { data } = await createOrder(orderData);
      setOrders([...orders, data.order]);
      setNewOrder({ items: '', totalPrice: 0 });
      toast.success('Order created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    }
  };

  const handleUpdateOrder = async (id, status) => {
    try {
      const { data } = await updateOrder(id, { status });
      setOrders(orders.map(order => (order._id === id ? data.order : order)));
      toast.info(`Order marked as ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    }
  };

  const handleDeleteOrder = async id => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter(order => order._id !== id));
      toast.warn('Order deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete order');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <Navbar>
      <div className="order-container">
        <h2>Orders</h2>
        {error && <p className="error">{error}</p>}

        <div className="create-order">
          <h3>Create New Order</h3>
          <input
            type="text"
            placeholder="Items (comma-separated)"
            value={newOrder.items}
            onChange={e => setNewOrder({ ...newOrder, items: e.target.value })}
          />
          <input
            type="number"
            placeholder="Total Price"
            value={newOrder.totalPrice}
            onChange={e =>
              setNewOrder({ ...newOrder, totalPrice: e.target.value })
            }
          />
          <button onClick={handleCreateOrder}>Create Order</button>
        </div>

        <div className="order-grid">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className={`order-card fade-in delay-${index} ${
                order.status === 'Pending' ? 'pending' : ''
              }`}
            >
              <h3>Order ID: {order._id}</h3>
              <p>Total Price: ${order.totalPrice}</p>
              <p>Status: {order.status}</p>
              <p>Items: {order.items.map(item => item.name).join(', ')}</p>

              <div className="order-actions">
                <button onClick={() => handleUpdateOrder(order._id, 'Shipped')}>
                  Mark as Shipped
                </button>
                <button
                  onClick={() => handleUpdateOrder(order._id, 'Delivered')}
                >
                  Mark as Delivered
                </button>
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Navbar>
  );
};

export default Home;
