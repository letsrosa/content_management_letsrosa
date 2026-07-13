import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/client.js';
import { runMigrations } from '../../db/migrate.js';
import * as campaignsService from './campaigns.service.js';

beforeAll(() => {
  runMigrations();
});

beforeEach(() => {
  db.exec('DELETE FROM campaigns');
});

function createSampleCampaign(overrides: Partial<Parameters<typeof campaignsService.createCampaign>[0]> = {}) {
  return campaignsService.createCampaign({
    brand: 'Glow Beauty',
    format: 'reels',
    value: 400,
    ...overrides,
  });
}

describe('createCampaign', () => {
  it('cria campanha com status padrão "negotiating" e pagamento "pending"', () => {
    const campaign = createSampleCampaign();
    expect(campaign.campaign_status).toBe('negotiating');
    expect(campaign.payment_status).toBe('pending');
    expect(campaign.id).toBeTruthy();
  });
});

describe('getSummary', () => {
  it('retorna zerado quando não há campanhas', () => {
    expect(campaignsService.getSummary()).toEqual({
      total: 0,
      active: 0,
      totalValue: 0,
      confirmedValue: 0,
      paidValue: 0,
    });
  });

  it('soma total, ativas, valor total, valor confirmado e valor recebido corretamente', () => {
    createSampleCampaign({ value: 400, campaign_status: 'negotiating', payment_status: 'pending' });
    createSampleCampaign({ value: 600, campaign_status: 'confirmed', payment_status: 'pending' });
    createSampleCampaign({ value: 1000, campaign_status: 'in_progress', payment_status: 'paid' });
    createSampleCampaign({ value: 2000, campaign_status: 'completed', payment_status: 'paid' });

    expect(campaignsService.getSummary()).toEqual({
      total: 4,
      active: 3,
      totalValue: 4000,
      confirmedValue: 600,
      paidValue: 3000,
    });
  });

  it('confirmedValue soma apenas campanhas com campaign_status "confirmed", mesmo já pagas', () => {
    createSampleCampaign({ value: 500, campaign_status: 'confirmed', payment_status: 'paid' });
    createSampleCampaign({ value: 300, campaign_status: 'negotiating', payment_status: 'pending' });

    expect(campaignsService.getSummary().confirmedValue).toBe(500);
  });
});

describe('regra de isOverdue', () => {
  it('é atrasada quando pagamento está pendente e a data de vencimento já passou', () => {
    const campaign = createSampleCampaign({ payment_status: 'pending', payment_due_date: '2020-01-01' });
    expect(campaign.isOverdue).toBe(true);
  });

  it('não é atrasada quando pagamento está pendente mas a data de vencimento é futura', () => {
    const campaign = createSampleCampaign({ payment_status: 'pending', payment_due_date: '2999-01-01' });
    expect(campaign.isOverdue).toBe(false);
  });

  it('nunca é atrasada quando o pagamento já foi feito, mesmo com data vencida', () => {
    const campaign = createSampleCampaign({ payment_status: 'paid', payment_due_date: '2020-01-01' });
    expect(campaign.isOverdue).toBe(false);
  });

  it('não é atrasada quando não há data de vencimento definida', () => {
    const campaign = createSampleCampaign({ payment_status: 'pending' });
    expect(campaign.isOverdue).toBe(false);
  });
});
