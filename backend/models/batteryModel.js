console.log('Loading BatteryModel module...');
const pool = require('../config/db');

class BatteryModel {
  static async createTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS battery_data (
          id INT AUTO_INCREMENT PRIMARY KEY,
          percentage DECIMAL(5,2),
          voltage DECIMAL(5,2),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Battery table created or already exists');
    } catch (error) {
      console.error('Error creating battery table:', error);
    }
  }

  static async insertData(percentage = null, voltage = null) {
    try {
      const [result] = await pool.query(
        'INSERT INTO battery_data (percentage, voltage) VALUES (?, ?)',
        [percentage, voltage]
      );
      return result;
    } catch (error) {
      console.error('Error inserting battery data:', error);
      throw error;
    }
  }

  static async updateVoltage(id, voltage) {
    try {
      const [result] = await pool.query(
        'UPDATE battery_data SET voltage = ? WHERE id = ?',
        [voltage, id]
      );
      return result;
    } catch (error) {
      console.error('Error updating voltage:', error);
      throw error;
    }
  }

  static async getLatestData() {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM battery_data 
        ORDER BY created_at DESC 
        LIMIT 1
      `);
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching battery data:', error);
      throw error;
    }
  }

  static async getAllData(limit = 100) {
    try {
      // Convert limit to a number to ensure it's used as a numeric value
      const numericLimit = parseInt(limit, 10);
      
      // Execute query with numeric limit directly in the query string 
      // instead of using a parameter placeholder for LIMIT
      const [rows] = await pool.query(
        `SELECT * FROM battery_data ORDER BY created_at DESC LIMIT ${numericLimit}`
      );
      return rows;
    } catch (error) {
      console.error('Error fetching battery data:', error);
      throw error;
    }
  }
  
  static async getDataForPeriod(days = 7) {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM battery_data 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        ORDER BY created_at ASC
      `, [days]);
      return rows;
    } catch (error) {
      console.error('Error fetching battery data for period:', error);
      throw error;
    }
  }
}

module.exports = BatteryModel;

module.exports = BatteryModel;