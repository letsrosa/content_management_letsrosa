import { db } from '../../db/client.js';
import type { Campaign, CampaignFilters } from './campaigns.types.js';

function nullify<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (result[key] === undefined) {
      (result as Record<string, unknown>)[key] = null;
    }
  }
  return result;
}

export function findAll(filters: CampaignFilters): Campaign[] {
  const conditions: string[] = [];
  const params: Record<string, string> = {};

  if (filters.campaign_status) {
    conditions.push('campaign_status = @campaign_status');
    params.campaign_status = filters.campaign_status;
  }
  if (filters.payment_status) {
    conditions.push('payment_status = @payment_status');
    params.payment_status = filters.payment_status;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = db
    .prepare(`SELECT * FROM campaigns ${where} ORDER BY created_at DESC`)
    .all(params);
  return rows as unknown as Campaign[];
}

export function findById(id: string): Campaign | undefined {
  const row = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(id);
  return row as Campaign | undefined;
}

export function insert(campaign: Campaign): void {
  db.prepare(
    `INSERT INTO campaigns (
       id, brand, campaign_name, format, value, campaign_status, payment_status,
       campaign_date, payment_due_date, notes, created_at, updated_at
     )
     VALUES (
       @id, @brand, @campaign_name, @format, @value, @campaign_status, @payment_status,
       @campaign_date, @payment_due_date, @notes, @created_at, @updated_at
     )`,
  ).run(nullify({ ...campaign }));
}

export function update(id: string, campaign: Campaign): void {
  db.prepare(
    `UPDATE campaigns
     SET brand = @brand, campaign_name = @campaign_name, format = @format, value = @value,
         campaign_status = @campaign_status, payment_status = @payment_status,
         campaign_date = @campaign_date, payment_due_date = @payment_due_date,
         notes = @notes, updated_at = @updated_at
     WHERE id = @id`,
  ).run(
    nullify({
      id,
      brand: campaign.brand,
      campaign_name: campaign.campaign_name,
      format: campaign.format,
      value: campaign.value,
      campaign_status: campaign.campaign_status,
      payment_status: campaign.payment_status,
      campaign_date: campaign.campaign_date,
      payment_due_date: campaign.payment_due_date,
      notes: campaign.notes,
      updated_at: campaign.updated_at,
    }),
  );
}

export function updateCampaignStatus(id: string, campaignStatus: string, updatedAt: string): void {
  db.prepare(
    'UPDATE campaigns SET campaign_status = @campaignStatus, updated_at = @updatedAt WHERE id = @id',
  ).run({ id, campaignStatus, updatedAt });
}

export function updatePaymentStatus(id: string, paymentStatus: string, updatedAt: string): void {
  db.prepare(
    'UPDATE campaigns SET payment_status = @paymentStatus, updated_at = @updatedAt WHERE id = @id',
  ).run({ id, paymentStatus, updatedAt });
}

export function remove(id: string): void {
  db.prepare('DELETE FROM campaigns WHERE id = ?').run(id);
}

export function findAllForSummary(): Pick<Campaign, 'campaign_status' | 'payment_status' | 'value'>[] {
  const rows = db.prepare('SELECT campaign_status, payment_status, value FROM campaigns').all();
  return rows as Pick<Campaign, 'campaign_status' | 'payment_status' | 'value'>[];
}
