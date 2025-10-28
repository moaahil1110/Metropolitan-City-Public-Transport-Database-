import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Navigation, 
  Bus, 
  CreditCard, 
  MapPin, 
  Wrench, 
  Train, 
  Briefcase,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/routes', icon: Navigation, label: 'Routes' },
    { path: '/buses', icon: Bus, label: 'Buses' },
    { path: '/bus-passes', icon: CreditCard, label: 'Bus Passes' },
    { path: '/bus-stops', icon: MapPin, label: 'Bus Stops' },
    { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
    { path: '/metro', icon: Train, label: 'Metro System' },
    { path: '/contractors', icon: Briefcase, label: 'Contractors' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-blue-500">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <Bus className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-lg">Metro Transit</h1>
                <p className="text-xs text-blue-200">Management System</p>
              </div>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-blue-500">
            <p className="text-xs text-blue-200 text-center">
              © 2024 Metropolitan Transport
            </p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
