import express from 'express';
import {
  registerGet,
  registerPatch,
  registerPost,
} from '../shared-kernel/infrastructure/controllers/models/HttpHandler';
import AuthenticatedMiddleware from '../shared-kernel/infrastructure/middlewares/AuthenticationMiddleware';
import GetPropertyRequestsByAdIdController from '../property-management/queries/infrastructure/controllers/GetPropertyRequestsByAdIdController';
import RoleAuthorizationMiddleware from '../shared-kernel/infrastructure/middlewares/RoleAuthorizationMiddleware';
import GetStatsController from '../property-management/queries/infrastructure/controllers/GetStatsController';
import GetPropertyRequestsFilteredController from '../property-management/queries/infrastructure/controllers/GetPropertyRequestsFilteredController';
import CreatePropertyRequestController from '../property-management/commands/infrastructure/controllers/CreatePropertyRequestController';
import UpdatePropertyRequestController from '../property-management/commands/infrastructure/controllers/UpdatePropertyRequestController';

const router = express.Router();

registerGet(
  '/ads/:adId',
  GetPropertyRequestsByAdIdController,
  router,
  AuthenticatedMiddleware,
  RoleAuthorizationMiddleware(['AGENT']),
);
registerGet('/stats', GetStatsController, router, AuthenticatedMiddleware, RoleAuthorizationMiddleware([]));
registerGet('/', GetPropertyRequestsFilteredController, router, AuthenticatedMiddleware);
registerPost(
  '/',
  CreatePropertyRequestController,
  router,
  AuthenticatedMiddleware,
  RoleAuthorizationMiddleware(['CLIENT']),
);
registerPatch(
  '/:id',
  UpdatePropertyRequestController,
  router,
  AuthenticatedMiddleware,
  RoleAuthorizationMiddleware(['CLIENT']),
);

export = router;
