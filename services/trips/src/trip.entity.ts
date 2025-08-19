import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TripStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  passengerId: number;

  @Column({ nullable: true })
  driverId: number;

  @Column('decimal', { precision: 10, scale: 8 })
  originLat: number;

  @Column('decimal', { precision: 11, scale: 8 })
  originLng: number;

  @Column()
  originAddress: string;

  @Column('decimal', { precision: 10, scale: 8 })
  destinationLat: number;

  @Column('decimal', { precision: 11, scale: 8 })
  destinationLng: number;

  @Column()
  destinationAddress: string;

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.PENDING })
  status: TripStatus;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  fare: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  distance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}