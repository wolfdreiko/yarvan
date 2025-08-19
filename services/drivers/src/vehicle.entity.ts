import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Driver } from './driver.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  licensePlate: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  color: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Driver, driver => driver.vehicles)
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @Column()
  driverId: number;
}