import { useEffect } from 'react';
import type { Campaign } from '../../types/campaign';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatScheduledDate } from '../../utils/formatDate';
import { Button } from '../ui/Button';
import { StatusBadge } from './StatusBadge';
import styles from './campaign-table.module.css';

const FORMAT_LABEL: Record<Campaign['format'], string> = {
  reels: 'Reels',
  stories: 'Stories',
  post: 'Post',
  combo: 'Combo',
};

interface CampaignDetailModalProps {
  campaign: Campaign;
  onClose: () => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
}

export function CampaignDetailModal({ campaign, onClose, onEdit, onDelete }: CampaignDetailModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const campaignDate = formatScheduledDate(campaign.campaign_date);
  const paymentDueDate = formatScheduledDate(campaign.payment_due_date);
  const paymentTone = campaign.isOverdue ? 'overdue' : campaign.payment_status;

  return (
    <div className={styles.modalBackdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.modalPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 id="campaign-modal-title" className={styles.modalTitle}>
              {campaign.brand}
            </h2>
            {campaign.campaign_name && <p className={styles.campaignName}>{campaign.campaign_name}</p>}
          </div>
          <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className={styles.modalBadges}>
          <StatusBadge tone={campaign.campaign_status} />
          <StatusBadge tone={paymentTone} />
        </div>

        <dl className={styles.modalGrid}>
          <div>
            <dt>Formato</dt>
            <dd>{FORMAT_LABEL[campaign.format]}</dd>
          </div>
          <div>
            <dt>Valor</dt>
            <dd>{formatCurrency(campaign.value)}</dd>
          </div>
          <div>
            <dt>Data da campanha</dt>
            <dd>{campaignDate ?? '—'}</dd>
          </div>
          <div>
            <dt>Previsão de pagamento</dt>
            <dd>{paymentDueDate ?? '—'}</dd>
          </div>
        </dl>

        <div className={styles.modalNotes}>
          <p className={styles.modalNotesLabel}>Roteiro</p>
          {campaign.notes ? (
            <p className={styles.modalNotesText}>{campaign.notes}</p>
          ) : (
            <p className={styles.modalNotesEmpty}>Nenhum roteiro adicionado</p>
          )}
        </div>

        <div className={styles.modalActions}>
          <Button variant="danger" onClick={() => onDelete(campaign.id)}>
            Excluir
          </Button>
          <Button variant="secondary" onClick={() => onEdit(campaign)}>
            Editar
          </Button>
          <Button variant="primary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
