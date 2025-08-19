import { Injectable, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class GatewayService {
  private readonly serviceUrls = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    users: process.env.USERS_SERVICE_URL || 'http://localhost:3002',
    drivers: process.env.DRIVERS_SERVICE_URL || 'http://localhost:3003',
    trips: process.env.TRIPS_SERVICE_URL || 'http://localhost:3004',
    dispatch: process.env.DISPATCH_SERVICE_URL || 'http://localhost:3005',
    geofence: process.env.GEOFENCE_SERVICE_URL || 'http://localhost:3006',
    wallet: process.env.WALLET_SERVICE_URL || 'http://localhost:3007',
    compliance: process.env.COMPLIANCE_SERVICE_URL || 'http://localhost:3008',
    'demand-engine': process.env.DEMAND_SERVICE_URL || 'http://localhost:3009',
    notifications: process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3010'
  };

  async proxyRequest(req: Request, res: Response, service: string) {
    try {
      const serviceUrl = this.serviceUrls[service];
      if (!serviceUrl) throw new HttpException('Service not found', 404);

      const targetUrl = `${serviceUrl}${req.url}`;
      
      const response = await axios({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        headers: {
          ...req.headers,
          host: undefined,
          'content-length': undefined
        },
        params: req.query
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      const status = error.response?.status || 500;
      const message = error.response?.data || error.message;
      res.status(status).json({ error: message });
    }
  }
}