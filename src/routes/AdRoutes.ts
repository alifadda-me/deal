import express from 'express';
import { registerGet, registerPost } from '../shared-kernel/infrastructure/controllers/models/HttpHandler';
import AuthenticatedMiddleware from '../shared-kernel/infrastructure/middlewares/AuthenticationMiddleware';
import GetAdsFilteredController from '../property-management/queries/infrastructure/controllers/GetAdsFilteredController';
import RoleAuthorizationMiddleware from '../shared-kernel/infrastructure/middlewares/RoleAuthorizationMiddleware';
import CreateAdController from '../property-management/commands/infrastructure/controllers/CreateAdController';

const router = express.Router();

registerPost('/', CreateAdController, router, AuthenticatedMiddleware, RoleAuthorizationMiddleware(['AGENT']));
registerGet('/', GetAdsFilteredController, router, AuthenticatedMiddleware);

export = router;
