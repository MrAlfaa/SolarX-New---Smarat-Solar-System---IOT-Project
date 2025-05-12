const pool = require('../config/db');
const FirebaseService = require('../services/firebaseService');

class StatusModel {
  static async createTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS status_data (
          id INT AUTO_INCREMENT PRIMARY KEY,
          device VARCHAR(50),
          action VARCHAR(50),
          value VARCHAR(50),
          raw_message VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Status table created or already exists');
    } catch (error) {
      console.error('Error creating status table:', error);
    }
  }

  static async insertData(statusMessage) {
    try {
      // Parse the message
      let device, action, value;
      const parts = statusMessage.split('_');
      
      if (parts.length === 2) {
        [action, value] = parts;
      } else if (parts.length === 3) {
        [device, action, value] = parts;
      }

      // Convert to boolean where applicable
      let boolValue;
      if (value === 'ON' || value === 'STARTED') boolValue = true;
      if (value === 'OFF' || value === 'STOPPED') boolValue = false;

      // Store in MySQL
      const [result] = await pool.query(
        'INSERT INTO status_data (device, action, value, raw_message) VALUES (?, ?, ?, ?)',
        [device, action, value, statusMessage]
      );

      // Update Firebase
      if (device && action) {
        await FirebaseService.updateStatus(device, action, boolValue !== undefined ? boolValue : value);
      } else if (action) {
        await FirebaseService.updateStatus('system', action, boolValue !== undefined ? boolValue : value);
      }

      return result;
    } catch (error) {
      console.error('Error inserting status data:', error);
      throw error;
    }
  }

  static async getAllData(limit = 100) {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM status_data 
        ORDER BY created_at DESC 
        LIMIT ?
      `, [limit]);
      return rows;
    } catch (error) {
      console.error('Error fetching status data:', error);
      throw error;
    }
  }
}

module.exports = StatusModel;