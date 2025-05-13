const TelemetryModel = require('../models/telemetryModel');
const StatusModel = require('../models/statusModel');
const BatteryModel = require('../models/batteryModel');

class DatabaseService {
  static async initialize() {
    try {
      await TelemetryModel.createTable();
      await StatusModel.createTable();
      await BatteryModel.createTable();
      console.log('Database initialized');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  static async getTelemetryData() {
    return await TelemetryModel.getAllData();
  }

  static async getStatusData() {
    return await StatusModel.getAllData();
  }
  
  static async getBatteryData(limit = 100) {
    // Ensure limit is a number before passing to the model
    return await BatteryModel.getAllData(parseInt(limit, 10));
  }
  
  static async getLatestBatteryData() {
    return await BatteryModel.getLatestData();
  }
}

module.exports = DatabaseService;