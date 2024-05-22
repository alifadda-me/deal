import 'reflect-metadata';
import express from 'express';
import status from 'http-status';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import Logger from '../../src/shared-kernel/infrastructure/logging/general.log';
import Env from '../../config/Env';
import userManagement from '../../src/routes/UserManagementRoutes';
import healthCheckRoute from '../../src/routes/HealthCheckRoutes';
import propertyRequestRoutes from '../../src/routes/PropertyRequestRoutes';
import adRoutes from '../../src/routes/AdRoutes';

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/healthcheck', healthCheckRoute);
  app.use('/api/users', userManagement);
  app.use('/api/property-requests', propertyRequestRoutes);
  app.use('/api/ads', adRoutes);

  app.use((err, _req, res, _next) => {
    Logger.error(`Error handler triggered: ${JSON.stringify(err)}`);
    res.status(err.statusCode || status.INTERNAL_SERVER_ERROR).json({
      msg: err.msg || status[status.INTERNAL_SERVER_ERROR],
    });
  });

  app.use((req, res) => {
    res.status(status.NOT_FOUND).json({
      msg: status[status.NOT_FOUND],
    });
  });

  return app.listen();
};

export function loginEndPoint(app, body = { phone: '1122334455', password: '123456789' }) {
  const requestBuilder = request(app).post('/api/users/login');
  return requestBuilder.send(body);
}

export const extractToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, Env.SECRET, (err, decodedToken) => {
      if (err) {
        return reject(err);
      }
      resolve(decodedToken);
    });
  });
