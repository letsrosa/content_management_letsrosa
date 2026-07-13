import { useCallback, useEffect, useState } from 'react';
import * as campaignsApi from '../services/campaignsApi';
import type {
  Campaign,
  CampaignStatus,
  CampaignSummary,
  CreateCampaignInput,
  PaymentStatus,
  UpdateCampaignInput,
} from '../types/campaign';

const EMPTY_SUMMARY: CampaignSummary = { total: 0, active: 0, totalValue: 0, confirmedValue: 0, paidValue: 0 };

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [summary, setSummary] = useState<CampaignSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [campaignsData, summaryData] = await Promise.all([
        campaignsApi.listCampaigns(),
        campaignsApi.getSummary(),
      ]);
      setCampaigns(campaignsData);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar campanhas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const refreshSummary = useCallback(async () => {
    setSummary(await campaignsApi.getSummary());
  }, []);

  const createCampaign = useCallback(
    async (input: CreateCampaignInput) => {
      const campaign = await campaignsApi.createCampaign(input);
      setCampaigns((prev) => [campaign, ...prev]);
      await refreshSummary();
      return campaign;
    },
    [refreshSummary],
  );

  const updateCampaign = useCallback(
    async (id: string, input: UpdateCampaignInput) => {
      const campaign = await campaignsApi.updateCampaign(id, input);
      setCampaigns((prev) => prev.map((item) => (item.id === id ? campaign : item)));
      await refreshSummary();
      return campaign;
    },
    [refreshSummary],
  );

  const changeCampaignStatus = useCallback(
    async (id: string, campaign_status: CampaignStatus) => {
      const campaign = await campaignsApi.updateCampaignStatus(id, campaign_status);
      setCampaigns((prev) => prev.map((item) => (item.id === id ? campaign : item)));
      await refreshSummary();
      return campaign;
    },
    [refreshSummary],
  );

  const changePaymentStatus = useCallback(
    async (id: string, payment_status: PaymentStatus) => {
      const campaign = await campaignsApi.updatePaymentStatus(id, payment_status);
      setCampaigns((prev) => prev.map((item) => (item.id === id ? campaign : item)));
      await refreshSummary();
      return campaign;
    },
    [refreshSummary],
  );

  const deleteCampaign = useCallback(
    async (id: string) => {
      await campaignsApi.deleteCampaign(id);
      setCampaigns((prev) => prev.filter((item) => item.id !== id));
      await refreshSummary();
    },
    [refreshSummary],
  );

  return {
    campaigns,
    summary,
    loading,
    error,
    createCampaign,
    updateCampaign,
    changeCampaignStatus,
    changePaymentStatus,
    deleteCampaign,
  };
}
