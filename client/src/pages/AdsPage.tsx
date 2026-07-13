import { useState } from 'react';
import styles from '../App.module.css';
import { CampaignForm } from '../components/campaign-form/CampaignForm';
import { SummaryCards } from '../components/campaign-summary/SummaryCards';
import { CampaignDetailModal } from '../components/campaign-table/CampaignDetailModal';
import { CampaignTable } from '../components/campaign-table/CampaignTable';
import { Button } from '../components/ui/Button';
import { useCampaigns } from '../hooks/useCampaigns';
import type { Campaign, CreateCampaignInput } from '../types/campaign';

export function AdsPage() {
  const {
    campaigns,
    summary,
    loading,
    error,
    createCampaign,
    updateCampaign,
    changeCampaignStatus,
    changePaymentStatus,
    deleteCampaign,
  } = useCampaigns();

  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? null;

  function openCreateForm() {
    setEditingCampaign(null);
    setFormError(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(campaign: Campaign) {
    setSelectedCampaignId(null);
    setEditingCampaign(campaign);
    setFormError(undefined);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingCampaign(null);
    setFormError(undefined);
  }

  async function handleSubmit(input: CreateCampaignInput) {
    try {
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, input);
      } else {
        await createCampaign(input);
      }
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar publi');
    }
  }

  async function handleDelete(id: string) {
    setSelectedCampaignId(null);
    await deleteCampaign(id);
  }

  return (
    <>
      <div className={styles.mainWide}>
        <div className={styles.pageToolbar}>
          <h2 className={styles.pageTitle}>Publicidade</h2>
          <Button variant="primary" onClick={openCreateForm}>
            + Nova Publi
          </Button>
        </div>

        <SummaryCards summary={summary} />

        <main>
          {loading && <p className={styles.statusMessage}>Carregando campanhas...</p>}
          {error && <p className={styles.statusMessage}>{error}</p>}

          {!loading && !error && (
            <CampaignTable
              campaigns={campaigns}
              onRowClick={setSelectedCampaignId}
              onCampaignStatusChange={changeCampaignStatus}
              onPaymentStatusChange={changePaymentStatus}
              onCreateFirstCampaign={openCreateForm}
            />
          )}
        </main>
      </div>

      {isFormOpen && (
        <CampaignForm
          initialCampaign={editingCampaign ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          errorMessage={formError}
        />
      )}

      {selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaignId(null)}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
