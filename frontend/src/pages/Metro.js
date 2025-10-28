import React, { useState, useEffect } from 'react';
import { getMetroStops, getMetroConnections } from '../services/api';
import { Train } from 'lucide-react';

const Metro = () => {
  const [stops, setStops] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stopsRes, connectionsRes] = await Promise.all([getMetroStops(), getMetroConnections()]);
      setStops(stopsRes.data);
      setConnections(connectionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLineColor = (line) => {
    const colors = {
      'Blue Line': 'bg-blue-500',
      'Green Line': 'bg-green-500',
      'Red Line': 'bg-red-500',
      'Yellow Line': 'bg-yellow-500',
    };
    return colors[line] || 'bg-gray-500';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Metro System</h1>
        <p className="text-gray-600 mt-1">View metro stations and connections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Metro Stations</h2>
          <div className="space-y-3">
            {stops.map((stop) => (
              <div key={stop.metro_stop_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Train className="text-indigo-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">{stop.name}</p>
                    <p className="text-sm text-gray-600">{stop.location}</p>
                  </div>
                </div>
                <span className={`${getLineColor(stop.line)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                  {stop.line}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Metro Connections</h2>
          <div className="space-y-3">
            {connections.map((conn) => (
              <div key={conn.connection_id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{conn.start_station}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium text-gray-800">{conn.end_station}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Distance: {conn.distance} km</span>
                  <span>Time: {conn.travel_time} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metro;
