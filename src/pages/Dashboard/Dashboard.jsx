import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FaBoxOpen, FaUsers, FaClipboardList, FaStar, FaRupeeSign } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersCount: 0,
    productsCount: 0,
    usersCount: 0,
    feedbacksCount: 0,
    salesByCategory: [],
    monthlySales: []
  });
  const [myOrdersCount, setMyOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin()) {
          const { data } = await api.get('/orders/stats');
          setStats(data);
        } else {
          // User view: fetch my orders count
          const { data } = await api.get('/orders/my-orders');
          setMyOrdersCount(data.length);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, isAdmin]);

  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  // --- USER DASHBOARD ---
  if (!isAdmin()) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mb-8">Here is an overview of your account.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="p-4 bg-green-50 text-green-600 rounded-lg mr-4">
              <FaClipboardList size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Your Orders</p>
              <h3 className="text-2xl font-bold">{myOrdersCount}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Format monthly sales data for chart
  const barData = stats.monthlySales.map(item => ({
    name: `Month ${item._id}`,
    Sales: item.total
  }));

  // Format category data
  const pieData = stats.salesByCategory.map(item => ({
    name: item._id,
    value: item.totalSales
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Overview</h1>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-lg mr-4">
            <FaBoxOpen size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Products</p>
            <h3 className="text-2xl font-bold">{stats.productsCount}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-green-50 text-green-600 rounded-lg mr-4">
            <FaClipboardList size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h3 className="text-2xl font-bold">{stats.ordersCount}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-lg mr-4">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h3 className="text-2xl font-bold">{stats.usersCount}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-lg mr-4">
            <FaStar size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Reviews</p>
            <h3 className="text-2xl font-bold">{stats.feedbacksCount}</h3>
          </div>
        </div>
      </div>

      {/* Revenue Card (Extra) */}
      <div className="mb-12 bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl text-white shadow-lg">
        <h2 className="text-xl opacity-80 mb-2">Total Revenue</h2>
        <div className="text-4xl font-bold flex items-center">
          <FaRupeeSign className="mr-1" /> {stats.totalRevenue.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart: Monthly Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Monthly Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Sales" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Category Sales */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Sales by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;