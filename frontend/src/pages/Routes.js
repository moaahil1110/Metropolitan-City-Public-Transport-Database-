import React, { useState, useEffect } from 'react';
import { getRoutes, createRoute } from '../services/api';
import { Plus, MapPin } from 'lucide-react';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    route_name: '',
    start_stop: '',
    end_stop: '',
    total_distance: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await getRoutes();
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRoute(formData);
      setShowModal(false);
      setFormData({ route_name: '', start_stop: '', end_stop: '', total_distance: '', status: 'Active' });
      fetchRoutes();
    } catch (error) {
      console.error('Error creating route:', error);
      alert('Error creating route');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Routes</h1>
          <p className="text-gray-600 mt-1">Manage bus routes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Route</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <div key={route.route_id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{route.route_name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    route.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {route.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Start:</span>
                <span className="font-medium text-gray-800">{route.start_stop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End:</span>
                <span className="font-medium text-gray-800">{route.end_stop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-medium text-gray-800">{route.total_distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Buses:</span>
                <span className="font-medium text-gray-800">{route.bus_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stops:</span>
                <span className="font-medium text-gray-800">{route.stop_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Route</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                <input
                  type="text"
                  required
                  value={formData.route_name}
                  onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Stop</label>
                <input
                  type="text"
                  required
                  value={formData.start_stop}
                  onChange={(e) => setFormData({ ...formData, start_stop: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Stop</label>
                <input
                  type="text"
                  required
                  value={formData.end_stop}
                  onChange={(e) => setFormData({ ...formData, end_stop: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.total_distance}
                  onChange={(e) => setFormData({ ...formData, total_distance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Route
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;
