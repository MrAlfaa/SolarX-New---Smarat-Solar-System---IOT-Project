import { useState } from 'react';
import { FiUser, FiSettings, FiBell, FiShield, FiGlobe, FiSave, FiToggleLeft, FiToggleRight, FiUpload, FiEdit2, FiDownload, FiInfo } from 'react-icons/fi';

const Settings = () => {
  // State for form values
  const [userSettings, setUserSettings] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    language: 'en',
    timezone: 'UTC-5',
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    dataSharing: true,
    twoFactorAuth: false
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState('profile');

  // Handle toggle changes
  const handleToggle = (setting: string) => {
    setUserSettings({
      ...userSettings,
      [setting]: !userSettings[setting as keyof typeof userSettings]
    });
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserSettings({
      ...userSettings,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the settings to the backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage your account and system preferences</p>
        </div>
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          <FiSave className="w-4 h-4" /> Save All Changes
        </button>
      </header>

      {/* Settings Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiUser className="h-4 w-4" />
              <span>Profile</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'system'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiSettings className="h-4 w-4" />
              <span>System</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'notifications'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >            <div className="flex items-center gap-2">
              <FiBell className="h-4 w-4" />
              <span>Notifications</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'security'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiShield className="h-4 w-4" />
              <span>Security</span>
            </div>
          </button>
        </div>

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                      {userSettings.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-200">
                      <FiEdit2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <h3 className="mt-4 font-medium text-gray-900">{userSettings.name}</h3>
                  <p className="text-sm text-gray-500">{userSettings.email}</p>
                  <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">
                    Change Profile Picture
                  </button>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userSettings.name}
                        onChange={handleInputChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userSettings.email}
                        onChange={handleInputChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={userSettings.language}
                        onChange={handleInputChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        value={userSettings.timezone}
                        onChange={handleInputChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC-7">Mountain Time (UTC-7)</option>
                        <option value="UTC-6">Central Time (UTC-6)</option>
                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                        <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
                        <option value="UTC+1">Central European Time (UTC+1)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Dark Mode</h4>
                        <p className="text-xs text-gray-500">Enable dark mode for the interface</p>
                      </div>
                      <button 
                        onClick={() => handleToggle('darkMode')}
                        className={`${
                          userSettings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                      >
                        <span className="sr-only">Toggle dark mode</span>
                        <span
                          className={`${
                            userSettings.darkMode ? 'translate-x-6' : 'translate-x-1'
                          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="p-4 md:p-6">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-base font-medium text-gray-900 mb-2">System Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Software Version</p>
                    <p className="text-sm font-medium">v2.3.0</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Update</p>
                    <p className="text-sm font-medium">June 15, 2023</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">System Status</p>
                    <p className="text-sm font-medium text-green-600">Operational</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Connected Devices</p>
                    <p className="text-sm font-medium">5</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <FiDownload className="mr-1.5 h-3 w-3" />
                    Check for Updates
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <FiInfo className="mr-1.5 h-3 w-3" />
                    System Diagnostics
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Data Management</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Data Backup</h4>
                      <p className="text-xs text-gray-500">Automatically backup your system data</p>
                    </div>
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <FiDownload className="mr-1.5 h-3 w-3" />
                      Backup Now
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Data Export</h4>
                      <p className="text-xs text-gray-500">Export your data in various formats</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        CSV
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        JSON
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        PDF
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Data Sharing</h4>
                      <p className="text-xs text-gray-500">Share anonymous data to improve our services</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('dataSharing')}
                      className={`${
                        userSettings.dataSharing ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                    >
                      <span className="sr-only">Toggle data sharing</span>
                      <span
                        className={`${
                          userSettings.dataSharing ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Display Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">
                      Measurement Units
                    </label>
                    <select
                      id="units"
                      name="units"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="metric">Metric (kWh, °C)</option>
                      <option value="imperial">Imperial (kWh, °F)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="gbp">GBP (£)</option>
                      <option value="jpy">JPY (¥)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="p-4 md:p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-xs text-gray-500">Receive system alerts and reports via email</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('emailNotifications')}
                      className={`${
                        userSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                    >
                      <span className="sr-only">Toggle email notifications</span>
                      <span
                        className={`${
                          userSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-xs text-gray-500">Receive notifications on your device</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('pushNotifications')}
                      className={`${
                        userSettings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                    >
                      <span className="sr-only">Toggle push notifications</span>
                      <span
                        className={`${
                          userSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-xs text-gray-500">Receive critical alerts via SMS</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('smsNotifications')}
                      className={`${
                        userSettings.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                    >
                      <span className="sr-only">Toggle SMS notifications</span>
                      <span
                        className={`${
                          userSettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Alert Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['System Errors', 'Low Energy Production', 'Battery Status', 'Weather Alerts', 'Maintenance Reminders', 'Software Updates'].map((alert, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        id={`alert-${index}`}
                        name={`alert-${index}`}
                        type="checkbox"
                        defaultChecked={true}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`alert-${index}`} className="ml-2 block text-sm text-gray-700">
                      {alert}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Notification Schedule</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="notification-frequency" className="block text-sm font-medium text-gray-700 mb-1">
                      Report Frequency
                    </label>
                    <select
                      id="notification-frequency"
                      name="notification-frequency"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="quiet-hours" className="block text-sm font-medium text-gray-700 mb-1">
                      Quiet Hours
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quiet-hours-start" className="block text-xs text-gray-500">
                          Start
                        </label>
                        <input
                          type="time"
                          id="quiet-hours-start"
                          name="quiet-hours-start"
                          defaultValue="22:00"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="quiet-hours-end" className="block text-xs text-gray-500">
                          End
                        </label>
                        <input
                          type="time"
                          id="quiet-hours-end"
                          name="quiet-hours-end"
                          defaultValue="07:00"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="p-4 md:p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Account Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('twoFactorAuth')}
                      className={`${
                        userSettings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                    >
                      <span className="sr-only">Toggle two-factor authentication</span>
                      <span
                        className={`${
                          userSettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                      />
                    </button>
                  </div>
                  
                  <div>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">API Access</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">API Key</h4>
                      <p className="text-xs text-gray-500">Use this key to access the API</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="password"
                        readOnly
                        value="••••••••••••••••"
                        className="block w-40 md:w-60 border border-gray-300 rounded-md shadow-sm py-1.5 px-3 bg-gray-50 text-sm"
                      />
                      <button className="ml-2 text-blue-600 hover:text-blue-800">
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Authorized Applications</h4>
                      <p className="text-xs text-gray-500">Manage applications with access to your account</p>
                    </div>
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h3 className="text-base font-medium text-red-800 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">These actions are irreversible. Please proceed with caution.</p>
                <div className="space-y-3">
                  <button className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                    Reset System
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Connected Services</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FiGlobe className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Weather Service</h3>
                  <p className="text-xs text-gray-500">Connected</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">Configure</button>
            </div>
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <FiUpload className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Cloud Backup</h3>
                  <p className="text-xs text-gray-500">Connected</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">Configure</button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                  <FiSettings className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Smart Home Integration</h3>
                  <p className="text-xs text-gray-500">Not connected</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">Connect</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Help & Support</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <FiInfo className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Documentation</h3>
                  <p className="text-xs text-gray-500">Access user guides and tutorials</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
            </div>
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                  <FiBell className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Contact Support</h3>
                  <p className="text-xs text-gray-500">Get help from our support team</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">Contact</button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <FiShield className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Privacy Policy</h3>
                  <p className="text-xs text-gray-500">Review our privacy policy</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
