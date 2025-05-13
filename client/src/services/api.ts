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

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: number;
  isRead: boolean;
  isResolved: boolean;
  source: string;
  deviceId?: string;
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
    
    // Add relay devices from Firebase ONLY if they have custom names
    if (statusData?.relay1 && statusData.relay1.name) {
      devices.push({
        id: 'DEV001',
        name: statusData.relay1.name,
        type: 'Relay',
        location: 'Control Panel',
        status: statusData.relay1.ON ? 'online' : 'offline',
        lastSync: new Date().toISOString(),
        data: { relay: 1, state: statusData.relay1.ON }
      });
    }
    
    if (statusData?.relay2 && statusData.relay2.name) {
      devices.push({
        id: 'DEV002',
        name: statusData.relay2.name,
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

// Similarly update the subscribeToDeviceUpdates function
export const subscribeToDeviceUpdates = (callback: (devices: DeviceStatus[]) => void): (() => void) => {
  const statusRef = ref(database, 'status');
  
  const unsubscribe = onValue(statusRef, (snapshot) => {
    const statusData = snapshot.val();
    const devices: DeviceStatus[] = [];
    
    console.log('Firebase status data updated:', statusData);
    
    // Only add relay devices that have custom names
    if (statusData?.relay1 && statusData.relay1.name) {
      devices.push({
        id: 'DEV001',
        name: statusData.relay1.name,
        type: 'Relay',
        location: 'Control Panel',
        status: statusData.relay1.ON ? 'online' : 'offline',
        lastSync: new Date().toISOString(),
        data: { relay: 1, state: statusData.relay1.ON }
      });
    }
    
    if (statusData?.relay2 && statusData.relay2.name) {
      devices.push({
        id: 'DEV002',
        name: statusData.relay2.name,
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

// Control relay
export const controlRelay = async (relayNumber: number, state: boolean): Promise<void> => {
  try {
    // First update Firebase directly for instant UI feedback
    const relayRef = ref(database, `status/relay${relayNumber}/ON`);
    await set(relayRef, state);
    
    // Then try to call the API, but don't wait for the response before updating the UI
    fetch('/api/relay/control', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        relayNumber,
        state
      })
    }).catch(err => {
      console.error('Error calling relay control API:', err);
      // We already updated Firebase, so UI should show the correct state
    });
  } catch (error) {
    console.error('Error controlling relay:', error);
    throw error;
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
  // export const subscribeToDeviceUpdates = (callback: (devices: DeviceStatus[]) => void): (() => void) => {
  //   const statusRef = ref(database, 'status');
  
  //   const unsubscribe = onValue(statusRef, (snapshot) => {
  //     const statusData = snapshot.val();
  //     const devices: DeviceStatus[] = [];
    
  //     console.log('Firebase status data updated:', statusData);
    
  //     // Only add relay devices that have custom names
  //     if (statusData?.relay1 && statusData.relay1.name) {
  //       devices.push({
  //         id: 'DEV001',
  //         name: statusData.relay1.name,
  //         type: 'Relay',
  //         location: 'Control Panel',
  //         status: statusData.relay1.ON ? 'online' : 'offline',
  //         lastSync: new Date().toISOString(),
  //         data: { relay: 1, state: statusData.relay1.ON }
  //       });
  //     }
    
  //     if (statusData?.relay2 && statusData.relay2.name) {
  //       devices.push({
  //         id: 'DEV002',
  //         name: statusData.relay2.name,
  //         type: 'Relay',
  //         location: 'Control Panel',
  //         status: statusData.relay2.ON ? 'online' : 'offline',
  //         lastSync: new Date().toISOString(),
  //         data: { relay: 2, state: statusData.relay2.ON }
  //       });
  //     }
    
  //     if (statusData?.battery) {
  //       devices.push({
  //         id: 'DEV003',
  //         name: 'Battery Pack',
  //         type: 'Battery',
  //         location: 'System',
  //         status: 'online',
  //         lastSync: statusData.battery.lastUpdated || new Date().toISOString(),
  //         data: {
  //           percentage: statusData.battery.percentage,
  //           voltage: statusData.battery.voltage
  //         }
  //       });
  //     }
    
  //     callback(devices);
  //   });
  
  //   return unsubscribe;
  // };
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
// Add these functions to api.ts

// Get night mode status
export const fetchNightModeStatus = async (): Promise<boolean> => {
  try {
    // Read directly from Firebase for real-time updates
    const nightModeRef = ref(database, 'status/Night/Mode');
    const snapshot = await get(nightModeRef);
    return snapshot.val() || false;
  } catch (error) {
    console.error('Error fetching night mode status:', error);
    return false;
  }
};

// Update night mode status
export const updateNightMode = async (isNightMode: boolean): Promise<void> => {
  try {
    // First update Firebase directly for instant UI feedback
    const nightModeRef = ref(database, 'status/Night/Mode');
    await set(nightModeRef, isNightMode);
    
    // Then try to call the API
    fetch('/api/data/nightmode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isNightMode
      })
    }).catch(err => {
      console.error('Error calling night mode API:', err);
      // We already updated Firebase, so UI should show the correct state
    });
  } catch (error) {
    console.error('Error controlling night mode:', error);
    throw error;
  }
};

// Subscribe to night mode changes
export const subscribeToNightMode = (callback: (isNightMode: boolean) => void): (() => void) => {
  const nightModeRef = ref(database, 'status/Night/Mode');
  
  const unsubscribe = onValue(nightModeRef, (snapshot) => {
    const isNightMode = snapshot.val() || false;
    callback(isNightMode);
  });
  
  return unsubscribe;
};

// Fetch alerts from Firebase
export const fetchAlerts = async (): Promise<Alert[]> => {
  try {
    const alertsRef = ref(database, 'alerts');
    const snapshot = await get(alertsRef);
    const alertsData = snapshot.val() || {};
    
    return Object.keys(alertsData).map(key => ({
      id: key,
      ...alertsData[key]
    }));
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};

// Subscribe to real-time alerts
export const subscribeToAlerts = (callback: (alerts: Alert[]) => void): (() => void) => {
  const alertsRef = ref(database, 'alerts');
  
  const unsubscribe = onValue(alertsRef, (snapshot) => {
    const alertsData = snapshot.val() || {};
    const alerts = Object.keys(alertsData).map(key => ({
      id: key,
      ...alertsData[key]
    }));
    
    callback(alerts);
  });
  
  return unsubscribe;
};

// Mark alert as read
export const markAlertAsRead = async (alertId: string): Promise<void> => {
  try {
    const alertRef = ref(database, `alerts/${alertId}/isRead`);
    await set(alertRef, true);
  } catch (error) {
    console.error('Error marking alert as read:', error);
    throw error;
  }
};

// Mark alert as resolved
export const markAlertAsResolved = async (alertId: string): Promise<void> => {
  try {
    const alertRef = ref(database, `alerts/${alertId}/isResolved`);
    await set(alertRef, true);
  } catch (error) {
    console.error('Error marking alert as resolved:', error);
    throw error;
  }
};

// Fetch historical battery data
export const fetchHistoricalBatteryData = async (limit = 100) => {
  try {
    const response = await fetch(`/api/historical/battery?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch battery history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching historical battery data:', error);
    throw error;
  }
};

// Fetch historical telemetry data
export const fetchHistoricalTelemetryData = async () => {
  try {
    const response = await fetch('/api/historical/telemetry');
    if (!response.ok) throw new Error('Failed to fetch telemetry history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching historical telemetry data:', error);
    throw error;
  }
};

// Fetch historical status data
export const fetchHistoricalStatusData = async (limit = 100) => {
  try {
    const response = await fetch(`/api/historical/status?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch status history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching historical status data:', error);
    throw error;
  }
};

// Add a new relay device (actually just updating the name in Firebase)
export const addRelayDevice = async (relayNumber: number, name: string): Promise<void> => {
  try {
    // Make sure this path matches how we're reading it above
    const relayRef = ref(database, `status/relay${relayNumber}/name`);
    await set(relayRef, name);
    
    // Also try to call the backend API to ensure synchronization
    fetch('/api/devices/name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        relayNumber,
        name
      })
    }).catch(err => {
      console.warn('API call failed, but Firebase was updated:', err);
    });
  } catch (error) {
    console.error('Error adding relay device:', error);
    throw error;
  }
};

// Update a relay device name
export const updateRelayDeviceName = async (relayNumber: number, name: string): Promise<void> => {
  try {
    const relayRef = ref(database, `status/relay${relayNumber}/name`);
    await set(relayRef, name);
    
    // Also try to call the backend API
    fetch('/api/devices/name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        relayNumber,
        name
      })
    }).catch(err => {
      console.warn('API call failed, but Firebase was updated:', err);
    });
  } catch (error) {
    console.error('Error updating relay device name:', error);
    throw error;
  }
};

// Delete a relay device (reset to default state)
export const deleteRelayDevice = async (relayNumber: number): Promise<DeviceStatus[] | void> => {
  try {
    console.log(`Attempting to delete relay device: ${relayNumber}`);
    
    // Turn off the relay first
    await controlRelay(relayNumber, false);
    
    // Remove the custom name (use null to clear the name)
    const relayRef = ref(database, `status/relay${relayNumber}/name`);
    await set(relayRef, null);
    console.log(`Firebase name key set to null for relay${relayNumber}`);
    
    // Also try to call the backend API
    try {
      const response = await fetch(`/api/devices/${relayNumber}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.warn(`API returned error: ${errorData.error || response.statusText}`);
      } else {
        console.log(`Backend API successfully deleted relay${relayNumber}`);
        
        // Force a refresh of the devices data to update UI
        const updatedDevices = await fetchDevices();
        return updatedDevices; // Return the updated list to caller
      }
    } catch (apiError) {
      console.warn('Backend API call failed, but Firebase was updated:', apiError);
    }
  } catch (error) {
    console.error('Error deleting relay device:', error);
    throw error;
  }
};