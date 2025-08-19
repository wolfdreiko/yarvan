import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Vehicle } from './vehicle.entity';

export enum DriverStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
  BUSY = 'busy'
}

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  licenseNumber: string;

  @Column({ type: 'enum', enum: DriverStatus, default: DriverStatus.OFFLINE })
  status: DriverStatus;

  @Column({ nullable: true })
  currentLat: number;

  @Column({ nullable: true })
  currentLng: number;

  @OneToMany(() => Vehicle, vehicle => vehicle.driver)
  vehicles: Vehicle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}