import { useId, useState, type FormEvent } from 'react';
import type { CreateIdeaInput, Format, Idea, IdeaStatus, Pillar } from '../../types/idea';
import { Button } from '../ui/Button';
import styles from './IdeaForm.module.css';

interface IdeaFormProps {
  initialIdea?: Idea;
  onSubmit: (input: CreateIdeaInput) => void;
  onCancel: () => void;
  errorMessage?: string;
}

const PILLAR_OPTIONS: { value: Pillar; label: string }[] = [
  { value: 'tech', label: 'Tech' },
  { value: 'life', label: 'Lifestyle' },
  { value: 'both', label: 'Ambos' },
];

const FORMAT_OPTIONS: { value: Format; label: string }[] = [
  { value: 'reels', label: 'Reels' },
  { value: 'carrossel', label: 'Carrossel' },
  { value: 'stories', label: 'Stories' },
  { value: 'post', label: 'Post' },
  { value: 'live', label: 'Live' },
];

const STATUS_OPTIONS: { value: IdeaStatus; label: string }[] = [
  { value: 'idea', label: 'Ideia' },
  { value: 'script', label: 'Roteiro' },
  { value: 'production', label: 'Produção' },
  { value: 'published', label: 'Publicado' },
];

export function IdeaForm({ initialIdea, onSubmit, onCancel, errorMessage }: IdeaFormProps) {
  const formId = useId();
  const isEditing = Boolean(initialIdea);

  const [title, setTitle] = useState(initialIdea?.title ?? '');
  const [pillar, setPillar] = useState<Pillar>(initialIdea?.pillar ?? 'tech');
  const [format, setFormat] = useState<Format>(initialIdea?.format ?? 'reels');
  const [status, setStatus] = useState<IdeaStatus>(initialIdea?.status ?? 'idea');
  const [scheduledDate, setScheduledDate] = useState(initialIdea?.scheduled_date ?? '');
  const [notes, setNotes] = useState(initialIdea?.notes ?? '');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      title,
      pillar,
      format,
      status,
      scheduled_date: scheduledDate || undefined,
      notes: notes || undefined,
    });
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby={`${formId}-title`}>
      <form className={styles.panel} onSubmit={handleSubmit}>
        <h2 id={`${formId}-title`} className={styles.panelTitle}>
          {isEditing ? 'Editar ideia' : 'Nova ideia'}
        </h2>

        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${formId}-title`}>
            Título
          </label>
          <input
            id={`${formId}-title`}
            className={styles.input}
            type="text"
            maxLength={140}
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-pillar`}>
              Pilar
            </label>
            <select
              id={`${formId}-pillar`}
              className={styles.select}
              value={pillar}
              onChange={(event) => setPillar(event.target.value as Pillar)}
            >
              {PILLAR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-format`}>
              Formato
            </label>
            <select
              id={`${formId}-format`}
              className={styles.select}
              value={format}
              onChange={(event) => setFormat(event.target.value as Format)}
            >
              {FORMAT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-status`}>
              Status
            </label>
            <select
              id={`${formId}-status`}
              className={styles.select}
              value={status}
              onChange={(event) => setStatus(event.target.value as IdeaStatus)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-scheduled-date`}>
              Data prevista
            </label>
            <input
              id={`${formId}-scheduled-date`}
              className={styles.input}
              type="date"
              value={scheduledDate ?? ''}
              onChange={(event) => setScheduledDate(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${formId}-notes`}>
            Notas / roteiro
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
            {isEditing ? 'Salvar alterações' : 'Criar ideia'}
          </Button>
        </div>
      </form>
    </div>
  );
}
