import { useState } from 'react';

export default function PassengerApp() {
  const [user, setUser] = useState(null);
  const [tripForm, setTripForm] = useState({
    originAddress: '', destinationAddress: '', distance: 5
  });

  const registerUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:3003/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const newUser = await response.json();
      setUser(newUser);
      alert('¡Registro exitoso!');
    } catch (error) {
      alert('Error en registro');
    }
  };

  const [quote, setQuote] = useState(null);
  const [requesting, setRequesting] = useState(false);

  const getQuote = async () => {
    if (!tripForm.originAddress || !tripForm.destinationAddress) {
      alert('Completa origen y destino');
      return;
    }

    try {
      const response = await fetch('http://localhost:3006/pricing/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originLat: 4.6097,
          originLng: -74.0817,
          destLat: 4.5981,
          destLng: -74.0758,
          serviceType: 'standard'
        })
      });
      const quoteData = await response.json();
      setQuote(quoteData);
    } catch (error) {
      alert('Error obteniendo cotización');
    }
  };

  const requestTrip = async () => {
    if (!user) {
      alert('Debes registrarte primero');
      return;
    }
    
    setRequesting(true);
    try {
      // Solicitar a través de dispatch
      const response = await fetch('http://localhost:3007/dispatch/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passengerId: user.id,
          originLat: 4.6097,
          originLng: -74.0817,
          destLat: 4.5981,
          destLng: -74.0758,
          ...tripForm
        })
      });
      const result = await response.json();
      
      if (result.driverId) {
        alert(`¡Viaje asignado! Conductor: ${result.driverId}, ETA: ${result.eta} min`);
      } else {
        alert('Viaje en cola, buscando conductor...');
      }
    } catch (error) {
      alert('Error solicitando viaje');
    }
    setRequesting(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '400px', margin: '0 auto' }}>
      <h1>📱 Yarvan Passenger</h1>
      
      {!user ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>👤 Registro de Pasajero</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            registerUser({
              firstName: formData.get('firstName'),
              lastName: formData.get('lastName'),
              email: formData.get('email'),
              phone: formData.get('phone')
            });
          }}>
            <input name="firstName" placeholder="Nombre" required style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input name="lastName" placeholder="Apellido" required style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input name="email" type="email" placeholder="Email" required style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input name="phone" placeholder="Teléfono" required style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', marginTop: '10px' }}>
              📝 Registrarse
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>👋 Hola, {user.firstName}!</h3>
            <p>ID: {user.id}</p>
          </div>
          
          <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <h2>🚕 Solicitar Viaje</h2>
            <input 
              placeholder="Dirección de origen" 
              value={tripForm.originAddress}
              onChange={(e) => setTripForm({...tripForm, originAddress: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input 
              placeholder="Dirección de destino" 
              value={tripForm.destinationAddress}
              onChange={(e) => setTripForm({...tripForm, destinationAddress: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input 
              type="number" 
              placeholder="Distancia (km)" 
              value={tripForm.distance}
              onChange={(e) => setTripForm({...tripForm, distance: parseInt(e.target.value)})}
              style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            
            <button onClick={getQuote} style={{ width: '100%', padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', marginTop: '10px' }}>
              💰 Cotizar Viaje
            </button>
            
            {quote && (
              <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '8px', margin: '10px 0' }}>
                <h4>💵 Cotización</h4>
                <p><strong>Tarifa: ${quote.fare.toLocaleString()}</strong></p>
                <p>Distancia: {quote.distanceKm} km</p>
                <p>Tiempo estimado: {quote.timeMin} min</p>
                <p>Multiplicador: {quote.surge}x</p>
              </div>
            )}
            
            <button onClick={requestTrip} disabled={requesting} style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: requesting ? '#ccc' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              marginTop: '10px',
              cursor: requesting ? 'not-allowed' : 'pointer'
            }}>
              {requesting ? '⏳ Solicitando...' : '🚖 Solicitar Viaje'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}