const axios = require('axios');
const WebSocket = require('ws');

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

class YarvanE2ETest {
  constructor() {
    this.authToken = null;
    this.userId = null;
    this.driverId = null;
    this.tripId = null;
  }

  async runAllTests() {
    console.log('🚀 Starting Yarvan E2E Tests...\n');

    try {
      await this.testUserRegistration();
      await this.testDriverRegistration();
      await this.testTripCreation();
      await this.testDispatchAssignment();
      await this.testWebSocketTracking();
      await this.testNotifications();
      await this.testWalletOperations();
      await this.testComplianceCheck();
      await this.testGeofenceValidation();

      console.log('✅ All E2E tests passed successfully!');
    } catch (error) {
      console.error('❌ E2E test failed:', error.message);
      process.exit(1);
    }
  }

  async testUserRegistration() {
    console.log('1. Testing user registration and authentication...');
    
    const passengerData = {
      email: `passenger_${Date.now()}@test.com`,
      password: 'password123',
      role: 'passenger'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, passengerData);
    this.authToken = registerResponse.data.token;
    this.userId = registerResponse.data.user.id;

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: passengerData.email,
      password: passengerData.password
    });

    console.log('   ✓ User registration and login successful');
  }

  async testDriverRegistration() {
    console.log('2. Testing driver registration...');

    const driverData = {
      email: `driver_${Date.now()}@test.com`,
      password: 'password123',
      role: 'driver'
    };

    const driverRegResponse = await axios.post(`${API_BASE}/auth/register`, driverData);
    const driverToken = driverRegResponse.data.token;
    this.driverId = driverRegResponse.data.user.id;

    const driverProfile = {
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+573001234567',
      licenseNumber: 'LIC123456789'
    };

    await axios.post(`${API_BASE}/drivers`, driverProfile, {
      headers: { Authorization: `Bearer ${driverToken}` }
    });

    const vehicleData = {
      licensePlate: 'ABC123',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      color: 'Blanco'
    };

    await axios.post(`${API_BASE}/drivers/${this.driverId}/vehicles`, vehicleData, {
      headers: { Authorization: `Bearer ${driverToken}` }
    });

    await axios.put(`${API_BASE}/drivers/${this.driverId}/status`, 
      { status: 'online' }, 
      { headers: { Authorization: `Bearer ${driverToken}` } }
    );

    console.log('   ✓ Driver registration and setup successful');
  }

  async testTripCreation() {
    console.log('3. Testing trip creation...');

    const tripData = {
      passengerId: this.userId,
      originLat: 4.6097,
      originLng: -74.0817,
      originAddress: 'Zona Rosa, Bogotá',
      destinationLat: 4.5981,
      destinationLng: -74.0758,
      destinationAddress: 'Centro Histórico, Bogotá'
    };

    const tripResponse = await axios.post(`${API_BASE}/trips`, tripData, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });

    this.tripId = tripResponse.data.id;
    console.log('   ✓ Trip creation successful, ID:', this.tripId);
  }

  async testDispatchAssignment() {
    console.log('4. Testing dispatch assignment...');

    await axios.post(`${API_BASE}/dispatch/driver-location`, {
      driverId: this.driverId,
      lat: 4.6100,
      lng: -74.0820,
      status: 'online'
    });

    const assignmentResponse = await axios.get(`${API_BASE}/dispatch/assign/${this.tripId}`);
    
    if (assignmentResponse.data.driverId) {
      console.log('   ✓ Trip assigned to driver:', assignmentResponse.data.driverId);
      console.log('   ✓ ETA:', assignmentResponse.data.eta, 'minutes');
    } else {
      throw new Error('Trip assignment failed');
    }
  }

  async testWebSocketTracking() {
    console.log('5. Testing WebSocket real-time tracking...');

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:3004`);
      let messageReceived = false;

      ws.on('open', () => {
        ws.send(JSON.stringify({ action: 'join', room: `trip:${this.tripId}` }));
        
        setTimeout(() => {
          ws.send(JSON.stringify({
            action: 'location_update',
            tripId: this.tripId,
            location: { lat: 4.6105, lng: -74.0815 }
          }));
        }, 1000);
      });

      ws.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.type === 'location:update') {
          messageReceived = true;
          ws.close();
          console.log('   ✓ WebSocket tracking working correctly');
          resolve();
        }
      });

      ws.on('error', reject);

      setTimeout(() => {
        if (!messageReceived) {
          ws.close();
          reject(new Error('WebSocket test timeout'));
        }
      }, 5000);
    });
  }

  async testNotifications() {
    console.log('6. Testing notification system...');

    const notificationData = {
      type: 'push',
      recipient: `passenger_${this.userId}`,
      title: 'Test Notification',
      message: 'This is a test notification from E2E tests',
      data: { tripId: this.tripId }
    };

    const notifResponse = await axios.post(`${API_BASE}/notifications/send`, notificationData, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });

    if (notifResponse.data.success) {
      console.log('   ✓ Notification sent successfully');
    } else {
      throw new Error('Notification sending failed');
    }
  }

  async testWalletOperations() {
    console.log('7. Testing wallet operations...');

    const walletResponse = await axios.post(`${API_BASE}/wallet`, 
      { userId: this.userId }, 
      { headers: { Authorization: `Bearer ${this.authToken}` } }
    );

    const walletId = walletResponse.data.id;

    await axios.post(`${API_BASE}/wallet/${walletId}/deposit`, {
      amount: 50000,
      description: 'Test deposit'
    }, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });

    await axios.post(`${API_BASE}/wallet/${walletId}/trip-payment`, {
      amount: 15000,
      tripId: this.tripId,
      savingsPercentage: 10
    }, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });

    const balanceResponse = await axios.get(`${API_BASE}/wallet/${walletId}/balance`, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });

    console.log('   ✓ Wallet operations successful');
    console.log('   ✓ Balance:', balanceResponse.data.balance);
    console.log('   ✓ Savings:', balanceResponse.data.savingsBalance);
  }

  async testComplianceCheck() {
    console.log('8. Testing compliance system...');

    const plateCheck = await axios.get(`${API_BASE}/compliance/check-plate?plate=ABC123`, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });

    console.log('   ✓ Compliance check completed');
    console.log('   ✓ Overall status:', plateCheck.data.overallStatus);
  }

  async testGeofenceValidation() {
    console.log('9. Testing geofence validation...');

    const geofenceData = {
      name: 'Test Pico y Placa Zone',
      type: 'pico_placa',
      polygon: [
        { lat: 4.6090, lng: -74.0820 },
        { lat: 4.6100, lng: -74.0820 },
        { lat: 4.6100, lng: -74.0810 },
        { lat: 4.6090, lng: -74.0810 }
      ]
    };

    await axios.post(`${API_BASE}/geofence`, geofenceData, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });

    const locationCheck = await axios.post(`${API_BASE}/geofence/check`, {
      lat: 4.6095,
      lng: -74.0815,
      licensePlate: 'ABC123'
    }, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    });

    console.log('   ✓ Geofence validation completed');
    console.log('   ✓ Restrictions found:', locationCheck.data.hasRestrictions);
  }
}

if (require.main === module) {
  const test = new YarvanE2ETest();
  test.runAllTests().catch(console.error);
}

module.exports = YarvanE2ETest;