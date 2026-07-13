import { Router } from 'express';
import * as campaignsController from './campaigns.controller.js';

export const campaignsRouter = Router();

campaignsRouter.get('/', campaignsController.list);
campaignsRouter.get('/summary', campaignsController.summary);
campaignsRouter.get('/:id', campaignsController.getById);
campaignsRouter.post('/', campaignsController.create);
campaignsRouter.put('/:id', campaignsController.update);
campaignsRouter.patch('/:id/campaign-status', campaignsController.updateCampaignStatus);
campaignsRouter.patch('/:id/payment-status', campaignsController.updatePaymentStatus);
campaignsRouter.delete('/:id', campaignsController.remove);
