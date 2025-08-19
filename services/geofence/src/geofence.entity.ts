import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum GeofenceType {
  PICO_PLACA = 'pico_placa',
  HIGH_DEMAND = 'high_demand',
  RESTRICTED = 'restricted'
}

@Entity('geofences')
export class Geofence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: GeofenceType })
  type: GeofenceType;

  @Column('json')
  polygon: { lat: number; lng: number }[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  restrictions: string; // JSON string with time restrictions, plate digits, etc.

  @CreateDateColumn()
  createdAt: Date;
}