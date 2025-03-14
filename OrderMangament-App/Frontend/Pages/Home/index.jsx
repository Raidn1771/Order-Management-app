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

const statusColors = {
  Pending: '#FFA500', // Orange
  Shipped: '#1E90FF', // Dodger Blue
  Delivered: '#32CD32', // Lime Green
};

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newOrder, setNewOrder] = useState({
    items: '',
    totalPrice: '',
    status: 'Pending',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getOrders();
        setOrders(data.orders || []);
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
      const itemsArray = newOrder.items.split(',').map(item => {
        const [name, quantity] = item.split(':');
        return {
          name: name.trim(),
          quantity: parseInt(quantity.trim(), 10) || 1,
        };
      });

      const orderData = {
        items: itemsArray,
        totalPrice: parseFloat(newOrder.totalPrice),
        status: newOrder.status || 'Pending',
      };

      const { data } = await createOrder(orderData); // Call the API

      if (data && data.order) {
        // Check for the correct structure
        setOrders(prevOrders => [...prevOrders, data.order]); // Add new order to the state
        setNewOrder({ items: '', totalPrice: '', status: 'Pending' }); // Reset form
        toast.success('Order created successfully!');
      } else {
        throw new Error('Invalid order data returned from server');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    }
  };

 const handleUpdateOrder = async (orderId, status) => {
    try {
      const updatedData = { status };
      const { data } = await updateOrder(orderId, updatedData);

      setOrders(
        orders.map(order => (order.orderId === orderId ? data.order : order))
      );
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
    <>
      <Navbar />
      <div className="home-container">
        <h2 className="page-title">Manage Orders</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="create-order-form">
          <h3>Create New Order</h3>
          <input
            type="text"
            placeholder="Items (name:quantity, comma-separated)"
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
          <select
            value={newOrder.status}
            onChange={e => setNewOrder({ ...newOrder, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <button onClick={handleCreateOrder}>Create Order</button>
        </div>

        <div className="order-grid">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className={`order-card fade-in delay-${index} ${
                order.status === 'Pending' ? 'pending' : ''
              }`}
              style={{
                borderLeft: `5px solid ${
                  statusColors[order?.status?.trim() || 'Pending']
                }`,
              }}
            >
              <h3>Order ID: {order.orderId}</h3>
              <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
              <p>Status: {order.status}</p>
              <p>Items:</p>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} (x{item.quantity})
                  </li>
                ))}
              </ul>

              <div className="order-actions">
                <button onClick={() => handleUpdateOrder(order.orderID, 'Shipped')}>
                  Mark as Shipped
                </button>
                <button
                  onClick={() => handleUpdateOrder(order.orderID, 'Delivered')}
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
    </>
  );
};

export default Home;
