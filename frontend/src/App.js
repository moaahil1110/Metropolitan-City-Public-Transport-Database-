import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import RoutesPage from './pages/Routes';
import Buses from './pages/Buses';
import BusPasses from './pages/BusPasses';
import BusStops from './pages/BusStops';
import Maintenance from './pages/Maintenance';
import Metro from './pages/Metro';
import Contractors from './pages/Contractors';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/bus-passes" element={<BusPasses />} />
          <Route path="/bus-stops" element={<BusStops />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/metro" element={<Metro />} />
          <Route path="/contractors" element={<Contractors />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
