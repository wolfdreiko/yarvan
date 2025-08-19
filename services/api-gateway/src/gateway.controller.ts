import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GatewayService } from './gateway.service';
import { AuthGuard } from './auth.guard';

@Controller()
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  // Public routes
  @All('auth/*')
  authRoutes(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res, 'auth');
  }

  // Protected routes
  @UseGuards(AuthGuard)
  @All('users/*')
  userRoutes(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res, 'users');
  }

  @UseGuards(AuthGuard)
  @All('drivers/*')
  driverRoutes(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res, 'drivers');
  }

  @UseGuards(AuthGuard)
  @All('trips/*')
  tripRoutes(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res, 'trips');
  }

  @UseGuards(AuthGuard)
  @All('dispatch/*')
  dispatchRoutes(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res, 'dispatch');
  }

  @UseGuards(AuthGuard)
  @All('geofence/*')
  geofenceRoutes(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res, 'geofence');
  }

  @UseGuards(AuthGuard)
  @All('wallet/*')
  walletRoutes(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res, 'wallet');
  }

  @UseGuards(AuthGuard)
  @All('compliance/*')
  complianceRoutes(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res, 'compliance');
  }

  @UseGuards(AuthGuard)
  @All('demand/*')
  demandRoutes(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res, 'demand-engine');
  }

  @UseGuards(AuthGuard)
  @All('notifications/*')
  notificationRoutes(@Req() req: Request, @Res() res: Response) {
    return this.gatewayService.proxyRequest(req, res, 'notifications');
  }
}