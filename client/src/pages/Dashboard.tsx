import { 
  FiArrowUp, FiArrowDown, FiSun, FiDollarSign, FiActivity, FiBattery, 
  FiCloud, FiCloudRain, FiWind, FiThermometer, 
  FiZap, FiPower, FiToggleLeft, FiToggleRight, 
  FiMoon // Add this icon for night mode
} from 'react-icons/fi';
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import { controlRelay, updateNightMode } from "../services/api";

const Dashboard = () => {
  // Add this state for night mode
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  
  // Your existing state variables...
  const [batteryPercentage, setBatteryPercentage] = useState<number | null>(null);
  const [voltage, setVoltage] = useState<number | null>(null);
  const [batteryHealth, setBatteryHealth] = useState("--");
  
  // Relay states
  const [relay1Status, setRelay1Status] = useState<boolean>(false);
  const [relay2Status, setRelay2Status] = useState<boolean>(false);
  
  // System status
  const [searchStatus, setSearchStatus] = useState<boolean>(false);
  const [lastCommand, setLastCommand] = useState<string>("--");
  const [lastUpdated, setLastUpdated] = useState<string>("--");

  // Add this effect to listen for night mode status
  useEffect(() => {
    const nightModeRef = ref(database, "status/Night/Mode");
    const unsubscribe = onValue(nightModeRef, (snapshot) => {
      const value = snapshot.val();
      if (typeof value === "boolean") {
        setIsNightMode(value);
      }
    });

    return () => unsubscribe();
  }, []);

  // Your existing useEffects...

  // Add this function to toggle night mode
  const toggleNightMode = async () => {
    try {
      await updateNightMode(!isNightMode);
      // The Firebase listener will update the state
      setLastCommand(`Night mode ${!isNightMode ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Failed to toggle night mode:', error);
    }
  };

  // Battery data listener
  useEffect(() => {
    const batteryRef = ref(database, "status/battery");
    const unsubscribe = onValue(batteryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (typeof data.percentage === "number") {
          setBatteryPercentage(data.percentage);
          
          // Set battery health based on percentage
          if (data.percentage > 70) {
            setBatteryHealth("Good");
          } else if (data.percentage > 30) {
            setBatteryHealth("Fair");
          } else {
            setBatteryHealth("Low");
          }
        }
        
        if (typeof data.voltage === "number") {
          setVoltage(data.voltage);
        }
        
        // Update last updated timestamp
        setLastUpdated(new Date().toLocaleTimeString());
      }
    });

    return () => unsubscribe();
  }, []);

  // Relay status listener
  useEffect(() => {
    const relay1Ref = ref(database, "status/relay1/ON");
    const relay1Unsubscribe = onValue(relay1Ref, (snapshot) => {
      const value = snapshot.val();
      if (typeof value === "boolean") {
        setRelay1Status(value);
      }
    });
    
    const relay2Ref = ref(database, "status/relay2/ON");
    const relay2Unsubscribe = onValue(relay2Ref, (snapshot) => {
      const value = snapshot.val();
      if (typeof value === "boolean") {
        setRelay2Status(value);
      }
    });

    return () => {
      relay1Unsubscribe();
      relay2Unsubscribe();
    };
  }, []);

  // System status listener
  useEffect(() => {
    const searchRef = ref(database, "status/system/Search");
    const unsubscribe = onValue(searchRef, (snapshot) => {
      const value = snapshot.val();
      if (typeof value === "boolean") {
        setSearchStatus(value);
      }
    });

    return () => unsubscribe();
  }, []);

  // Toggle relay function
  const toggleRelay = async (relayNumber: 1 | 2) => {
    const currentState = relayNumber === 1 ? relay1Status : relay2Status;
    const newState = !currentState;
    
    try {
      // Call the API service function
      await controlRelay(relayNumber, newState);
      
      // Update last command
      setLastCommand(`Relay ${relayNumber} turned ${newState ? 'ON' : 'OFF'}`);
    } catch (error) {
      console.error(`Failed to toggle relay ${relayNumber}:`, error);
    }
  };

  // Mock data (keeping some of the existing mock data for now)
  const stats = [
    { 
      title: 'Energy Production', 
      value: '24.5 kWh', 
      change: '+12%', 
      isPositive: true,
      icon: <FiSun className="w-6 h-6 text-yellow-500" /> 
    },
    { 
      title: 'Cost Savings', 
      value: '$128.50', 
      change: '+8%', 
      isPositive: true,
      icon: <FiDollarSign className="w-6 h-6 text-green-500" /> 
    },
    { 
      title: 'System Voltage', 
      value: voltage !== null ? `${voltage.toFixed(2)} V` : 'Loading...', 
      change: '-2%', 
      isPositive: false,
      icon: <FiActivity className="w-6 h-6 text-blue-500" /> 
    },
    { 
      title: 'Battery Storage', 
      value: batteryPercentage !== null ? `${batteryPercentage}%` : 'Loading...', 
      change: '+5%', 
      isPositive: true,
      icon: <FiBattery className="w-6 h-6 text-indigo-500" /> 
    },
  ];

  // Weather forecast (keeping existing)
  const weatherForecast = [
    { day: 'Today', condition: 'Sunny', icon: <FiSun className="w-6 h-6 text-yellow-500" />, temp: '28°C', production: 'Excellent' },
    { day: 'Tomorrow', condition: 'Partly Cloudy', icon: <FiCloud className="w-6 h-6 text-gray-500" />, temp: '24°C', production: 'Good' },
    { day: 'Wednesday', condition: 'Rainy', icon: <FiCloudRain className="w-6 h-6 text-blue-500" />, temp: '19°C', production: 'Poor' },
    { day: 'Thursday', condition: 'Windy', icon: <FiWind className="w-6 h-6 text-teal-500" />, temp: '22°C', production: 'Moderate' },
    { day: 'Friday', condition: 'Sunny', icon: <FiSun className="w-6 h-6 text-yellow-500" />, temp: '27°C', production: 'Excellent' },
  ];

  // Keep other existing mock data...

  return (
    <div className="space-y-6">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Monitor your solar energy performance</p>
        <p className="text-xs text-gray-500 mt-1">Last updated: {lastUpdated}</p>
      </header>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs md:text-sm font-medium">{stat.title}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className="p-2 md:p-3 rounded-full bg-gray-50">
                {stat.icon}
              </div>
            </div>
            <div className={`flex items-center mt-3 md:mt-4 text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {stat.isPositive ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
              <span className="font-medium">{stat.change}</span>
              <span className="text-gray-500 ml-1 text-xs md:text-sm">since last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* New: Device Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Relay Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Relay Control</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FiPower className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-700">Relay 1 (Bulb 1)</span>
              </div>
              <button 
                onClick={() => toggleRelay(1)}
                className={`flex items-center px-3 py-1 rounded-full transition-colors ${
                  relay1Status 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {relay1Status ? <FiToggleRight className="mr-1" /> : <FiToggleLeft className="mr-1" />}
                {relay1Status ? 'ON' : 'OFF'}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FiPower className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-700">Relay 2 (Bulb 2)</span>
              </div>
              <button 
                onClick={() => toggleRelay(2)}
                className={`flex items-center px-3 py-1 rounded-full transition-colors ${
                  relay2Status 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {relay2Status ? <FiToggleRight className="mr-1" /> : <FiToggleLeft className="mr-1" />}
                {relay2Status ? 'ON' : 'OFF'}
              </button>
            </div>
            
            <div className="mt-2 text-sm text-gray-500">
              {lastCommand !== "--" && (
                <div className="bg-blue-50 p-2 rounded text-blue-700">
                  Last command: {lastCommand}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Battery Status Panel */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Battery Status</h2>
          
          <div className="mb-4">
            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                style={{ width: `${batteryPercentage || 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{batteryPercentage !== null ? `${batteryPercentage}%` : 'Loading...'}</span>
              <span>{voltage !== null ? `${voltage.toFixed(2)}V` : ''}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FiBattery className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-700">Battery Health</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              batteryHealth === 'Good' ? 'bg-green-100 text-green-700' :
              batteryHealth === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
              batteryHealth === 'Low' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {batteryHealth}
            </span>
          </div>
        </div>
        
        {/* System Status Panel */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">System Status</h2>
          
          <div className="space-y-4">
            {/* Add Night Mode toggle here at the top of the list */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FiMoon className="w-5 h-5 text-indigo-500 mr-2" />
                <span className="text-gray-700">Night Mode</span>
              </div>
              <button 
                onClick={toggleNightMode}
                className={`flex items-center px-3 py-1 rounded-full transition-colors ${
                  isNightMode 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isNightMode ? <FiToggleRight className="mr-1" /> : <FiToggleLeft className="mr-1" />}
                {isNightMode ? 'ON' : 'OFF'}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Search Status</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                searchStatus 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {searchStatus ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                           <span className="text-gray-700">Connection</span>
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                Connected
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">System Mode</span>
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                Automatic
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Energy Production Chart - Keeping existing chart */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:col-span-2">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Energy Production History</h2>
          <div className="h-64 md:h-80">
            {/* Simple chart visualization - keep the existing implementation */}
            <div className="w-full h-full flex items-end justify-between px-2">
              {hourlyProduction.map((hour, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="w-6 md:w-8 bg-yellow-400 rounded-t-sm" 
                    style={{ height: `${(hour.value / 5.2) * 100}%` }}
                    aria-hidden="true"
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{hour.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <FiSun className="text-yellow-500 mr-1" aria-hidden="true" />
              <span>Peak: 5.2 kWh at 12 PM</span>
            </div>
            <div className="flex items-center">
              <FiZap className="text-orange-500 mr-1" aria-hidden="true" />
              <span>Total: 24.5 kWh</span>
            </div>
          </div>
        </div>
        
        {/* Weather Forecast */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Weather Forecast</h2>
          <div className="space-y-3">
            {weatherForecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center">
                  {day.icon}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{day.day}</p>
                    <p className="text-xs text-gray-500">{day.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{day.temp}</p>
                  <p className={`text-xs ${
                    day.production === 'Excellent' ? 'text-green-500' : 
                    day.production === 'Good' ? 'text-blue-500' : 
                    day.production === 'Moderate' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {day.production}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <FiThermometer className="mr-1" />
            <span>Weather data impacts production forecasts</span>
          </div>
        </div>
      </div>

      {/* Keep the rest of the existing dashboard code for Energy Consumption, Recent Alerts, etc. */}
    </div>
  );
};

export default Dashboard;
// Define the type for hourly production data
  interface HourlyProductionData {
    time: string;
    value: number;
  }

  // Add the missing hourlyProduction data with proper typing
  const hourlyProduction: HourlyProductionData[] = [
    { time: '6 AM', value: 0.2 },
    { time: '8 AM', value: 1.5 },
    { time: '10 AM', value: 3.8 },
    { time: '12 PM', value: 5.2 },
    { time: '2 PM', value: 4.8 },
    { time: '4 PM', value: 3.2 },
    { time: '6 PM', value: 1.0 },
    { time: '8 PM', value: 0.1 },
  ];