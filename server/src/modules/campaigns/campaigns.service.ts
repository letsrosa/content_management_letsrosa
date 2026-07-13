import { randomUUID } from 'node:crypto';
import { ZodError, type ZodSchema } from 'zod';
import { NotFoundError, ValidationError } from '../../shared/errors.js';
import * as campaignsRepository from './campaigns.repository.js';
import {
  createCampaignSchema,
  updateCampaignSchema,
  updateCampaignStatusSchema,
  updatePaymentStatusSchema,
  type CreateCampaignInput,
  type UpdateCampaignInput,
} from './campaigns.schema.js';
import type {
  Campaign,
  CampaignFilters,
  CampaignSummary,
  CampaignWithOverdue,
} from './campaigns.types.js';

const ACTIVE_STATUSES = ['negotiating', 'confirmed', 'in_progress'];

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

function now(): string {
  return new Date().toISOString();
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function calculateIsOverdue(campaign: Campaign): boolean {
  return (
    campaign.payment_status === 'pending' &&
    campaign.payment_due_date !== null &&
    campaign.payment_due_date < today()
  );
}

function withOverdue(campaign: Campaign): CampaignWithOverdue {
  return { ...campaign, isOverdue: calculateIsOverdue(campaign) };
}

export function listCampaigns(filters: CampaignFilters): CampaignWithOverdue[] {
  return campaignsRepository.findAll(filters).map(withOverdue);
}

export function getCampaign(id: string): CampaignWithOverdue {
  const campaign = campaignsRepository.findById(id);
  if (!campaign) {
    throw new NotFoundError('Campanha não encontrada');
  }
  return withOverdue(campaign);
}

export function createCampaign(input: CreateCampaignInput): CampaignWithOverdue {
  const data = parseOrThrow(createCampaignSchema, input);
  const timestamp = now();

  const campaign: Campaign = {
    id: randomUUID(),
    brand: data.brand,
    campaign_name: data.campaign_name ?? null,
    format: data.format,
    value: data.value,
    campaign_status: data.campaign_status ?? 'negotiating',
    payment_status: data.payment_status ?? 'pending',
    campaign_date: data.campaign_date ?? null,
    payment_due_date: data.payment_due_date ?? null,
    notes: data.notes ?? null,
    created_at: timestamp,
    updated_at: timestamp,
  };

  campaignsRepository.insert(campaign);
  return withOverdue(campaign);
}

export function updateCampaign(id: string, input: UpdateCampaignInput): CampaignWithOverdue {
  const existing = getCampaign(id);
  const data = parseOrThrow(updateCampaignSchema, input);

  const updated: Campaign = {
    ...existing,
    brand: data.brand ?? existing.brand,
    campaign_name: data.campaign_name ?? existing.campaign_name,
    format: data.format ?? existing.format,
    value: data.value ?? existing.value,
    campaign_status: data.campaign_status ?? existing.campaign_status,
    payment_status: data.payment_status ?? existing.payment_status,
    campaign_date: data.campaign_date ?? existing.campaign_date,
    payment_due_date: data.payment_due_date ?? existing.payment_due_date,
    notes: data.notes ?? existing.notes,
    updated_at: now(),
  };

  campaignsRepository.update(id, updated);
  return withOverdue(updated);
}

export function changeCampaignStatus(id: string, input: unknown): CampaignWithOverdue {
  const { campaign_status } = parseOrThrow(updateCampaignStatusSchema, input);
  const existing = getCampaign(id);

  const updatedAt = now();
  campaignsRepository.updateCampaignStatus(id, campaign_status, updatedAt);
  return withOverdue({ ...existing, campaign_status, updated_at: updatedAt });
}

export function changePaymentStatus(id: string, input: unknown): CampaignWithOverdue {
  const { payment_status } = parseOrThrow(updatePaymentStatusSchema, input);
  const existing = getCampaign(id);

  const updatedAt = now();
  campaignsRepository.updatePaymentStatus(id, payment_status, updatedAt);
  return withOverdue({ ...existing, payment_status, updated_at: updatedAt });
}

export function deleteCampaign(id: string): void {
  getCampaign(id);
  campaignsRepository.remove(id);
}

export function getSummary(): CampaignSummary {
  const rows = campaignsRepository.findAllForSummary();

  return rows.reduce<CampaignSummary>(
    (summary, row) => ({
      total: summary.total + 1,
      active: summary.active + (ACTIVE_STATUSES.includes(row.campaign_status) ? 1 : 0),
      totalValue: summary.totalValue + row.value,
      confirmedValue: summary.confirmedValue + (row.campaign_status === 'confirmed' ? row.value : 0),
      paidValue: summary.paidValue + (row.payment_status === 'paid' ? row.value : 0),
    }),
    { total: 0, active: 0, totalValue: 0, confirmedValue: 0, paidValue: 0 },
  );
}
