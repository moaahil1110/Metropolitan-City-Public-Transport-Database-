import React, { useState, useEffect } from 'react';
import { Users, Bus, Navigation, MapPin, CreditCard, Train, TrendingUp, DollarSign } from 'lucide-react';
import { getDashboardStats } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      title: 'Total Users',
      value: stats.total_users,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Total Routes',
      value: stats.total_routes,
      icon: Navigation,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50'
    },
    {
      title: 'Total Buses',
      value: stats.total_buses,
      icon: Bus,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Active Buses',
      value: stats.active_buses,
      icon: TrendingUp,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50'
    },
    {
      title: 'Bus Stops',
      value: stats.total_bus_stops,
      icon: MapPin,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50'
    },
    {
      title: 'Metro Stops',
      value: stats.total_metro_stops,
      icon: Train,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgLight: 'bg-indigo-50'
    },
    {
      title: 'Active Passes',
      value: stats.active_passes,
      icon: CreditCard,
      color: 'bg-pink-500',
      textColor: 'text-pink-600',
      bgLight: 'bg-pink-50'
    },
    {
      title: 'Maintenance Cost',
      value: `₹${stats.total_maintenance_cost?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50'
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Metropolitan City Public Transport Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgLight} p-3 rounded-lg`}>
                  <Icon className={`${stat.textColor} w-6 h-6`} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-700">Bus System</span>
              </div>
              <span className="text-green-600 font-semibold">Operational</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-700">Metro System</span>
              </div>
              <span className="text-green-600 font-semibold">Operational</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-700">Database</span>
              </div>
              <span className="text-blue-600 font-semibold">Connected</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-gray-800">Add New User</p>
                  <p className="text-sm text-gray-600">Register a new passenger</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Bus className="text-purple-600" size={20} />
                <div>
                  <p className="font-medium text-gray-800">Add New Bus</p>
                  <p className="text-sm text-gray-600">Register a new vehicle</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Navigation className="text-green-600" size={20} />
                <div>
                  <p className="font-medium text-gray-800">Create Route</p>
                  <p className="text-sm text-gray-600">Define a new bus route</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
