import type { Campaign, CampaignStatus, PaymentStatus } from '../../types/campaign';
import { EmptyState } from '../ui/EmptyState';
import { CampaignRow } from './CampaignRow';
import { StatusBadge } from './StatusBadge';
import styles from './campaign-table.module.css';

interface CampaignTableProps {
  campaigns: Campaign[];
  onRowClick: (id: string) => void;
  onCampaignStatusChange: (id: string, status: CampaignStatus) => void;
  onPaymentStatusChange: (id: string, status: PaymentStatus) => void;
  onCreateFirstCampaign: () => void;
}

export function CampaignTable({
  campaigns,
  onRowClick,
  onCampaignStatusChange,
  onPaymentStatusChange,
  onCreateFirstCampaign,
}: CampaignTableProps) {
  if (campaigns.length === 0) {
    return (
      <EmptyState
        title="Nenhuma publi cadastrada ainda"
        description="Registre sua primeira campanha para acompanhar valores e pagamentos."
        actionLabel="Criar primeira publi"
        onAction={onCreateFirstCampaign}
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Campanha</th>
            <th>Formato</th>
            <th>Status</th>
            <th>Valor</th>
            <th>Pagamento</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <CampaignRow
              key={campaign.id}
              campaign={campaign}
              onRowClick={onRowClick}
              onCampaignStatusChange={onCampaignStatusChange}
              onPaymentStatusChange={onPaymentStatusChange}
            />
          ))}
        </tbody>
      </table>

      <p className={styles.legend}>
        <StatusBadge tone="overdue" /> = pagamento pendente com data de vencimento já passada
      </p>
    </div>
  );
}
