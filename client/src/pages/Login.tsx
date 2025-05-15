import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [solarId, setSolarId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple validation
    if (!solarId.trim()) {
      setError('Please enter your Solar ID');
      setIsLoading(false);
      return;
    }

    // Try to login
    const success = login(solarId);
    
    if (success) {
      navigate('/');
    } else {
      setError('Incorrect Solar ID. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Content/Branding */}
      <div className="bg-blue-600 md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <FiSun className="h-10 w-10 text-yellow-300" />
            <h1 className="text-3xl md:text-4xl font-bold text-white ml-3">SolarX</h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Smart Solar System Management
          </h2>
          
          <p className="text-blue-100 mb-6">
            Monitor and control your solar panels, battery status, and connected devices all in one place.
            Optimize energy usage and track performance with our advanced dashboard.
          </p>
          
          <div className="bg-blue-700 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-2">System Benefits</h3>
            <ul className="text-blue-100 space-y-2">
              <li className="flex items-center">
                <FiArrowRight className="h-4 w-4 mr-2" />
                Real-time monitoring of energy production
              </li>
              <li className="flex items-center">
                <FiArrowRight className="h-4 w-4 mr-2" />
                Remote control of connected devices
              </li>
              <li className="flex items-center">
                <FiArrowRight className="h-4 w-4 mr-2" />
                Battery status tracking and alerts
              </li>
              <li className="flex items-center">
                <FiArrowRight className="h-4 w-4 mr-2" />
                Energy usage analytics and reporting
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Enter your Solar ID to access your dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="solarId" className="block text-sm font-medium text-gray-700 mb-1">
                Solar ID
              </label>
              <input
                id="solarId"
                type="text"
                value={solarId}
                onChange={(e) => setSolarId(e.target.value)}
                placeholder="Enter your Solar ID (e.g. SX-1234)"
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Your Solar ID was provided with your system installation
              </p>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login to Dashboard'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Forgot your Solar ID? Contact support at support@solarx.com
              </p>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              &copy; 2025 SolarX Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;