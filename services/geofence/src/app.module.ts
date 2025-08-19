import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { GeofenceController } from './geofence.controller';
import { GeofenceService } from './geofence.service';
import { Geofence } from './geofence.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'yarvan',
      password: process.env.DB_PASS || 'yarvan123',
      database: process.env.DB_NAME || 'yarvan_geofence',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Geofence]),
  ],
  controllers: [HealthController, GeofenceController],
  providers: [GeofenceService],
})
export class AppModule {}