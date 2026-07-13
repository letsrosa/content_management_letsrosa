import { useId, useState, type FormEvent } from 'react';
import type { Campaign, CampaignFormat, CampaignStatus, CreateCampaignInput, PaymentStatus } from '../../types/campaign';
import { Button } from '../ui/Button';
import styles from './CampaignForm.module.css';

interface CampaignFormProps {
  initialCampaign?: Campaign;
  onSubmit: (input: CreateCampaignInput) => void;
  onCancel: () => void;
  errorMessage?: string;
}

const FORMAT_OPTIONS: { value: CampaignFormat; label: string }[] = [
  { value: 'reels', label: 'Reels' },
  { value: 'stories', label: 'Stories' },
  { value: 'post', label: 'Post' },
  { value: 'combo', label: 'Combo' },
];

const CAMPAIGN_STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: 'negotiating', label: 'Negociando' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'completed', label: 'Concluída' },
];

const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'pending', label: 'Pendente' },
  { value: 'paid', label: 'Pago' },
];

export function CampaignForm({ initialCampaign, onSubmit, onCancel, errorMessage }: CampaignFormProps) {
  const formId = useId();
  const isEditing = Boolean(initialCampaign);

  const [brand, setBrand] = useState(initialCampaign?.brand ?? '');
  const [campaignName, setCampaignName] = useState(initialCampaign?.campaign_name ?? '');
  const [format, setFormat] = useState<CampaignFormat>(initialCampaign?.format ?? 'reels');
  const [value, setValue] = useState(initialCampaign ? String(initialCampaign.value) : '');
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>(initialCampaign?.campaign_status ?? 'negotiating');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(initialCampaign?.payment_status ?? 'pending');
  const [campaignDate, setCampaignDate] = useState(initialCampaign?.campaign_date ?? '');
  const [paymentDueDate, setPaymentDueDate] = useState(initialCampaign?.payment_due_date ?? '');
  const [notes, setNotes] = useState(initialCampaign?.notes ?? '');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      brand,
      campaign_name: campaignName || undefined,
      format,
      value: Number(value),
      campaign_status: campaignStatus,
      payment_status: paymentStatus,
      campaign_date: campaignDate || undefined,
      payment_due_date: paymentDueDate || undefined,
      notes: notes || undefined,
    });
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <form className={styles.panel} onSubmit={handleSubmit}>
        <h2 id={`${formId}-title`} className={styles.panelTitle}>
          {isEditing ? 'Editar publi' : 'Nova publi'}
        </h2>

        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-brand`}>
              Marca
            </label>
            <input
              id={`${formId}-brand`}
              className={styles.input}
              type="text"
              maxLength={140}
              required
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-campaign-name`}>
              Nome da campanha
            </label>
            <input
              id={`${formId}-campaign-name`}
              className={styles.input}
              type="text"
              value={campaignName}
              onChange={(event) => setCampaignName(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-format`}>
              Formato
            </label>
            <select
              id={`${formId}-format`}
              className={styles.select}
              value={format}
              onChange={(event) => setFormat(event.target.value as CampaignFormat)}
            >
              {FORMAT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-value`}>
              Valor (R$)
            </label>
            <input
              id={`${formId}-value`}
              className={styles.input}
              type="number"
              min={0}
              step={0.01}
              required
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-campaign-status`}>
              Status da campanha
            </label>
            <select
              id={`${formId}-campaign-status`}
              className={styles.select}
              value={campaignStatus}
              onChange={(event) => setCampaignStatus(event.target.value as CampaignStatus)}
            >
              {CAMPAIGN_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-payment-status`}>
              Status do pagamento
            </label>
            <select
              id={`${formId}-payment-status`}
              className={styles.select}
              value={paymentStatus}
              onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
            >
              {PAYMENT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-campaign-date`}>
              Data da campanha
            </label>
            <input
              id={`${formId}-campaign-date`}
              className={styles.input}
              type="date"
              value={campaignDate ?? ''}
              onChange={(event) => setCampaignDate(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-payment-due-date`}>
              Previsão de pagamento
            </label>
            <input
              id={`${formId}-payment-due-date`}
              className={styles.input}
              type="date"
              value={paymentDueDate ?? ''}
              onChange={(event) => setPaymentDueDate(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${formId}-notes`}>
            Roteiro / notas
          </label>
          <textarea
            id={`${formId}-notes`}
            className={styles.textarea}
            value={notes ?? ''}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Salvar alterações' : 'Criar publi'}
          </Button>
        </div>
      </form>
    </div>
  );
}
