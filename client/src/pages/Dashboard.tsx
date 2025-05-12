import { FiArrowUp, FiArrowDown, FiSun, FiDollarSign, FiActivity, FiBattery, FiCloud, FiCloudRain, FiWind, FiThermometer, FiBell, FiPieChart, FiZap, FiInfo, FiExternalLink } from 'react-icons/fi';
import { database } from "../firebase"; // adjust path as needed
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";








const Dashboard = () => {


  const [batteryPercentage, setBatteryPercentage] = useState<number | null>(null);

  useEffect(() => {
    const batteryRef = ref(database, "status/battery/percentage");
    const unsubscribe = onValue(batteryRef, (snapshot) => {
      const value = snapshot.val();
      if (typeof value === "number") {
        setBatteryPercentage(value);
      }
    });

    return () => unsubscribe();
  }, []);


  const [voltage, setVoltage] = useState<number | null>(null);


  useEffect(() => {
    const voltageRef = ref(database, "status/battery/voltage");
    const unsubscribe = onValue(voltageRef, (snapshot) => {
      const value = snapshot.val();
      if (typeof value === "number") {
        setVoltage(value);
      }
    });
  
    return () => unsubscribe();
  }, []);
  



  // Mock data for the dashboard
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
      value: voltage !== null ? `${voltage} V` : 'Loading...', 
      change: '-2%', 
      isPositive: false,
      icon: <FiActivity className="w-6 h-6 text-blue-500" /> 
    }
    ,
    { 
      title: 'Battery Storage', 
      value: batteryPercentage !== null ? `${batteryPercentage}%` : 'Loading...', 
      change: '+5%', 
      isPositive: true,
      icon: <FiBattery className="w-6 h-6 text-indigo-500" /> 
    },
  ];

  // Mock data for weather forecast
  const weatherForecast = [
    { day: 'Today', condition: 'Sunny', icon: <FiSun className="w-6 h-6 text-yellow-500" />, temp: '28°C', production: 'Excellent' },
    { day: 'Tomorrow', condition: 'Partly Cloudy', icon: <FiCloud className="w-6 h-6 text-gray-500" />, temp: '24°C', production: 'Good' },
    { day: 'Wednesday', condition: 'Rainy', icon: <FiCloudRain className="w-6 h-6 text-blue-500" />, temp: '19°C', production: 'Poor' },
    { day: 'Thursday', condition: 'Windy', icon: <FiWind className="w-6 h-6 text-teal-500" />, temp: '22°C', production: 'Moderate' },
    { day: 'Friday', condition: 'Sunny', icon: <FiSun className="w-6 h-6 text-yellow-500" />, temp: '27°C', production: 'Excellent' },
  ];

  // Mock data for recent alerts
  const recentAlerts = [
    { id: 'ALT001', title: 'System Offline', type: 'error', time: '30 minutes ago' },
    { id: 'ALT002', title: 'Low Energy Production', type: 'warning', time: '3 hours ago' },
    { id: 'ALT003', title: 'Battery Below 20%', type: 'warning', time: '5 hours ago' },
  ];

  // Mock data for energy consumption
  const energyConsumption = [
    { category: 'Home Appliances', percentage: 45, color: 'bg-blue-500' },
    { category: 'Heating/Cooling', percentage: 30, color: 'bg-green-500' },
    { category: 'Lighting', percentage: 15, color: 'bg-indigo-500' },
    { category: 'Other', percentage: 10, color: 'bg-yellow-500' },
  ];

  // Mock data for hourly production
  const hourlyProduction = [
    { time: '6 AM', value: 0.2 },
    { time: '8 AM', value: 1.5 },
    { time: '10 AM', value: 3.8 },
    { time: '12 PM', value: 5.2 },
    { time: '2 PM', value: 4.8 },
    { time: '4 PM', value: 3.2 },
    { time: '6 PM', value: 1.0 },
    { time: '8 PM', value: 0.1 },
  ];

  // Mock data for energy saving tips
  const energySavingTips = [
    "Schedule high-energy appliances during peak solar production hours",
    "Clean your solar panels regularly to maintain optimal efficiency",
    "Consider adding battery storage to maximize self-consumption",
    "Use smart home devices to automate energy usage based on production"
  ];



  return (
    <div className="space-y-6">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Monitor your solar energy performance</p>
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

      {/* Main Content - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Energy Production Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:col-span-2">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Energy Production History</h2>
          <div className="h-64 md:h-80">
            {/* Simple chart visualization */}
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
        
        {/* System Health */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">System Health</h2>
          <div className="space-y-3 md:space-y-4">
            {['Solar Panels', 'Inverter', 'Battery', 'Connection'].map((item, index) => (
              <div key={index} className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-sm md:text-base text-gray-600">{item}</span>
                <span className="text-sm md:text-base text-green-500 font-medium">Optimal</span>
              </div>
            ))}
          </div>
          <button className="mt-4 md:mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm md:text-base font-medium transition-colors">
            View Full Report
          </button>
        </div>
      </div>

      {/* Main Content - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
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

        {/* Energy Consumption */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Energy Consumption</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div style={{ 
                  background: 'conic-gradient(#3B82F6 0% 45%, #10B981 45% 75%, #6366F1 75% 90%, #F59E0B 90% 100%)'
                }} className="w-full h-full"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                  <FiPieChart className="text-blue-500 h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {energyConsumption.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${item.color} rounded-sm mr-2`}></div>
                  <span className="text-sm text-gray-600">{item.category}</span>
                </div>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">Recent Alerts</h2>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">{recentAlerts.length} new</span>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg ${
                alert.type === 'error' ? 'bg-red-50' : 
                alert.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
              }`}>
                <div className="flex items-start">
                  {alert.type === 'error' ? (
                    <FiBell className="mt-0.5 h-4 w-4 text-red-500 flex-shrink-0" />
                  ) : alert.type === 'warning' ? (
                    <FiBell className="mt-0.5 h-4 w-4 text-yellow-500 flex-shrink-0" />
                  ) : (
                    <FiBell className="mt-0.5 h-4 w-4 text-blue-500 flex-shrink-0" />
                  )}
                  <div className="ml-2 flex-1">
                    <p className="text-sm font-medium text-gray-800">{alert.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Alerts <FiExternalLink className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Energy Saving Tips */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex items-center mb-3 md:mb-4">
          <FiInfo className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Energy Saving Tips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {energySavingTips.map((tip, index) => (
            <div key={index} className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;