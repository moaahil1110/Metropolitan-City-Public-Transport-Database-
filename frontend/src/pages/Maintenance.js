import React, { useState, useEffect } from 'react';
import { getMaintenance, getBuses, getContractors, createMaintenance } from '../services/api';
import { Plus, Wrench } from 'lucide-react';

const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [buses, setBuses] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bus_id: '',
    contractor_id: '',
    details: '',
    maintenance_date: new Date().toISOString().split('T')[0],
    cost: '',
    entity_type: 'Bus',
    entity_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [maintenanceRes, busesRes, contractorsRes] = await Promise.all([
        getMaintenance(),
        getBuses(),
        getContractors()
      ]);
      setMaintenance(maintenanceRes.data);
      setBuses(busesRes.data);
      setContractors(contractorsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMaintenance(formData);
      setShowModal(false);
      setFormData({ bus_id: '', contractor_id: '', details: '', maintenance_date: new Date().toISOString().split('T')[0], cost: '', entity_type: 'Bus', entity_id: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating maintenance:', error);
      alert('Error creating maintenance record');
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
          <h1 className="text-3xl font-bold text-gray-800">Maintenance</h1>
          <p className="text-gray-600 mt-1">Track vehicle maintenance records</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Record</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contractor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {maintenance.map((record) => (
              <tr key={record.maintenance_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(record.maintenance_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Wrench size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{record.registration_no}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.contractor_name || 'In-house'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.details}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ₹{record.cost?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Maintenance Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bus</label>
                <select
                  required
                  value={formData.bus_id}
                  onChange={(e) => setFormData({ ...formData, bus_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Bus</option>
                  {buses.map(bus => (
                    <option key={bus.bus_id} value={bus.bus_id}>{bus.registration_no}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contractor</label>
                <select
                  value={formData.contractor_id}
                  onChange={(e) => setFormData({ ...formData, contractor_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">In-house</option>
                  {contractors.map(contractor => (
                    <option key={contractor.contractor_id} value={contractor.contractor_id}>{contractor.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                <textarea
                  required
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.maintenance_date}
                  onChange={(e) => setFormData({ ...formData, maintenance_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Record
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

export default Maintenance;
