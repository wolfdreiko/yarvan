import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('vehicle_compliance')
export class VehicleCompliance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleId: number;

  @Column()
  licensePlate: string;

  @Column({ type: 'date', nullable: true })
  matriculaExpiryDate: Date;

  @Column({ type: 'date', nullable: true })
  revisionExpiryDate: Date;

  @Column({ type: 'date', nullable: true })
  soatExpiryDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}