

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

  static async storeEnergyProduction(hourlyProduction) {
    try {
      const ref = db.ref('status/energy/production');
      await ref.set(hourlyProduction);
      console.log('Energy production data stored in Firebase');
      return true;
    } catch (error) {
      console.error('Error storing energy production data:', error);
      return false;
    }
  }
  
  static async getEnergyProductionHistory() {
    try {
      const snapshot = await db.ref('status/energy/production').once('value');
      const energyData = snapshot.val();
      
      if (energyData) {
        return energyData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting energy production data:', error);
      return null;
    }
  }
}

module.exports = FirebaseService;