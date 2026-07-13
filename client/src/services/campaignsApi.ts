import type { Campaign, CampaignStatus, CampaignSummary, CreateCampaignInput, PaymentStatus, UpdateCampaignInput } from '../types/campaign';
import { handleResponse } from './httpClient';

const BASE_URL = '/api/campaigns';

export async function listCampaigns(): Promise<Campaign[]> {
  const res = await fetch(BASE_URL);
  return handleResponse<Campaign[]>(res);
}

export async function getSummary(): Promise<CampaignSummary> {
  const res = await fetch(`${BASE_URL}/summary`);
  return handleResponse<CampaignSummary>(res);
}

export async function getCampaign(id: string): Promise<Campaign> {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse<Campaign>(res);
}

export async function createCampaign(input: CreateCampaignInput): Promise<Campaign> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Campaign>(res);
}

export async function updateCampaign(id: string, input: UpdateCampaignInput): Promise<Campaign> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Campaign>(res);
}

export async function updateCampaignStatus(id: string, campaign_status: CampaignStatus): Promise<Campaign> {
  const res = await fetch(`${BASE_URL}/${id}/campaign-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaign_status }),
  });
  return handleResponse<Campaign>(res);
}

export async function updatePaymentStatus(id: string, payment_status: PaymentStatus): Promise<Campaign> {
  const res = await fetch(`${BASE_URL}/${id}/payment-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status }),
  });
  return handleResponse<Campaign>(res);
}

export async function deleteCampaign(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  return handleResponse<void>(res);
}
