import { z } from 'zod';

export const campaignFormatSchema = z.enum(['reels', 'stories', 'post', 'combo']);
export const campaignStatusSchema = z.enum([
  'negotiating',
  'confirmed',
  'in_progress',
  'completed',
]);
export const paymentStatusSchema = z.enum(['pending', 'paid']);

export const createCampaignSchema = z.object({
  brand: z.string().min(1).max(140),
  campaign_name: z.string().optional(),
  format: campaignFormatSchema,
  value: z.number().min(0),
  campaign_status: campaignStatusSchema.optional(),
  payment_status: paymentStatusSchema.optional(),
  campaign_date: z.string().optional(),
  payment_due_date: z.string().optional(),
  notes: z.string().optional(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export const updateCampaignStatusSchema = z.object({
  campaign_status: campaignStatusSchema,
});

export const updatePaymentStatusSchema = z.object({
  payment_status: paymentStatusSchema,
});

export const listCampaignFiltersSchema = z.object({
  campaign_status: campaignStatusSchema.optional(),
  payment_status: paymentStatusSchema.optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type UpdateCampaignStatusInput = z.infer<typeof updateCampaignStatusSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
export type ListCampaignFiltersInput = z.infer<typeof listCampaignFiltersSchema>;
