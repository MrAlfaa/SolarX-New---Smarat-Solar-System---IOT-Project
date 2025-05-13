import { database } from '../firebase';
import { ref, get, set, onValue } from 'firebase/database';

export interface DeviceStatus {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  lastSync: string;
  data?: any;
}

export interface RelayDevice {
  id: string;
  name: string;
  status: boolean;
}

// Fetch devices from Firebase or backend
export const fetchDevices = async (): Promise<DeviceStatus[]> => {
  try {
    // Get system status from Firebase
    const statusRef = ref(database, 'status');
    const snapshot = await get(statusRef);
    const statusData = snapshot.val();
    
    // Create devices array
    const devices: DeviceStatus[] = [];
    
    // Add relay devices from Firebase
    if (statusData?.relay1) {
      devices.push({
        id: 'DEV001',
        name: 'Relay 1 (Bulb 1)',
        type: 'Relay',
        location: 'Control Panel',
        status: statusData.relay1.ON ? 'online' : 'offline',
        lastSync: new Date().toISOString(),
        data: { relay: 1, state: statusData.relay1.ON }
      });
    }
    
    if (statusData?.relay2) {
      devices.push({
        id: 'DEV002',
        name: 'Relay 2 (Bulb 2)',
        type: 'Relay',
        location: 'Control Panel',
        status: statusData.relay2.ON ? 'online' : 'offline',
        lastSync: new Date().toISOString(),
        data: { relay: 2, state: statusData.relay2.ON }
      });
    }
    
    // Add battery status if available
    if (statusData?.battery) {
      devices.push({
        id: 'DEV003',
        name: 'Battery Pack',
        type: 'Battery',
        location: 'System',
        status: 'online',
        lastSync: statusData.battery.lastUpdated || new Date().toISOString(),
        data: {
          percentage: statusData.battery.percentage,
          voltage: statusData.battery.voltage
        }
      });
    }
    
    return devices;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

// Control relay
export const controlRelay = async (relayNumber: number, state: boolean): Promise<void> => {
  try {
    // First update Firebase directly for instant UI feedback
    const relayRef = ref(database, `status/relay${relayNumber}/ON`);
    await set(relayRef, state);
    
    // Then try to call the API
    const response = await fetch('/api/relay/control', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        relayNumber,
        state
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to control relay: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error controlling relay:', error);
    // We don't need to throw the error since Firebase was already updated
    // This prevents the UI from showing an error if only the API call fails
  }
};

// Get battery data
export const fetchBatteryData = async () => {
  try {
    // Don't use the API endpoint as it might not be proxied correctly
    // Instead, read directly from Firebase
    const batteryRef = ref(database, 'status/battery');
    const snapshot = await get(batteryRef);
    return {
      success: true,
      data: snapshot.val(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching battery data:', error);
    throw error;
  }
};

// Subscribe to real-time device updates
export const subscribeToDeviceUpdates = (callback: (devices: DeviceStatus[]) => void): (() => void) => {
  const statusRef = ref(database, 'status');
  
  const unsubscribe = onValue(statusRef, (snapshot) => {
    const statusData = snapshot.val();
    const devices: DeviceStatus[] = [];
    
    // Process the same way as fetchDevices
    if (statusData?.relay1) {
      devices.push({
        id: 'DEV001',
        name: 'Relay 1 (Bulb 1)',
        type: 'Relay',
        location: 'Control Panel',
        status: statusData.relay1.ON ? 'online' : 'offline',
        lastSync: new Date().toISOString(),
        data: { relay: 1, state: statusData.relay1.ON }
      });
    }
    
    if (statusData?.relay2) {
      devices.push({
        id: 'DEV002',
        name: 'Relay 2 (Bulb 2)',
        type: 'Relay',
        location: 'Control Panel',
        status: statusData.relay2.ON ? 'online' : 'offline',
        lastSync: new Date().toISOString(),
        data: { relay: 2, state: statusData.relay2.ON }
      });
    }
    
    if (statusData?.battery) {
      devices.push({
        id: 'DEV003',
        name: 'Battery Pack',
        type: 'Battery',
        location: 'System',
        status: 'online',
        lastSync: statusData.battery.lastUpdated || new Date().toISOString(),
        data: {
          percentage: statusData.battery.percentage,
          voltage: statusData.battery.voltage
        }
      });
    }
    
    callback(devices);
  });
  
  return unsubscribe;
};

// Get telemetry data
export const fetchTelemetryData = async () => {
  try {
    const response = await fetch('/api/data/telemetry');
    if (!response.ok) throw new Error('Failed to fetch telemetry data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching telemetry data:', error);
    throw error;
  }
};

// Get status data
export const fetchStatusData = async () => {
  try {
    const response = await fetch('/api/data/status');
    if (!response.ok) throw new Error('Failed to fetch status data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching status data:', error);
    throw error;
  }
};
