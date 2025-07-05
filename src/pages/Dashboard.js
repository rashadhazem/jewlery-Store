// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        toast.error(data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      toast.error('Error fetching user data');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        toast.error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-600">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-4 text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div className="space-y-4">
              <Link
                to="/profile/edit"
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </Link>
              <Link
                to="/wishlist"
                className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                View Wishlist
              </Link>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
            </div>
            {orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No orders found
              </div>
            ) : (
              <div className="divide-y">
                {orders.map((order) => (
                  <div key={order._id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-500">Order #{order._id}</p>
                        <p className="font-semibold">${order.totalAmount}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col md:items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <Link
                          to={`/orders/${order._id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item._id} className="relative">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                            x{item.quantity}
                          </div>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="relative">
                          <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center">
                            <span className="text-gray-500">+{order.items.length - 4} more</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
