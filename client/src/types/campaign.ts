export type CampaignFormat = 'reels' | 'stories' | 'post' | 'combo';
export type CampaignStatus = 'negotiating' | 'confirmed' | 'in_progress' | 'completed';
export type PaymentStatus = 'pending' | 'paid';

export interface Campaign {
  id: string;
  brand: string;
  campaign_name: string | null;
  format: CampaignFormat;
  value: number;
  campaign_status: CampaignStatus;
  payment_status: PaymentStatus;
  campaign_date: string | null;
  payment_due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  isOverdue: boolean;
}

export interface CampaignSummary {
  total: number;
  active: number;
  totalValue: number;
  confirmedValue: number;
  paidValue: number;
}

export interface CreateCampaignInput {
  brand: string;
  campaign_name?: string;
  format: CampaignFormat;
  value: number;
  campaign_status?: CampaignStatus;
  payment_status?: PaymentStatus;
  campaign_date?: string;
  payment_due_date?: string;
  notes?: string;
}

export type UpdateCampaignInput = Partial<CreateCampaignInput>;
