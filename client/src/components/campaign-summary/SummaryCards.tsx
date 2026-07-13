import { formatCurrency } from '../../utils/formatCurrency';
import type { CampaignSummary } from '../../types/campaign';
import styles from './campaign-summary.module.css';

interface SummaryCardsProps {
  summary: CampaignSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.label}>Total</span>
        <span className={[styles.value, styles.valueInk].join(' ')}>{summary.total}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Ativas</span>
        <span className={[styles.value, styles.valueTech].join(' ')}>{summary.active}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Total R$</span>
        <span className={[styles.value, styles.valueLife].join(' ')}>{formatCurrency(summary.totalValue)}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Receber R$</span>
        <span className={[styles.value, styles.valueBoth].join(' ')}>{formatCurrency(summary.confirmedValue)}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Recebido R$</span>
        <span className={[styles.value, styles.valueTech].join(' ')}>{formatCurrency(summary.paidValue)}</span>
      </div>
    </div>
  );
}
