import { Router } from 'express';
import * as ideasController from './ideas.controller.js';

export const ideasRouter = Router();

ideasRouter.get('/', ideasController.list);
ideasRouter.get('/:id', ideasController.getById);
ideasRouter.post('/', ideasController.create);
ideasRouter.put('/:id', ideasController.update);
ideasRouter.patch('/:id/status', ideasController.updateStatus);
ideasRouter.delete('/:id', ideasController.remove);
