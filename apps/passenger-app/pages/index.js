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

  const requestTrip = async () => {
    if (!user) {
      alert('Debes registrarte primero');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3005/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passengerId: user.id,
          ...tripForm
        })
      });
      const trip = await response.json();
      alert(`¡Viaje solicitado! Tarifa: $${trip.fare.toLocaleString()}`);
    } catch (error) {
      alert('Error solicitando viaje');
    }
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
            <button onClick={requestTrip} style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', marginTop: '10px' }}>
              🚖 Solicitar Viaje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}