import { useState } from 'react';
import { FiCalendar, FiDownload, FiBarChart2, FiPieChart, FiTrendingUp, FiSun, FiCloud, FiDollarSign } from 'react-icons/fi';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('line');
  
  // Mock data for analytics
  const performanceMetrics = [
    { name: 'Total Production', value: '1,284 kWh', change: '+12%', isPositive: true },
    { name: 'Peak Output', value: '8.2 kW', change: '+5%', isPositive: true },
    { name: 'Efficiency Rate', value: '94%', change: '+2%', isPositive: true },
    { name: 'CO₂ Saved', value: '920 kg', change: '+15%', isPositive: true },
  ];
  
  const monthlyData = [
    { month: 'Jan', production: 850, consumption: 920 },
    { month: 'Feb', production: 940, consumption: 950 },
    { month: 'Mar', production: 1020, consumption: 980 },
    { month: 'Apr', production: 1150, consumption: 1000 },
    { month: 'May', production: 1260, consumption: 1050 },
    { month: 'Jun', production: 1320, consumption: 1100 },
    { month: 'Jul', production: 1340, consumption: 1200 },
    { month: 'Aug', production: 1290, consumption: 1150 },
    { month: 'Sep', production: 1190, consumption: 1050 },
    { month: 'Oct', production: 1050, consumption: 980 },
    { month: 'Nov', production: 920, consumption: 950 },
    { month: 'Dec', production: 830, consumption: 940 },
  ];

  // Mock data for energy distribution
  const energyDistribution = [
    { category: 'Home Appliances', percentage: 45 },
    { category: 'Heating/Cooling', percentage: 30 },
    { category: 'Lighting', percentage: 15 },
    { category: 'Other', percentage: 10 },
  ];

  // Mock data for daily production
  const dailyProduction = [
    { time: '6 AM', value: 0.2 },
    { time: '8 AM', value: 1.5 },
    { time: '10 AM', value: 3.8 },
    { time: '12 PM', value: 5.2 },
    { time: '2 PM', value: 4.8 },
    { time: '4 PM', value: 3.2 },
    { time: '6 PM', value: 1.0 },
    { time: '8 PM', value: 0.1 },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Analyze your solar energy performance and trends</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setTimeRange('day')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                timeRange === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
              aria-label="View daily data"
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
              aria-label="View weekly data"
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
              aria-label="View monthly data"
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                timeRange === 'year' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
              aria-label="View yearly data"
            >
              Year
            </button>
          </div>
          
          <button 
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            aria-label="Select custom date range"
          >
            <FiCalendar className="mr-2 h-4 w-4" />
            Custom Range
          </button>
          
          <button 
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            aria-label="Export analytics data"
          >
            <FiDownload className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </header>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <p className="text-sm text-gray-500 font-medium">{metric.name}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 mt-2">{metric.value}</p>
            <div className={`flex items-center mt-2 text-sm ${metric.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <FiTrendingUp className="mr-1" aria-hidden="true" />
              <span>{metric.change} vs. previous period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Energy Production vs. Consumption</h2>
          <div className="mt-3 sm:mt-0 inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 text-sm font-medium rounded-l-md ${
                chartType === 'line' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
              aria-label="Show line chart"
              title="Show line chart"
            >
              <FiTrendingUp className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 text-sm font-medium ${
                chartType === 'bar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
              aria-label="Show bar chart"
              title="Show bar chart"
            >
              <FiBarChart2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setChartType('pie')}
              className={`px-3 py-1.5 text-sm font-medium rounded-r-md ${
                chartType === 'pie' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
              aria-label="Show pie chart"
              title="Show pie chart"
            >
              <FiPieChart className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          {/* Chart placeholder - would be replaced with actual chart library */}
          <div className="w-full h-full px-4 py-2">
            {chartType === 'line' && (
              <div className="w-full h-full relative">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
                <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-200"></div>
                
                {/* Mock line chart */}
                <div className="absolute bottom-0 left-0 right-0 h-3/4 flex items-end">
                  {monthlyData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center" style={{ height: '100%' }}>
                      <div className="relative w-full h-full flex items-end justify-center">
                        <div 
                          className="w-1 bg-blue-500 rounded-t-sm" 
                          style={{ height: `${(data.production / 1400) * 100}%` }}
                          aria-hidden="true"
                        ></div>
                        <div 
                          className="w-1 bg-green-500 rounded-t-sm ml-1" 
                          style={{ height: `${(data.consumption / 1400) * 100}%` }}
                          aria-hidden="true"
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {chartType === 'bar' && (
              <div className="w-full h-full flex items-end justify-around">
                {monthlyData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="flex items-end space-x-1">
                      <div 
                        className="w-5 bg-blue-500 rounded-t-sm" 
                        style={{ height: `${(data.production / 1400) * 250}px` }}
                        aria-hidden="true"
                      ></div>
                      <div 
                        className="w-5 bg-green-500 rounded-t-sm" 
                        style={{ height: `${(data.consumption / 1400) * 250}px` }}
                        aria-hidden="true"
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{data.month}</span>
                  </div>
                ))}
              </div>
            )}
            
            {chartType === 'pie' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-200" aria-hidden="true">
                  <div className="absolute inset-0" style={{ 
                    clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)',
                    background: 'conic-gradient(#3B82F6 0% 45%, #10B981 45% 75%, #6366F1 75% 90%, #F59E0B 90% 100%)'
                  }}></div>
                </div>
                <div className="ml-8">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2" aria-hidden="true"></div>
                      <span className="text-sm text-gray-600">Home Appliances (45%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-sm mr-2" aria-hidden="true"></div>
                      <span className="text-sm text-gray-600">Heating/Cooling (30%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-indigo-500 rounded-sm mr-2" aria-hidden="true"></div>
                      <span className="text-sm text-gray-600">Lighting (15%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-sm mr-2" aria-hidden="true"></div>
                      <span className="text-sm text-gray-600">Other (10%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center mt-4 space-x-8">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2" aria-hidden="true"></div>
            <span className="text-sm text-gray-600">Production</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-2" aria-hidden="true"></div>
            <span className="text-sm text-gray-600">Consumption</span>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Daily Production Pattern */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Production Pattern</h2>
          <div className="h-64 flex items-end justify-around">
            {dailyProduction.map((hour, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="w-6 bg-yellow-400 rounded-t-sm" 
                  style={{ height: `${(hour.value / 5.2) * 180}px` }}
                  aria-hidden="true"
                ></div>
                <span className="text-xs text-gray-500 mt-1">{hour.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <FiSun className="text-yellow-500 mr-1" aria-hidden="true" />
              <span>Peak: 5.2 kW at 12 PM</span>
            </div>
            <div className="flex items-center">
              <FiCloud className="text-gray-400 mr-1" aria-hidden="true" />
              <span>Weather Impact: Low</span>
            </div>
          </div>
        </div>
        
        {/* Financial Analysis */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Analysis</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Monthly Savings</span>
              <span className="font-medium text-green-500">$128.50</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Annual Projection</span>
              <span className="font-medium text-green-500">$1,542.00</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">ROI Progress</span>
              <span className="font-medium">42%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Payback Period</span>
              <span className="font-medium">4.2 years</span>
            </div>
          </div>
          <div className="mt-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    ROI Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">
                    42%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div 
                  style={{ width: "42%" }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  aria-label="ROI progress: 42%"
                  role="progressbar"
                  aria-valuenow={42}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              aria-label="View full financial report"
            >
              <FiDollarSign className="mr-2 h-4 w-4" aria-hidden="true" />
              View Full Financial Report
            </button>
          </div>
        </div>
      </div>
      
      {/* Insights Section */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">System Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Optimal Production</h3>
            <p className="text-sm text-blue-600">Your system is producing at 94% of its rated capacity, which is excellent. Consider cleaning panels to reach 100%.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-medium text-green-800 mb-2">Cost Efficiency</h3>
            <p className="text-sm text-green-600">You're saving $0.12 per kWh compared to grid electricity. Total savings this month: $128.50.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-medium text-purple-800 mb-2">Environmental Impact</h3>
            <p className="text-sm text-purple-600">Your system has prevented 920kg of CO₂ emissions this month, equivalent to planting 42 trees.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
