const pool = require('../config/db');

class TelemetryModel {
  static async createTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS telemetry_data (
          id INT AUTO_INCREMENT PRIMARY KEY,
          data JSON NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Telemetry table created or already exists');
    } catch (error) {
      console.error('Error creating telemetry table:', error);
    }
  }

  static async insertData(data) {
    try {
      const [result] = await pool.query(
        'INSERT INTO telemetry_data (data) VALUES (?)',
        [JSON.stringify(data)]
      );
      return result;
    } catch (error) {
      console.error('Error inserting telemetry data:', error);
      throw error;
    }
  }

  static async getAllData() {
    try {
      const [rows] = await pool.query('SELECT * FROM telemetry_data ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('Error fetching telemetry data:', error);
      throw error;
    }
  }
}

module.exports = TelemetryModel;