import { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiMoreVertical, FiWifi, FiWifiOff } from 'react-icons/fi';

const DeviceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);

  // Mock data for devices
  const mockDevices = [
    { 
      id: 'DEV001', 
      name: 'Main Solar Array', 
      type: 'Solar Panel', 
      location: 'Roof - South', 
      status: 'online', 
      lastSync: '2 minutes ago',
      power: '450W'
    },
    { 
      id: 'DEV002', 
      name: 'Backup Battery', 
      type: 'Battery Pack', 
      location: 'Garage', 
      status: 'online', 
      lastSync: '5 minutes ago',
      capacity: '85%'
    },
    { 
      id: 'DEV003', 
      name: 'Inverter A', 
      type: 'Inverter', 
      location: 'Utility Room', 
      status: 'offline', 
      lastSync: '3 hours ago',
      issue: 'Connection lost'
    },
    { 
      id: 'DEV004', 
      name: 'Secondary Array', 
      type: 'Solar Panel', 
      location: 'Roof - West', 
      status: 'online', 
      lastSync: '1 minute ago',
      power: '320W'
    },
    { 
      id: 'DEV005', 
      name: 'Weather Station', 
      type: 'Sensor', 
      location: 'Garden', 
      status: 'online', 
      lastSync: '10 minutes ago',
      temp: '28°C'
    },
  ];

  // Filter devices based on search and status filter
  const filteredDevices = mockDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          device.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || device.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Device Management</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage and monitor your solar equipment</p>
        </div>
        <button 
          onClick={() => setShowAddDeviceModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Add New Device
        </button>
      </header>

      {/* Device Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <p className="text-gray-500 text-xs md:text-sm font-medium">Total Devices</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{mockDevices.length}</p>
          <div className="flex items-center mt-3 md:mt-4 text-sm text-gray-500">
            <span>{mockDevices.filter(d => d.status === 'online').length} online</span>
            <span className="mx-2">•</span>
            <span>{mockDevices.filter(d => d.status === 'offline').length} offline</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <p className="text-gray-500 text-xs md:text-sm font-medium">Solar Panels</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
            {mockDevices.filter(d => d.type === 'Solar Panel').length}
          </p>
          <div className="flex items-center mt-3 md:mt-4 text-sm text-green-500">
            <span>770W Total Output</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <p className="text-gray-500 text-xs md:text-sm font-medium">Batteries</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
            {mockDevices.filter(d => d.type === 'Battery Pack').length}
          </p>
          <div className="flex items-center mt-3 md:mt-4 text-sm text-blue-500">
            <span>85% Average Capacity</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <p className="text-gray-500 text-xs md:text-sm font-medium">Last Update</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">2 min ago</p>
          <div className="flex items-center mt-3 md:mt-4 text-sm text-gray-500">
            <span>Auto-refresh enabled</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search devices..."
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              title="Filter devices by status"
              aria-label="Filter devices by status"
            >
              <option value="all">All Devices</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Desktop view: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sync</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDevices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{device.name}</div>
                        <div className="text-sm text-gray-500">{device.id} • {device.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{device.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {device.status === 'online' ? (
                        <FiWifi className="mr-1 h-3 w-3" />
                      ) : (
                        <FiWifiOff className="mr-1 h-3 w-3" />
                      )}
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.lastSync}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Edit device">
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete device">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900" title="More options">
                        <FiMoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view: Card list */}
        <div className="md:hidden space-y-4">
          {filteredDevices.map((device) => (
            <div key={device.id} className="bg-white border rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{device.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{device.id} • {device.type}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {device.status === 'online' ? (
                    <FiWifi className="mr-1 h-3 w-3" />
                  ) : (
                    <FiWifiOff className="mr-1 h-3 w-3" />
                  )}
                  {device.status}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>
                  <span className="font-medium">Location:</span> {device.location}
                </div>
                <div>
                  <span className="font-medium">Last Sync:</span> {device.lastSync}
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button className="text-blue-600 hover:text-blue-900" title="Edit device">
                  <FiEdit2 className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900" title="Delete device">
                  <FiTrash2 className="h-4 w-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-900" title="More options">
                  <FiMoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No devices found. Try adjusting your search or filter.</p>
          </div>
        )}
      </div>

      {/* Device Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Device Health Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Overall System Health</span>
              <span className="text-sm text-green-500 font-medium">Good</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Devices Requiring Attention</span>
              <span className="text-sm text-red-500 font-medium">1</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Average Uptime</span>
              <span className="text-sm text-gray-700 font-medium">99.2%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Last Maintenance</span>
              <span className="text-sm text-gray-700 font-medium">14 days ago</span>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
              Schedule Maintenance
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FiWifi className="h-6 w-6 text-blue-500 mb-2" />
              <span className="text-sm text-gray-700">Check Connectivity</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FiPlus className="h-6 w-6 text-green-500 mb-2" />
              <span className="text-sm text-gray-700">Add New Device</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FiEdit2 className="h-6 w-6 text-yellow-500 mb-2" />
              <span className="text-sm text-gray-700">Bulk Edit</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FiMoreVertical className="h-6 w-6 text-purple-500 mb-2" />
              <span className="text-sm text-gray-700">More Options</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddDeviceModal(false)}></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Device</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="device-name" className="block text-sm font-medium text-gray-700">Device Name</label>
                        <input
                          type="text"
                          id="device-name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g. Main Solar Array"
                        />
                      </div>
                      <div>
                        <label htmlFor="device-type" className="block text-sm font-medium text-gray-700">Device Type</label>
                        <select
                          id="device-type"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          title="Select device type"
                          aria-label="Select device type"
                        >
                          <option value="">Select a type</option>
                          <option value="solar-panel">Solar Panel</option>
                          <option value="battery">Battery</option>
                          <option value="inverter">Inverter</option>
                          <option value="sensor">Sensor</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="device-location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                          type="text"
                          id="device-location"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g. Roof - South"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Device
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDeviceModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;