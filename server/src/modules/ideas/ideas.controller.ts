import type { Request, Response } from 'express';
import * as ideasService from './ideas.service.js';
import { listFiltersSchema } from './ideas.schema.js';

export function list(req: Request, res: Response): void {
  const filters = listFiltersSchema.parse(req.query);
  const ideas = ideasService.listIdeas(filters);
  res.json(ideas);
}

export function getById(req: Request, res: Response): void {
  const idea = ideasService.getIdea(req.params.id);
  res.json(idea);
}

export function create(req: Request, res: Response): void {
  const idea = ideasService.createIdea(req.body);
  res.status(201).json(idea);
}

export function update(req: Request, res: Response): void {
  const idea = ideasService.updateIdea(req.params.id, req.body);
  res.json(idea);
}

export function updateStatus(req: Request, res: Response): void {
  const idea = ideasService.changeIdeaStatus(req.params.id, req.body);
  res.json(idea);
}

export function remove(req: Request, res: Response): void {
  ideasService.deleteIdea(req.params.id);
  res.status(204).send();
}
