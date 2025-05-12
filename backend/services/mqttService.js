const mqtt = require('mqtt');
require('dotenv').config();
const TelemetryModel = require('../models/telemetryModel');
const StatusModel = require('../models/statusModel');
const BatteryModel = require('../models/batteryModel');
const FirebaseService = require('./firebaseService');  // Add Firebase service

class MQTTService {
  constructor() {
    this.client = mqtt.connect(process.env.MQTT_BROKER_URL, {
      clientId: process.env.MQTT_CLIENT_ID,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      
      // Subscribe to data topics
      this.client.subscribe([
        process.env.TELEMETRY_TOPIC,
        process.env.STATUS_TOPIC,
        process.env.BATTERY_TOPIC,
        process.env.VOLTAGE_TOPIC
      ], (err) => {
        if (!err) {
          console.log(`Subscribed to topics: ${process.env.TELEMETRY_TOPIC}, ${process.env.STATUS_TOPIC}, ${process.env.BATTERY_TOPIC}, ${process.env.VOLTAGE_TOPIC}`);
        } else {
          console.error('Subscription error:', err);
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      try {
        const msgString = message.toString();
        console.log(`Received message on ${topic}: ${msgString}`);
        
        if (topic === process.env.TELEMETRY_TOPIC) {
          // Store telemetry data
          const data = JSON.parse(msgString);
          await TelemetryModel.insertData(data);
          console.log('Telemetry data stored in database');
          
        } else if (topic === process.env.STATUS_TOPIC) {
          // Parse and handle status messages
          const parts = msgString.split('_');
          if (parts.length >= 2) {
            const device = parts.length === 3 ? parts[0] : null;
            const action = parts.length === 3 ? parts[1] : parts[0];
            const value = parts.length === 3 ? parts[2] : parts[1];
            
            // Store in MySQL
            await StatusModel.insertData(msgString);
            
            // Update Firebase
            const boolValue = value === 'ON' || value === 'STARTED' ? true :
                             value === 'OFF' || value === 'STOPPED' ? false : null;
            
            if (boolValue !== null) {
              if (device) {
                await FirebaseService.updateStatus(device, action, boolValue);
              } else {
                await FirebaseService.updateStatus('system', action, boolValue);
              }
            }
          }
          console.log('Status processed and stored');
          
        } else if (topic === process.env.BATTERY_TOPIC) {
          // Handle battery data
          const percentage = parseFloat(msgString);
          if (!isNaN(percentage)) {
            // Store in MySQL
            await BatteryModel.insertData(percentage, null);
            
            // Update Firebase
            await FirebaseService.updateBatteryStatus(percentage);
            
            console.log(`Battery percentage stored: ${percentage}%`);
          } else {
            console.error('Invalid battery percentage received:', msgString);
          }
        } else if (topic === process.env.VOLTAGE_TOPIC) {
          const voltage = parseFloat(msgString);
          if (!isNaN(voltage)) {
            const latest = await BatteryModel.getLatestData();
            if (latest) {
              await BatteryModel.updateVoltage(latest.id, voltage);
            } else {
              await BatteryModel.insertData(null, voltage);
            }
            await FirebaseService.updateBatteryStatus(latest?.percentage, voltage);
          }
        } 
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    this.client.on('error', (error) => {
      console.error('MQTT Error:', error);
    });

    this.client.on('close', () => {
      console.log('MQTT connection closed');
    });

    this.client.on('offline', () => {
      console.log('MQTT client offline');
    });
  }

  publishRelayCommand(relayNumber, state) {
    const topic = relayNumber === 1 ? process.env.RELAY1_TOPIC : process.env.RELAY2_TOPIC;
    const message = state ? 'ON' : 'OFF';
    
    this.client.publish(topic, message, { qos: 1 }, (err) => {
      if (err) {
        console.error(`Error publishing to ${topic}:`, err);
      } else {
        console.log(`Published to ${topic}: ${message}`);
        
        // Update Firebase immediately for responsive UI
        FirebaseService.updateStatus(`relay${relayNumber}`, 'ON', state)
          .catch(err => console.error('Firebase update error:', err));
      }
    });
  }
}

module.exports = new MQTTService();