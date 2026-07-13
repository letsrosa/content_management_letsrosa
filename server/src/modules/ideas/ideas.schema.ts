import { z } from 'zod';

export const pillarSchema = z.enum(['tech', 'life', 'both']);
export const formatSchema = z.enum(['reels', 'carrossel', 'stories', 'post', 'live']);
export const statusSchema = z.enum(['idea', 'script', 'production', 'published']);

export const createIdeaSchema = z.object({
  title: z.string().min(1).max(140),
  pillar: pillarSchema,
  format: formatSchema,
  status: statusSchema.optional(),
  scheduled_date: z.string().optional(),
  notes: z.string().optional(),
});

export const updateIdeaSchema = createIdeaSchema.partial();

export const updateStatusSchema = z.object({
  status: statusSchema,
});

export const listFiltersSchema = z.object({
  pillar: pillarSchema.optional(),
  status: statusSchema.optional(),
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type ListFiltersInput = z.infer<typeof listFiltersSchema>;
