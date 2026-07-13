import { randomUUID } from 'node:crypto';
import { ZodError, type ZodSchema } from 'zod';
import { NotFoundError, ValidationError } from '../../shared/errors.js';
import * as ideasRepository from './ideas.repository.js';
import {
  createIdeaSchema,
  updateIdeaSchema,
  updateStatusSchema,
  type CreateIdeaInput,
  type UpdateIdeaInput,
} from './ideas.schema.js';
import type { Idea, IdeaFilters, IdeaStatus } from './ideas.types.js';

const STATUS_ORDER: IdeaStatus[] = ['idea', 'script', 'production', 'published'];

function parseOrThrow<T>(schema: ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(err.issues.map((issue) => issue.message).join('; '));
    }
    throw err;
  }
}

function assertValidStatusTransition(current: IdeaStatus, next: IdeaStatus): void {
  const currentIndex = STATUS_ORDER.indexOf(current);
  const nextIndex = STATUS_ORDER.indexOf(next);

  if (nextIndex > currentIndex + 1) {
    throw new ValidationError(
      `Não é possível pular etapas: de "${current}" só é possível avançar para "${STATUS_ORDER[currentIndex + 1]}"`,
    );
  }
}

function now(): string {
  return new Date().toISOString();
}

export function listIdeas(filters: IdeaFilters): Idea[] {
  return ideasRepository.findAll(filters);
}

export function getIdea(id: string): Idea {
  const idea = ideasRepository.findById(id);
  if (!idea) {
    throw new NotFoundError('Ideia não encontrada');
  }
  return idea;
}

export function createIdea(input: CreateIdeaInput): Idea {
  const data = parseOrThrow(createIdeaSchema, input);
  const timestamp = now();

  const idea: Idea = {
    id: randomUUID(),
    title: data.title,
    pillar: data.pillar,
    format: data.format,
    status: data.status ?? 'idea',
    scheduled_date: data.scheduled_date ?? null,
    notes: data.notes ?? null,
    created_at: timestamp,
    updated_at: timestamp,
  };

  ideasRepository.insert(idea);
  return idea;
}

export function updateIdea(id: string, input: UpdateIdeaInput): Idea {
  const existing = getIdea(id);
  const data = parseOrThrow(updateIdeaSchema, input);

  if (data.status && data.status !== existing.status) {
    assertValidStatusTransition(existing.status, data.status);
  }

  const updated: Idea = {
    ...existing,
    title: data.title ?? existing.title,
    pillar: data.pillar ?? existing.pillar,
    format: data.format ?? existing.format,
    status: data.status ?? existing.status,
    scheduled_date: data.scheduled_date ?? existing.scheduled_date,
    notes: data.notes ?? existing.notes,
    updated_at: now(),
  };

  ideasRepository.update(id, updated);
  return updated;
}

export function changeIdeaStatus(id: string, input: unknown): Idea {
  const { status } = parseOrThrow(updateStatusSchema, input);
  const existing = getIdea(id);

  assertValidStatusTransition(existing.status, status);

  const updatedAt = now();
  ideasRepository.updateStatus(id, status, updatedAt);
  return { ...existing, status, updated_at: updatedAt };
}

export function deleteIdea(id: string): void {
  getIdea(id);
  ideasRepository.remove(id);
}
