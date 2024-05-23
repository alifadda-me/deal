import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import status from 'http-status';
import http from 'http';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import Env from './config/Env';
import { connectDefaultConnectionToMongoDB, disconnectDefaultFromMongoDB } from './config/mongooseConfig';
import healthCheckRoute from './src/routes/HealthCheckRoutes';
import userManagement from './src/routes/UserManagementRoutes';
import propertyRequestRoutes from './src/routes/PropertyRequestRoutes';
import adRoutes from './src/routes/AdRoutes';
import HttpLogger from './src/shared-kernel/infrastructure/middlewares/HttpLogger';
import Logger from './src/shared-kernel/infrastructure/logging/general.log';
import { Container } from 'typedi';
import { CronJobService } from './config/CronJobService';

const app = express();
app.use(HttpLogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.load('./swagger/swagger.yaml')));
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  }),
);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.disable('etag');
app.use('/healthcheck', healthCheckRoute);
app.use('/api/users', userManagement);
app.use('/api/property-requests', propertyRequestRoutes);
app.use('/api/ads', adRoutes);
app.use((err, _req, res, _next) => {
  if (err.statusCode?.toString().startsWith('4')) {
    return res.status(err.statusCode).json({
      msg: err.msg || status[status.BAD_REQUEST],
    });
  }
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

process.on('warning', (warning) => {
  Logger.warn(`Generic warning: ${warning.stack}`);
});

const normalizePort = (val) => {
  const portNum = Number(val);
  if (Number.isNaN(portNum)) {
    return val;
  }
  if (portNum >= 0) {
    return portNum;
  }
  return false;
};

const port = normalizePort(Env.PORT || '8080');
app.set('port', port);

const server = http.createServer(app);

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      Logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  Logger.info(`Listening on ${bind}`);
};

export const bootstrapServer = async () => {
  try {
    await connectDefaultConnectionToMongoDB();

    const cronJobService = Container.get(CronJobService);
    await cronJobService.setupCronJob();
  } catch (err) {
    Logger.error(`Bootstrap server error: ${(err as Error).stack}`);
    throw err;
  }

  server.listen(port);
  server.keepAliveTimeout = 350 * 1000;
  server.headersTimeout = 400 * 1000;
  server.on('error', onError);
  server.on('listening', onListening);
};

export const closeServer = async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
  await disconnectDefaultFromMongoDB();
};

const gracefulShutdown = (signal) => async () => {
  if (signal === 'SIGUSR2') {
    process.kill(process.pid, signal);
  } else {
    try {
      await closeServer();
      process.exit(0);
    } catch (err) {
      Logger.error(err);
      process.exit(1);
    }
  }
};

const catchTermination = () => {
  process.on('SIGHUP', gracefulShutdown('SIGHUP'));
  process.on('SIGTERM', gracefulShutdown('SIGTERM'));
  process.on('SIGINT', gracefulShutdown('SIGINT'));
  process.once('SIGUSR2', gracefulShutdown('SIGUSR2'));
};

(async () => {
  try {
    await bootstrapServer();
    catchTermination();
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
})();
