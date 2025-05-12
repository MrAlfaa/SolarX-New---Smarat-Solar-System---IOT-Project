const MQTTService = require('../services/mqttService');

class RelayController {
// In controllers/relayController.js, update the controlRelay method:
static async controlRelay(req, res) {
    try {
      const { relayNumber, state } = req.body;
      
      if (relayNumber !== 1 && relayNumber !== 2) {
        return res.status(400).json({ error: 'Invalid relay number' });
      }
  
      if (typeof state !== 'boolean') {
        return res.status(400).json({ error: 'Invalid state' });
      }
  
      MQTTService.publishRelayCommand(relayNumber, state);
      
      res.json({ 
        success: true,
        message: `Relay ${relayNumber} turned ${state ? 'ON' : 'OFF'}`
      });
    } catch (error) {
      console.error('Error controlling relay:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = RelayController;