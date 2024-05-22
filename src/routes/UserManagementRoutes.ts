import express from 'express';
import { registerPost } from '../shared-kernel/infrastructure/controllers/models/HttpHandler';
import LoginUserController from '../user-management/commands/infrastructure/controllers/LoginUserController';

const router = express.Router();

registerPost('/login', LoginUserController, router);

export = router;
