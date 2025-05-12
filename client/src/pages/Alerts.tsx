import { useState } from 'react';
import { FiBell, FiFilter, FiCheck, FiX, FiAlertTriangle, FiAlertCircle, FiInfo, FiChevronDown, FiChevronUp, FiSearch, FiSettings } from 'react-icons/fi';

// Define type-safe interfaces for our data
interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
  isRead: boolean;
  isResolved: boolean;
  source: string;
  deviceId?: string;
}

// Type for filter state
type FilterState = {
  type: 'all' | 'error' | 'warning' | 'info';
  status: 'all' | 'unread' | 'read' | 'resolved' | 'unresolved';
  timeRange: 'all' | 'today' | 'week' | 'month';
};

const Alerts = () => {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    status: 'all',
    timeRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  // Mock data for alerts
  const mockAlerts: Alert[] = [
    {
      id: 'ALT001',
      title: 'System Offline',
      message: 'Main solar array has been disconnected from the grid. Please check the connection and inverter status.',
      type: 'error',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      isResolved: false,
      source: 'System Monitor',
      deviceId: 'DEV001'
    },
    {
      id: 'ALT002',
      title: 'Low Energy Production',
      message: 'Energy production is 35% below expected levels for current weather conditions. Consider checking for panel obstructions or dirt buildup.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      isRead: true,
      isResolved: false,
      source: 'Performance Analyzer',
      deviceId: 'DEV001'
    },
    {
      id: 'ALT003',
      title: 'Battery Below 20%',
      message: 'Backup battery storage has dropped below 20%. Consider reducing power consumption or scheduling a charge cycle during off-peak hours.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      isRead: true,
      isResolved: true,
      source: 'Battery Monitor',
      deviceId: 'DEV002'
    },
    {
      id: 'ALT004',
      title: 'Maintenance Reminder',
      message: 'It has been 6 months since your last system inspection. Schedule a maintenance check to ensure optimal performance.',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: false,
      isResolved: false,
      source: 'Maintenance Scheduler'
    },
    {
      id: 'ALT005',
      title: 'Weather Alert',
      message: 'Severe weather conditions expected in your area within the next 48 hours. System has automatically enabled storm protection mode.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
      isRead: false,
      isResolved: false,
      source: 'Weather Integration',
    },
    {
      id: 'ALT006',
      title: 'Inverter Efficiency Decreased',
      message: 'Inverter efficiency has dropped by 8% over the past week. This may indicate a potential hardware issue that requires attention.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      isRead: true,
      isResolved: false,
      source: 'Performance Analyzer',
      deviceId: 'DEV003'
    },
    {
      id: 'ALT007',
      title: 'New Feature Available',
      message: 'A new software update is available for your monitoring system. Update includes improved weather prediction and energy optimization features.',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      isRead: true,
      isResolved: true,
      source: 'System Updates'
    },
  ];

  // Filter alerts based on search term and filters
  const filteredAlerts = mockAlerts.filter(alert => {
    // Search filter
    const matchesSearch = 
      searchTerm === '' || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = 
      filters.type === 'all' || 
      alert.type === filters.type;
    
    // Status filter
    let matchesStatus = filters.status === 'all';
    if (filters.status === 'read') matchesStatus = alert.isRead;
    if (filters.status === 'unread') matchesStatus = !alert.isRead;
    if (filters.status === 'resolved') matchesStatus = alert.isResolved;
    if (filters.status === 'unresolved') matchesStatus = !alert.isResolved;
    
    // Time range filter
    let matchesTimeRange = filters.timeRange === 'all';
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    if (filters.timeRange === 'today') matchesTimeRange = alert.timestamp >= today;
    if (filters.timeRange === 'week') matchesTimeRange = alert.timestamp >= weekAgo;
    if (filters.timeRange === 'month') matchesTimeRange = alert.timestamp >= monthAgo;
    
    return matchesSearch && matchesType && matchesStatus && matchesTimeRange;
  });

  // Sort alerts by timestamp (newest first)
  const sortedAlerts = [...filteredAlerts].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  // Helper function to format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Helper function to get alert icon based on type
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <FiAlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />;
      case 'warning':
        return <FiAlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />;
      case 'info':
        return <FiInfo className="h-5 w-5 text-blue-500" aria-hidden="true" />;
    }
  };

  // Helper function to get alert background color based on type and read status
  const getAlertBgColor = (alert: Alert): string => {
    if (alert.isResolved) return 'bg-gray-50';
    if (!alert.isRead) {
      switch (alert.type) {
        case 'error': return 'bg-red-50';
        case 'warning': return 'bg-yellow-50';
        case 'info': return 'bg-blue-50';
      }
    }
    return 'bg-white';
  };

  // Toggle alert expanded state
  const toggleAlertExpanded = (id: string) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };

  // Mark alert as read
  const markAsRead = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // In a real app, this would update the backend
    console.log(`Marking alert ${id} as read`);
  };

  // Mark alert as resolved
  const markAsResolved = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // In a real app, this would update the backend
    console.log(`Marking alert ${id} as resolved`);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      timeRange: 'all'
    });
    setSearchTerm('');
  };

  // Count unread alerts
  const unreadCount = mockAlerts.filter(alert => !alert.isRead).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <div className="relative">
            <FiBell className="h-6 w-6 text-blue-600 mr-3" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Alerts</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread alert${unreadCount !== 1 ? 's' : ''}`
                : 'All caught up! No unread alerts'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search alerts..."
              aria-label="Search alerts"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <FiFilter className="mr-2 h-4 w-4" aria-hidden="true" />
            Filter
            {(filters.type !== 'all' || filters.status !== 'all' || filters.timeRange !== 'all') && (
              <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>
          
          <button 
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Alert settings"
          >
            <FiSettings className="mr-2 h-4 w-4" aria-hidden="true" />
            Settings
          </button>
        </div>
      </header>

      {/* Filter Panel */}
      {showFilters && (
        <div id="filter-panel" className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-lg font-medium text-gray-800">Filter Alerts</h2>
            <button 
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
              aria-label="Reset all filters"
            >
              Reset all filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Alert Type
              </label>
              <select
                id="type-filter"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value as FilterState['type']})}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Types</option>
                <option value="error">Errors</option>
                <option value="warning">Warnings</option>
                <option value="info">Information</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value as FilterState['status']})}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="unresolved">Unresolved</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="time-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select
                id="time-filter"
                value={filters.timeRange}
                onChange={(e) => setFilters({...filters, timeRange: e.target.value as FilterState['timeRange']})}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {sortedAlerts.length === 0 ? (
          <div className="p-6 text-center">
            <FiBell className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No alerts match your current filters. Try adjusting your search or filters.
            </p>
            <div className="mt-6">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset filters
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {sortedAlerts.map((alert) => (
              <li 
                key={alert.id} 
                className={`${getAlertBgColor(alert)} hover:bg-gray-50 transition-colors duration-150 ease-in-out`}
              >
                <div 
                  className="px-4 py-4 sm:px-6 cursor-pointer"
                  onClick={() => toggleAlertExpanded(alert.id)}
                  aria-expanded={expandedAlertId === alert.id}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="min-w-0 flex-1 px-4">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!alert.isRead ? 'text-gray-900' : 'text-gray-500'} truncate`}>
                            {alert.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              {alert.source}
                            </p>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-500 truncate">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0 flex items-center">
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        {formatRelativeTime(alert.timestamp)}
                      </p>
                      <button 
                        className="ml-4 text-gray-400 hover:text-gray-500"
                        aria-label={expandedAlertId === alert.id ? "Collapse alert details" : "Expand alert details"}
                      >
                        {expandedAlertId === alert.id ? (
                          <FiChevronUp className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <FiChevronDown className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded content */}
                  {expandedAlertId === alert.id && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-700 mb-4">
                        {alert.message}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex flex-col xs:flex-row gap-2">
                          {!alert.isRead && (
                            <button
                              onClick={(e) => markAsRead(alert.id, e)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              aria-label="Mark as read"
                            >
                              <FiCheck className="mr-1.5 h-3 w-3" aria-hidden="true" />
                              Mark as read
                            </button>
                          )}
                          {!alert.isResolved && (
                            <button
                              onClick={(e) => markAsResolved(alert.id, e)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              aria-label="Mark as resolved"
                            >
                              <FiX className="mr-1.5 h-3 w-3" aria-hidden="true" />
                              Mark as resolved
                            </button>
                          )}
                        </div>
                        {alert.deviceId && (
                          <p className="text-xs text-gray-500">
                            Device ID: {alert.deviceId}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Alerts;
