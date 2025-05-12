require('dotenv').config();
const express = require('express');
const path = require('path');
const DatabaseService = require('./services/databaseService');
const MQTTService = require('./services/mqttService');
const RelayController = require('./controllers/relayController');

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
    const { limit = 100 } = req.query;
    
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeServices();
});