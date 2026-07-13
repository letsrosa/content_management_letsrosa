import type { Request, Response } from 'express';
import * as campaignsService from './campaigns.service.js';
import { listCampaignFiltersSchema } from './campaigns.schema.js';

export function list(req: Request, res: Response): void {
  const filters = listCampaignFiltersSchema.parse(req.query);
  const campaigns = campaignsService.listCampaigns(filters);
  res.json(campaigns);
}

export function summary(_req: Request, res: Response): void {
  res.json(campaignsService.getSummary());
}

export function getById(req: Request, res: Response): void {
  const campaign = campaignsService.getCampaign(req.params.id);
  res.json(campaign);
}

export function create(req: Request, res: Response): void {
  const campaign = campaignsService.createCampaign(req.body);
  res.status(201).json(campaign);
}

export function update(req: Request, res: Response): void {
  const campaign = campaignsService.updateCampaign(req.params.id, req.body);
  res.json(campaign);
}

export function updateCampaignStatus(req: Request, res: Response): void {
  const campaign = campaignsService.changeCampaignStatus(req.params.id, req.body);
  res.json(campaign);
}

export function updatePaymentStatus(req: Request, res: Response): void {
  const campaign = campaignsService.changePaymentStatus(req.params.id, req.body);
  res.json(campaign);
}

export function remove(req: Request, res: Response): void {
  campaignsService.deleteCampaign(req.params.id);
  res.status(204).send();
}
