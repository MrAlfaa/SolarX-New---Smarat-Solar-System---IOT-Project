require('dotenv').config();
const express = require('express');
const path = require('path');
const DatabaseService = require('./services/databaseService');
const MQTTService = require('./services/mqttService');
const RelayController = require('./controllers/relayController');
const FirebaseService = require('./services/firebaseService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Initialize services
async function initializeServices() {
  try {
    await DatabaseService.initialize();
    console.log('Services initialized');
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Replace the existing root route with:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Add this route to your existing index.js
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API Endpoints
app.post('/api/relay/control', RelayController.controlRelay);

app.get('/api/data/telemetry', async (req, res) => {
  try {
    const data = await DatabaseService.getTelemetryData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching telemetry data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/data/status', async (req, res) => {
  try {
    const data = await DatabaseService.getStatusData();
    res.json({
      success: true,
      data: data.map(item => ({
        id: item.id,
        message: item.status_message,
        timestamp: item.created_at
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching status data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error'
    });
  }
});

// Add new battery data endpoint
app.get('/api/data/battery', async (req, res) => {
  try {
    const data = await DatabaseService.getBatteryData();
    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching battery data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/data/battery/latest', async (req, res) => {
  try {
    const data = await DatabaseService.getLatestBatteryData();
    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching latest battery data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error'
    });
  }
});

// Add these new endpoints to your existing index.js

// Get battery status from Firebase
app.get('/api/firebase/battery', async (req, res) => {
  try {
    const batteryStatus = await FirebaseService.getBatteryStatus();
    res.json({
      success: true,
      data: batteryStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch battery data'
    });
  }
});

// Get system status from Firebase
app.get('/api/firebase/status', async (req, res) => {
  try {
    const systemStatus = await FirebaseService.getCurrentStatus();
    res.json({
      success: true,
      data: systemStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system status'
    });
  }
});

// Get historical data from MySQL
app.get('/api/historical/:type', async (req, res) => {
  try {
    const { type } = req.params;
    // Parse limit as an integer to ensure it's a number before passing to DB functions
    const limit = parseInt(req.query.limit || 100, 10);
    
    let data;
    switch(type) {
      case 'battery':
        data = await DatabaseService.getBatteryData(limit);
        break;
      case 'telemetry':
        data = await DatabaseService.getTelemetryData();
        break;
      case 'status':
        data = await DatabaseService.getStatusData(limit);
        break;
      default:
        return res.status(400).json({ error: 'Invalid data type' });
    }
    
    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/historical endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical data'
    });
  }
});


// In your index.js
app.get('/api/realtime', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const sendUpdate = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Listen to Firebase changes
  const batteryRef = db.ref('status/battery');
  batteryRef.on('value', (snapshot) => {
    sendUpdate({
      type: 'battery',
      data: snapshot.val()
    });
  });

  // Clean up on client disconnect
  req.on('close', () => {
    batteryRef.off();
  });
});

// Start server
// Add this endpoint to get night mode status
app.get('/api/data/nightmode', async (req, res) => {
  try {
    const isNightMode = await FirebaseService.getNightModeStatus();
    res.json({
      success: true,
      data: { isNightMode },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching night mode data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error'
    });
  }
});

// Add endpoint to update night mode status
app.post('/api/data/nightmode', async (req, res) => {
  try {
    const { isNightMode } = req.body;
    
    if (typeof isNightMode !== 'boolean') {
      return res.status(400).json({ error: 'Invalid night mode value' });
    }
    
    await FirebaseService.updateNightMode(isNightMode);
    
    res.json({
      success: true,
      message: `Night mode set to ${isNightMode ? 'ON' : 'OFF'}`
    });
  } catch (error) {
    console.error('Error updating night mode:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Add this endpoint near other API routes
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await FirebaseService.getAllAlerts();
    res.json({
      success: true,
      data: alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);

// Add this at the start of your endpoints section for debugging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} request received for ${req.url}`);
  next();
});

// Add this endpoint with enhanced logging
app.get('/api/data/energy-production', async (req, res) => {
  console.log('🔍 Received request for energy production data');
  try {
    const { days = 7 } = req.query;
    console.log(`📊 Fetching energy production data for ${days} days`);
    
    const data = await DatabaseService.getEnergyProductionHistory(parseInt(days));
    console.log(`✅ Successfully calculated energy production data`);
    
    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching energy production data:', error);

    res.status(500).json({ 
      success: false,
      error: 'Internal server error'
    });
  }
});


// Add endpoints to mark alerts
app.post('/api/alerts/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await FirebaseService.updateStatus(`alerts/${id}`, 'isRead', true);
    res.json({
      success: true,
      message: 'Alert marked as read'
    });
  } catch (error) {
    console.error('Error marking alert as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/alerts/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    await FirebaseService.updateStatus(`alerts/${id}`, 'isResolved', true);
    res.json({
      success: true,
      message: 'Alert marked as resolved'
    });
  } catch (error) {
    console.error('Error marking alert as resolved:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add/Update device name
app.post('/api/devices/name', async (req, res) => {
  try {
    const { relayNumber, name } = req.body;
    
    if (!relayNumber || (relayNumber !== 1 && relayNumber !== 2)) {
      return res.status(400).json({ error: 'Invalid relay number' });
    }
    
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid device name' });
    }
    
    const success = await FirebaseService.updateDeviceName(relayNumber, name);
    
    if (success) {
      return res.json({
        success: true,
        message: `Device name updated for relay ${relayNumber}`
      });
    } else {
      return res.status(500).json({ error: 'Failed to update device name' });
    }
  } catch (error) {
    console.error('Error updating device name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete/Reset device
app.delete('/api/devices/:relayNumber', async (req, res) => {
  try {
    const relayNumber = parseInt(req.params.relayNumber, 10);
    
    console.log(`Backend received request to delete relay ${relayNumber}`);
    
    if (isNaN(relayNumber) || (relayNumber !== 1 && relayNumber !== 2)) {
      return res.status(400).json({ error: 'Invalid relay number' });
    }
    
    const success = await FirebaseService.deleteDevice(relayNumber);
    
    if (success) {
      return res.json({
        success: true,
        message: `Device reset for relay ${relayNumber}`
      });
    } else {
      return res.status(500).json({ error: 'Failed to reset device' });
    }
  } catch (error) {
    console.error('Error resetting device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeServices();

  // Make sure this function is available immediately when the application starts
  const calculateAndStoreEnergyProduction = async () => {
    try {
      const days = 7; // Get data for the last 7 days
      const energyData = await DatabaseService.getEnergyProductionHistory(days);
  
      // Store in Firebase for quick access from the frontend
      await FirebaseService.storeEnergyProduction(energyData);
  
      console.log('Energy production calculation completed and stored');
    } catch (error) {
      console.error('Error in energy production calculation task:', error);
    }
  };

  // Run immediately at startup
  calculateAndStoreEnergyProduction();

  // Then schedule to run every hour
  setInterval(calculateAndStoreEnergyProduction, 60 * 60 * 1000);
});