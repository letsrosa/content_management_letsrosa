import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/client.js';
import { runMigrations } from '../../db/migrate.js';
import { ValidationError } from '../../shared/errors.js';
import * as ideasService from './ideas.service.js';

beforeAll(() => {
  runMigrations();
});

beforeEach(() => {
  db.exec('DELETE FROM ideas');
});

function createSampleIdea() {
  return ideasService.createIdea({
    title: 'Ideia de teste',
    pillar: 'tech',
    format: 'reels',
  });
}

describe('createIdea', () => {
  it('rejeita pilar inválido', () => {
    expect(() =>
      ideasService.createIdea({
        title: 'Ideia inválida',
        // @ts-expect-error testando valor fora do enum
        pillar: 'invalido',
        format: 'reels',
      }),
    ).toThrow(ValidationError);
  });

  it('rejeita formato inválido', () => {
    expect(() =>
      ideasService.createIdea({
        title: 'Ideia inválida',
        pillar: 'tech',
        // @ts-expect-error testando valor fora do enum
        format: 'tiktok',
      }),
    ).toThrow(ValidationError);
  });

  it('cria ideia com status padrão "idea"', () => {
    const idea = createSampleIdea();
    expect(idea.status).toBe('idea');
    expect(idea.id).toBeTruthy();
  });
});

describe('regra de transição de status', () => {
  it('permite avançar um estágio por vez (idea -> script)', () => {
    const idea = createSampleIdea();
    const updated = ideasService.changeIdeaStatus(idea.id, { status: 'script' });
    expect(updated.status).toBe('script');
  });

  it('bloqueia pular etapas (idea -> published direto)', () => {
    const idea = createSampleIdea();
    expect(() => ideasService.changeIdeaStatus(idea.id, { status: 'published' })).toThrow(
      ValidationError,
    );
  });

  it('bloqueia pular etapas (script -> published)', () => {
    const idea = createSampleIdea();
    ideasService.changeIdeaStatus(idea.id, { status: 'script' });
    expect(() => ideasService.changeIdeaStatus(idea.id, { status: 'published' })).toThrow(
      ValidationError,
    );
  });

  it('permite voltar etapas livremente (production -> idea)', () => {
    const idea = createSampleIdea();
    ideasService.changeIdeaStatus(idea.id, { status: 'script' });
    ideasService.changeIdeaStatus(idea.id, { status: 'production' });
    const reverted = ideasService.changeIdeaStatus(idea.id, { status: 'idea' });
    expect(reverted.status).toBe('idea');
  });

  it('rejeita status inexistente no enum', () => {
    const idea = createSampleIdea();
    expect(() =>
      ideasService.changeIdeaStatus(idea.id, { status: 'arquivado' }),
    ).toThrow(ValidationError);
  });
});
