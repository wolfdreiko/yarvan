import { useState, useEffect } from 'react';

export default function DriverApp() {
  const [driver, setDriver] = useState(null);
  const [trips, setTrips] = useState([]);
  const [status, setStatus] = useState('offline');

  const registerDriver = async (driverData) => {
    try {
      const response = await fetch('http://localhost:3004/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driverData)
      });
      const newDriver = await response.json();
      setDriver(newDriver);
      alert('¡Registro de conductor exitoso!');
    } catch (error) {
      alert('Error en registro');
    }
  };

  const toggleStatus = async () => {
    if (!driver) return;
    
    const newStatus = status === 'online' ? 'offline' : 'online';
    try {
      // Actualizar estado en drivers service
      await fetch(`http://localhost:3004/drivers/${driver.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      // Notificar a dispatch
      await fetch('http://localhost:3007/dispatch/driver-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: driver.id,
          lat: 4.6097,
          lng: -74.0817,
          status: newStatus
        })
      });
      
      setStatus(newStatus);
    } catch (error) {
      alert('Error cambiando estado');
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:3005/trips');
      const allTrips = await response.json();
      setTrips(allTrips.filter(trip => trip.status === 'pending'));
    } catch (error) {
      console.error('Error fetching trips');
    }
  };

  const acceptTrip = async (tripId) => {
    try {
      await fetch(`http://localhost:3005/trips/${tripId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' })
      });
      alert('¡Viaje aceptado!');
      fetchTrips();
    } catch (error) {
      alert('Error aceptando viaje');
    }
  };

  useEffect(() => {
    if (driver && status === 'online') {
      fetchTrips();
      const interval = setInterval(fetchTrips, 5000);
      return () => clearInterval(interval);
    }
  }, [driver, status]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '400px', margin: '0 auto' }}>
      <h1>🚗 Yarvan Driver</h1>
      
      {!driver ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>👨‍✈️ Registro de Conductor</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            registerDriver({
              firstName: formData.get('firstName'),
              lastName: formData.get('lastName'),
              email: formData.get('email'),
              phone: formData.get('phone'),
              licenseNumber: formData.get('licenseNumber')
            });
          }}>
            <input name="firstName" placeholder="Nombre" required style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input name="lastName" placeholder="Apellido" required style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input name="email" type="email" placeholder="Email" required style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input name="phone" placeholder="Teléfono" required style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input name="licenseNumber" placeholder="Número de Licencia" required style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', marginTop: '10px' }}>
              📝 Registrarse como Conductor
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div style={{ backgroundColor: status === 'online' ? '#d4edda' : '#f8d7da', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>👋 Hola, {driver.firstName}!</h3>
            <p>Estado: <strong>{status === 'online' ? '🟢 En línea' : '🔴 Desconectado'}</strong></p>
            <button onClick={toggleStatus} style={{ 
              padding: '8px 16px', 
              backgroundColor: status === 'online' ? '#dc3545' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px' 
            }}>
              {status === 'online' ? '🔴 Desconectarse' : '🟢 Conectarse'}
            </button>
          </div>
          
          {status === 'online' && (
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
              <h2>🚕 Viajes Disponibles ({trips.length})</h2>
              {trips.length === 0 ? (
                <p>No hay viajes disponibles</p>
              ) : (
                trips.map(trip => (
                  <div key={trip.id} style={{ backgroundColor: '#fff8dc', padding: '15px', margin: '10px 0', borderRadius: '8px' }}>
                    <strong>Viaje #{trip.id.toString().slice(-4)}</strong><br/>
                    <p>📍 {trip.originAddress} → {trip.destinationAddress}</p>
                    <p>💰 Tarifa: ${trip.fare?.toLocaleString()}</p>
                    <button onClick={() => acceptTrip(trip.id)} style={{ 
                      width: '100%', 
                      padding: '10px', 
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px' 
                    }}>
                      ✅ Aceptar Viaje
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}