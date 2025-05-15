import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiCpu, FiBarChart2, FiBell, FiSettings, FiSun, FiMenu, FiX, FiChevronLeft, FiChevronRight, FiLogOut } from 'react-icons/fi';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { logout, solarId } = useAuth();
  
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { path: '/devices', name: 'Devices', icon: <FiCpu className="w-5 h-5" /> },
    { path: '/analytics', name: 'Analytics', icon: <FiBarChart2 className="w-5 h-5" /> },
    { path: '/alerts', name: 'Alerts', icon: <FiBell className="w-5 h-5" /> },
    { path: '/settings', name: 'Settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-white shadow-md text-gray-700"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-10"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } flex flex-col bg-white shadow-lg`}
      >
        <div className={`p-6 ${isCollapsed ? 'lg:p-4' : ''} border-b border-gray-200 flex items-center`}>
          <FiSun className="text-yellow-500 h-8 w-8 flex-shrink-0" />
          {!isCollapsed && (
            <div className="ml-2 overflow-hidden">
              <h1 className="text-2xl font-bold text-gray-800 truncate">SolarX</h1>
              <p className="text-gray-500 text-sm mt-1 truncate">Solar Panel Monitoring</p>
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    if (isMobileMenuOpen) toggleMobileMenu();
                  }}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="font-medium truncate">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">
                SX
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
                title="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 p-2">
                <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center font-bold">
                  SX
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">Solar System</p>
                  <p className="text-sm text-gray-500 truncate">{solarId || 'SX-2342'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg w-full"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Toggle button for sidebar collapse */}
        <button 
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-20 bg-white rounded-full p-1 shadow-md border border-gray-200 text-gray-500 hover:text-blue-600"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? 
            <FiChevronRight className="h-4 w-4" /> : 
            <FiChevronLeft className="h-4 w-4" />
          }
        </button>
      </aside>
    </>
  );
};

export default Navigation;