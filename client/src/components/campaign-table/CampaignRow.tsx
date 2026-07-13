import type { ChangeEvent, MouseEvent } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Campaign, CampaignStatus, PaymentStatus } from '../../types/campaign';
import styles from './campaign-table.module.css';

const FORMAT_LABEL: Record<Campaign['format'], string> = {
  reels: 'Reels',
  stories: 'Stories',
  post: 'Post',
  combo: 'Combo',
};

const CAMPAIGN_STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: 'negotiating', label: 'Negociando' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'completed', label: 'Concluída' },
];

const CAMPAIGN_STATUS_CLASS: Record<CampaignStatus, string> = {
  negotiating: styles.selectNegotiating,
  confirmed: styles.selectConfirmed,
  in_progress: styles.selectInProgress,
  completed: styles.selectCompleted,
};

const PAYMENT_STATUS_CLASS: Record<PaymentStatus, string> = {
  pending: styles.selectPending,
  paid: styles.selectPaid,
};

interface CampaignRowProps {
  campaign: Campaign;
  onRowClick: (id: string) => void;
  onCampaignStatusChange: (id: string, status: CampaignStatus) => void;
  onPaymentStatusChange: (id: string, status: PaymentStatus) => void;
}

function stopPropagation(event: MouseEvent) {
  event.stopPropagation();
}

export function CampaignRow({ campaign, onRowClick, onCampaignStatusChange, onPaymentStatusChange }: CampaignRowProps) {
  function handleCampaignStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    onCampaignStatusChange(campaign.id, event.target.value as CampaignStatus);
  }

  function handlePaymentStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    onPaymentStatusChange(campaign.id, event.target.value as PaymentStatus);
  }

  const paymentSelectClass = campaign.isOverdue ? styles.selectOverdue : PAYMENT_STATUS_CLASS[campaign.payment_status];

  return (
    <tr className={styles.row} onClick={() => onRowClick(campaign.id)}>
      <td data-label="Campanha">
        <p className={styles.brand}>{campaign.brand}</p>
        {campaign.campaign_name && <p className={styles.campaignName}>{campaign.campaign_name}</p>}
      </td>
      <td data-label="Formato" className={styles.format}>
        {FORMAT_LABEL[campaign.format]}
      </td>
      <td data-label="Status">
        <select
          className={[styles.statusSelect, CAMPAIGN_STATUS_CLASS[campaign.campaign_status]].join(' ')}
          value={campaign.campaign_status}
          onClick={stopPropagation}
          onChange={handleCampaignStatusChange}
          aria-label={`Status da campanha ${campaign.brand}`}
        >
          {CAMPAIGN_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </td>
      <td data-label="Valor" className={styles.value}>
        {formatCurrency(campaign.value)}
      </td>
      <td data-label="Pagamento">
        <select
          className={[styles.statusSelect, paymentSelectClass].join(' ')}
          value={campaign.payment_status}
          onClick={stopPropagation}
          onChange={handlePaymentStatusChange}
          aria-label={`Status de pagamento de ${campaign.brand}`}
        >
          <option value="pending">{campaign.isOverdue ? '⚠ Atrasado' : 'Pendente'}</option>
          <option value="paid">Pago</option>
        </select>
      </td>
    </tr>
  );
}
