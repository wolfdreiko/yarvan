import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);

  const fetchData = async () => {
    try {
      const [usersRes, driversRes, tripsRes] = await Promise.all([
        fetch('http://localhost:3003/users'),
        fetch('http://localhost:3004/drivers'),
        fetch('http://localhost:3005/trips')
      ]);
      
      setUsers(await usersRes.json());
      setDrivers(await driversRes.json());
      setTrips(await tripsRes.json());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🏢 Yarvan Admin Panel</h1>
      <p>Panel de administración y monitoreo</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h2>👥 Usuarios Totales: {users.length}</h2>
          <p>Gestión de pasajeros registrados</p>
        </div>
        
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h2>🚗 Conductores Totales: {drivers.length}</h2>
          <p>Online: {drivers.filter(d => d.status === 'online').length}</p>
        </div>
        
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h2>🚕 Viajes Totales: {trips.length}</h2>
          <p>Completados: {trips.filter(t => t.status === 'completed').length}</p>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>🔗 Apps del Ecosistema:</h3>
        <ul>
          <li><a href="http://localhost:3011" target="_blank">📱 Passenger App</a></li>
          <li><a href="http://localhost:3012" target="_blank">🚗 Driver App</a></li>
        </ul>
      </div>
    </div>
  );
}