
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sqa-assignment-default-rtdb.firebaseio.com/"
});

const db = admin.database();

class FirebaseService {
  static async updateStatus(device, action, value) {
    try {
      const ref = db.ref(`status/${device}/${action}`);
      await ref.set(value);
      console.log(`Firebase updated: ${device}/${action} = ${value}`);
    } catch (error) {
      console.error('Firebase update error:', error);
    }
  }

  static async getCurrentStatus() {
    try {
      const snapshot = await db.ref('status').once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Firebase read error:', error);
      return null;
    }
  }

  static async updateBatteryStatus(percentage = null, voltage = null) {
    try {
      const ref = db.ref('status/battery');
      const updateData = { lastUpdated: new Date().toISOString() };
      
      if (percentage !== null) updateData.percentage = percentage;
      if (voltage !== null) updateData.voltage = voltage;
      
      await ref.update(updateData);
      console.log(`Battery status updated: ${
        percentage !== null ? `${percentage}% ` : ''
      }${
        voltage !== null ? `${voltage}V` : ''
      }`.trim());
    } catch (error) {
      console.error('Firebase battery update error:', error);
    }
  }

  static async getBatteryStatus() {
    try {
      const snapshot = await db.ref('status/battery').once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error getting battery status:', error);
      throw error;
    }
  }

  static async getSystemAlerts(limit = 5) {
    try {
      const snapshot = await db.ref('alerts')
        .orderByChild('timestamp')
        .limitToLast(limit)
        .once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error getting alerts:', error);
      throw error;
    }
  }
  
  static async getNightModeStatus() {
    try {
      const snapshot = await db.ref('status/Night/Mode').once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error getting night mode status:', error);
      return false;
    }
  }

  static async updateNightMode(isNightMode) {
    try {
      const ref = db.ref('status/Night/Mode');
      await ref.set(isNightMode);
      console.log(`Night mode updated: ${isNightMode}`);
      return true;
    } catch (error) {
      console.error('Firebase night mode update error:', error);
      return false;
    }
  }

  static async createAlert(alertData) {
    try {
      const newAlertRef = db.ref('alerts').push()
      await newAlertRef.set({
        ...alertData,
        timestamp: Date.now(),
        isRead: false,
        isResolved: false
      })
      console.log('Alert created with ID:', newAlertRef.key)
      return newAlertRef.key
    } catch (error) {
      console.error('Error creating alert:', error)
      throw error
    }
  }

  static async createRelayStatusAlert(relayNumber, state) {
    const alertData = {
      title: `Relay ${relayNumber} ${state ? 'Activated' : 'Deactivated'}`,
      message: `Relay ${relayNumber} has been turned ${state ? 'ON' : 'OFF'}.`,
      type: 'info',
      source: 'System',
      deviceId: `DEV00${relayNumber}`
    }
    
    return await this.createAlert(alertData)
  }

  static async createBatteryAlert(percentage) {
    // Only create alerts for low battery levels
    if (percentage <= 20) {
      const alertData = {
        title: `Battery Level Low: ${percentage}%`,
        message: `The system battery has dropped to ${percentage}%. Consider charging soon to prevent system shutdown.`,
        type: percentage <= 10 ? 'error' : 'warning',
        source: 'Battery Monitor',
        deviceId: 'DEV003'
      }
      
      return await this.createAlert(alertData)
    }
    
    // For demo purposes, let's also create an alert when battery is full
    if (percentage >= 95) {
      const alertData = {
        title: `Battery Fully Charged: ${percentage}%`,
        message: `The system battery is now fully charged at ${percentage}%.`,
        type: 'info',
        source: 'Battery Monitor',
        deviceId: 'DEV003'
      }
      
      return await this.createAlert(alertData)
    }
    
    return null
  }

  static async getAllAlerts() {
    try {
      const snapshot = await db.ref('alerts').once('value')
      return snapshot.val() || {}
    } catch (error) {
      console.error('Error getting alerts:', error)
      throw error
    }
  }
}
module.exports = FirebaseService;module.exports = FirebaseService;
// Replace the last line that has duplicate exports:
module.exports = FirebaseService;