import React, { useState, useEffect } from 'react';
import { getBusPasses, getUsers, createBusPass, deleteBusPass } from '../services/api';
import { Plus, CreditCard, Trash2 } from 'lucide-react';

const BusPasses = () => {
  const [passes, setPasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    pass_type: 'Monthly',
    issue_date: new Date().toISOString().split('T')[0]
  });

  // Calculate expiry date for display
  const calculateExpiryDate = (issueDate, passType) => {
    const date = new Date(issueDate);
    switch(passType) {
      case 'Weekly': date.setDate(date.getDate() + 7); break;
      case 'Monthly': date.setMonth(date.getMonth() + 1); break;
      case 'Quarterly': date.setMonth(date.getMonth() + 3); break;
      case 'Annual': date.setFullYear(date.getFullYear() + 1); break;
      default: break;
    }
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [passesRes, usersRes] = await Promise.all([getBusPasses(), getUsers()]);
      setPasses(passesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      const response = await createBusPass(formData);
      console.log('Response:', response);
      setShowModal(false);
      setFormData({ user_id: '', pass_type: 'Monthly', issue_date: new Date().toISOString().split('T')[0] });
      fetchData();
      alert('Bus pass created successfully!');
    } catch (error) {
      console.error('Error creating pass:', error);
      console.error('Error details:', error.response?.data);
      alert(`Error creating bus pass: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDelete = async (passId) => {
    if (window.confirm('Are you sure you want to delete this bus pass?')) {
      try {
        await deleteBusPass(passId);
        fetchData();
        alert('Bus pass deleted successfully!');
      } catch (error) {
        console.error('Error deleting pass:', error);
        alert(`Error deleting bus pass: ${error.response?.data?.error || error.message}`);
      }
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
          <h1 className="text-3xl font-bold text-gray-800">Bus Passes</h1>
          <p className="text-gray-600 mt-1">Manage passenger passes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Issue Pass</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {passes.map((pass) => (
          <div key={pass.pass_id} className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-lg p-6 text-white relative">
            <button
              onClick={() => handleDelete(pass.pass_id)}
              className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              title="Delete pass"
            >
              <Trash2 size={16} />
            </button>
            <div className="flex items-start justify-between mb-4 pr-12">
              <CreditCard size={32} />
              <span className={`px-3 py-1 text-xs rounded-full ${
                pass.status === 'Active' ? 'bg-white bg-opacity-30' : 'bg-black bg-opacity-30'
              }`}>
                {pass.status}
              </span>
            </div>
            <h3 className="font-bold text-xl mb-2">{pass.user_name}</h3>
            <p className="text-pink-100 text-sm mb-4">{pass.contact_info}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-pink-100">Type:</span>
                <span className="font-semibold">{pass.pass_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pink-100">Issued:</span>
                <span className="font-semibold">{new Date(pass.issue_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pink-100">Expires:</span>
                <span className="font-semibold">{new Date(pass.expiry_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Issue New Pass</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <select
                  required
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.user_id} value={user.user_id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pass Type</label>
                <select
                  value={formData.pass_type}
                  onChange={(e) => setFormData({ ...formData, pass_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  required
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Auto-calculated)</label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                  {formData.issue_date ? calculateExpiryDate(formData.issue_date, formData.pass_type) : 'Select issue date'}
                </div>
                <p className="text-xs text-gray-500 mt-1">✨ Automatically calculated by database stored procedure</p>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Issue Pass
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

export default BusPasses;
