import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Componants/AuthContext/AuthContext';

const Dashboard = ({ url }) => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalSarees: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersRes = await axios.get(`${url}/api/user/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch orders
        const ordersRes = await axios.get(`${url}/api/orders/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch sarees
        const sareesRes = await axios.get(`${url}/api/saree/list`);

        // Calculate stats
        const orders = ordersRes.data.data || [];
        const revenue = orders.reduce((sum, order) =>
          order.payment ? sum + order.amount : sum, 0
        );

        const pendingOrders = orders.filter(order =>
          order.status === 'Pending' || order.status === 'Processing'
        ).length;

        const completedOrders = orders.filter(order =>
          order.status === 'Delivered'
        ).length;

        setStats({
          totalUsers: usersRes.data.data?.length || 0,
          totalOrders: orders.length,
          totalSarees: sareesRes.data.data?.length || 0,
          totalRevenue: revenue,
          pendingOrders,
          completedOrders
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        alert('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [url, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-pink-600 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600">Overview of your e-commerce platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">📦</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
              <p className="text-2xl font-bold text-green-600">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🛍️</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Sarees</h3>
              <p className="text-2xl font-bold text-purple-600">{stats.totalSarees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
              <p className="text-2xl font-bold text-yellow-600">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Orders</h3>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-teal-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Completed Orders</h3>
              <p className="text-2xl font-bold text-teal-600">{stats.completedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/list"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center transition-colors"
          >
            Manage Products
          </a>
          <a
            href="/orders"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center transition-colors"
          >
            View Orders
          </a>
          <a
            href="/users"
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-center transition-colors"
          >
            Manage Users
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;