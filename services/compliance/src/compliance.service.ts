import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';
import { VehicleCompliance } from './compliance.entity';
import { CreateComplianceDto, UpdateComplianceDto } from './compliance.dto';

@Injectable()
export class ComplianceService {
  constructor(
    @InjectRepository(VehicleCompliance) 
    private complianceRepository: Repository<VehicleCompliance>
  ) {}

  create(dto: CreateComplianceDto) {
    const compliance = this.complianceRepository.create(dto);
    return this.complianceRepository.save(compliance);
  }

  async findByVehicle(vehicleId: number) {
    const compliance = await this.complianceRepository.findOne({ where: { vehicleId } });
    if (!compliance) throw new NotFoundException('Compliance record not found');
    return compliance;
  }

  async findByPlate(licensePlate: string) {
    const compliance = await this.complianceRepository.findOne({ where: { licensePlate } });
    if (!compliance) throw new NotFoundException('Compliance record not found');
    return compliance;
  }

  async update(id: number, dto: UpdateComplianceDto) {
    const compliance = await this.complianceRepository.findOne({ where: { id } });
    if (!compliance) throw new NotFoundException('Compliance record not found');
    
    await this.complianceRepository.update(id, dto);
    return this.complianceRepository.findOne({ where: { id } });
  }

  async checkPlateCompliance(licensePlate: string) {
    try {
      const compliance = await this.findByPlate(licensePlate);
      const today = new Date();
      
      const status = {
        licensePlate,
        matricula: this.getDocumentStatus(compliance.matriculaExpiryDate, today),
        revision: this.getDocumentStatus(compliance.revisionExpiryDate, today),
        soat: this.getDocumentStatus(compliance.soatExpiryDate, today),
        overallStatus: 'compliant'
      };

      // Determine overall status
      if (status.matricula.status === 'expired' || 
          status.revision.status === 'expired' || 
          status.soat.status === 'expired') {
        status.overallStatus = 'non-compliant';
      } else if (status.matricula.status === 'expiring' || 
                 status.revision.status === 'expiring' || 
                 status.soat.status === 'expiring') {
        status.overallStatus = 'warning';
      }

      return status;
    } catch {
      return this.calculateComplianceDates(licensePlate);
    }
  }

  calculateComplianceDates(licensePlate: string) {
    const lastDigit = parseInt(licensePlate.slice(-1));
    const currentYear = new Date().getFullYear();
    
    // Matricula month based on last digit
    const matriculaMonths = {
      0: 10, 1: 11, 2: 12, 3: 1, 4: 2, 
      5: 3, 6: 4, 7: 5, 8: 6, 9: 7
    };

    const matriculaMonth = matriculaMonths[lastDigit];
    const matriculaYear = matriculaMonth <= 2 ? currentYear + 1 : currentYear;
    
    // Revision is typically 1 year after matricula
    const revisionDate = new Date(matriculaYear, matriculaMonth - 1, 15);
    revisionDate.setFullYear(revisionDate.getFullYear() + 1);

    return {
      licensePlate,
      lastDigit,
      calculatedDates: {
        matricula: {
          month: matriculaMonth,
          year: matriculaYear,
          date: new Date(matriculaYear, matriculaMonth - 1, 15)
        },
        revision: {
          date: revisionDate
        }
      },
      recommendations: {
        matricula: `Matrícula vence en ${this.getMonthName(matriculaMonth)} ${matriculaYear}`,
        revision: `Revisión técnica vence en ${this.getMonthName(revisionDate.getMonth() + 1)} ${revisionDate.getFullYear()}`
      }
    };
  }

  async getUpcomingReminders(daysAhead: number = 30) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    const upcomingMatricula = await this.complianceRepository.find({
      where: {
        matriculaExpiryDate: Between(today, futureDate),
        isActive: true
      }
    });

    const upcomingRevision = await this.complianceRepository.find({
      where: {
        revisionExpiryDate: Between(today, futureDate),
        isActive: true
      }
    });

    const upcomingSoat = await this.complianceRepository.find({
      where: {
        soatExpiryDate: Between(today, futureDate),
        isActive: true
      }
    });

    return {
      daysAhead,
      reminders: {
        matricula: upcomingMatricula.map(c => ({
          vehicleId: c.vehicleId,
          licensePlate: c.licensePlate,
          expiryDate: c.matriculaExpiryDate,
          daysUntilExpiry: this.calculateDaysUntil(c.matriculaExpiryDate)
        })),
        revision: upcomingRevision.map(c => ({
          vehicleId: c.vehicleId,
          licensePlate: c.licensePlate,
          expiryDate: c.revisionExpiryDate,
          daysUntilExpiry: this.calculateDaysUntil(c.revisionExpiryDate)
        })),
        soat: upcomingSoat.map(c => ({
          vehicleId: c.vehicleId,
          licensePlate: c.licensePlate,
          expiryDate: c.soatExpiryDate,
          daysUntilExpiry: this.calculateDaysUntil(c.soatExpiryDate)
        }))
      }
    };
  }

  async getExpiredDocuments() {
    const today = new Date();

    const expired = await this.complianceRepository.find({
      where: [
        { matriculaExpiryDate: LessThan(today), isActive: true },
        { revisionExpiryDate: LessThan(today), isActive: true },
        { soatExpiryDate: LessThan(today), isActive: true }
      ]
    });

    return expired.map(c => ({
      vehicleId: c.vehicleId,
      licensePlate: c.licensePlate,
      expiredDocuments: {
        matricula: c.matriculaExpiryDate && c.matriculaExpiryDate < today,
        revision: c.revisionExpiryDate && c.revisionExpiryDate < today,
        soat: c.soatExpiryDate && c.soatExpiryDate < today
      }
    }));
  }

  private getDocumentStatus(expiryDate: Date, today: Date) {
    if (!expiryDate) return { status: 'unknown', daysUntilExpiry: null };
    
    const daysUntil = this.calculateDaysUntil(expiryDate);
    
    if (daysUntil < 0) return { status: 'expired', daysUntilExpiry: daysUntil };
    if (daysUntil <= 30) return { status: 'expiring', daysUntilExpiry: daysUntil };
    return { status: 'valid', daysUntilExpiry: daysUntil };
  }

  private calculateDaysUntil(date: Date): number {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getMonthName(month: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1];
  }
}