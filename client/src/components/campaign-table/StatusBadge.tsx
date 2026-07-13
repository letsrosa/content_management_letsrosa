import styles from './campaign-table.module.css';
import type { CampaignStatus, PaymentStatus } from '../../types/campaign';

type BadgeTone = CampaignStatus | PaymentStatus | 'overdue';

const LABEL: Record<BadgeTone, string> = {
  negotiating: 'Negociando',
  confirmed: 'Confirmada',
  in_progress: 'Em andamento',
  completed: 'Concluída',
  pending: 'Pendente',
  paid: 'Pago',
  overdue: 'Atrasado',
};

const TONE_CLASS: Record<BadgeTone, string> = {
  negotiating: styles.badgeNegotiating,
  confirmed: styles.badgeConfirmed,
  in_progress: styles.badgeInProgress,
  completed: styles.badgeCompleted,
  pending: styles.badgePending,
  paid: styles.badgePaid,
  overdue: styles.badgeOverdue,
};

interface StatusBadgeProps {
  tone: BadgeTone;
}

export function StatusBadge({ tone }: StatusBadgeProps) {
  const icon = tone === 'overdue' ? '⚠' : '●';

  return (
    <span className={[styles.badge, TONE_CLASS[tone]].join(' ')}>
      <span aria-hidden="true">{icon}</span> {LABEL[tone]}
    </span>
  );
}
