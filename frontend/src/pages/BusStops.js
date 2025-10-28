import React, { useState, useEffect } from 'react';
import { getBusStops, createBusStop } from '../services/api';
import { Plus, MapPin } from 'lucide-react';

const BusStops = () => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    facilities: ''
  });

  useEffect(() => {
    fetchStops();
  }, []);

  const fetchStops = async () => {
    try {
      const response = await getBusStops();
      setStops(response.data);
    } catch (error) {
      console.error('Error fetching stops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBusStop(formData);
      setShowModal(false);
      setFormData({ name: '', location: '', facilities: '' });
      fetchStops();
    } catch (error) {
      console.error('Error creating stop:', error);
      alert('Error creating bus stop');
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
          <h1 className="text-3xl font-bold text-gray-800">Bus Stops</h1>
          <p className="text-gray-600 mt-1">Manage bus stop locations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Stop</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stops.map((stop) => (
          <div key={stop.stop_id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <MapPin className="text-orange-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{stop.name}</h3>
                <p className="text-sm text-gray-600">{stop.location}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Routes: </span>
                <span className="font-medium text-gray-800">{stop.route_count}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Facilities: </span>
                <p className="text-gray-800 mt-1">{stop.facilities || 'None'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Bus Stop</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stop Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                <textarea
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="e.g., Shelter, Seating, Digital Display"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Stop
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

export default BusStops;
