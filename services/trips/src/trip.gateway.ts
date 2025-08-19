import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Trip } from './trip.entity';

@WebSocketGateway({ cors: true })
export class TripGateway {
  @WebSocketServer()
  server: Server;

  emitTripCreated(trip: Trip) {
    this.server.emit('trip:created', trip);
  }

  emitTripUpdated(trip: Trip) {
    this.server.emit('trip:updated', trip);
    this.server.to(`trip:${trip.id}`).emit('trip:status', trip);
  }

  emitLocationUpdate(tripId: number, location: { lat: number; lng: number }) {
    this.server.to(`trip:${tripId}`).emit('location:update', location);
  }
}