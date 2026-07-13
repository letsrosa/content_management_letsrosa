import { db } from '../../db/client.js';
import type { Idea, IdeaFilters } from './ideas.types.js';

function nullify<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (result[key] === undefined) {
      (result as Record<string, unknown>)[key] = null;
    }
  }
  return result;
}

export function findAll(filters: IdeaFilters): Idea[] {
  const conditions: string[] = [];
  const params: Record<string, string> = {};

  if (filters.pillar) {
    conditions.push('pillar = @pillar');
    params.pillar = filters.pillar;
  }
  if (filters.status) {
    conditions.push('status = @status');
    params.status = filters.status;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = db
    .prepare(`SELECT * FROM ideas ${where} ORDER BY created_at DESC`)
    .all(params);
  return rows as unknown as Idea[];
}

export function findById(id: string): Idea | undefined {
  const row = db.prepare('SELECT * FROM ideas WHERE id = ?').get(id);
  return row as Idea | undefined;
}

export function insert(idea: Idea): void {
  db.prepare(
    `INSERT INTO ideas (id, title, pillar, format, status, scheduled_date, notes, created_at, updated_at)
     VALUES (@id, @title, @pillar, @format, @status, @scheduled_date, @notes, @created_at, @updated_at)`,
  ).run(nullify({ ...idea }));
}

export function update(id: string, idea: Idea): void {
  db.prepare(
    `UPDATE ideas
     SET title = @title, pillar = @pillar, format = @format, status = @status,
         scheduled_date = @scheduled_date, notes = @notes, updated_at = @updated_at
     WHERE id = @id`,
  ).run(
    nullify({
      id,
      title: idea.title,
      pillar: idea.pillar,
      format: idea.format,
      status: idea.status,
      scheduled_date: idea.scheduled_date,
      notes: idea.notes,
      updated_at: idea.updated_at,
    }),
  );
}

export function updateStatus(id: string, status: string, updatedAt: string): void {
  db.prepare('UPDATE ideas SET status = @status, updated_at = @updatedAt WHERE id = @id').run({
    id,
    status,
    updatedAt,
  });
}

export function remove(id: string): void {
  db.prepare('DELETE FROM ideas WHERE id = ?').run(id);
}
