import type { CreateIdeaInput, Idea, IdeaFilters, IdeaStatus, UpdateIdeaInput } from '../types/idea';
import { buildQuery, handleResponse } from './httpClient';

const BASE_URL = '/api/ideas';

export async function listIdeas(filters: IdeaFilters = {}): Promise<Idea[]> {
  const res = await fetch(`${BASE_URL}${buildQuery({ pillar: filters.pillar, status: filters.status })}`);
  return handleResponse<Idea[]>(res);
}

export async function getIdea(id: string): Promise<Idea> {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse<Idea>(res);
}

export async function createIdea(input: CreateIdeaInput): Promise<Idea> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Idea>(res);
}

export async function updateIdea(id: string, input: UpdateIdeaInput): Promise<Idea> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Idea>(res);
}

export async function updateIdeaStatus(id: string, status: IdeaStatus): Promise<Idea> {
  const res = await fetch(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Idea>(res);
}

export async function deleteIdea(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  return handleResponse<void>(res);
}
