import type { Idea, IdeaStatus } from '../../types/idea';
import { formatScheduledDate } from '../../utils/formatDate';
import styles from './idea-log.module.css';

const PILLAR_LABEL: Record<Idea['pillar'], string> = {
  tech: 'Tech',
  life: 'Lifestyle',
  both: 'Ambos',
};

const FORMAT_LABEL: Record<Idea['format'], string> = {
  reels: 'Reels',
  carrossel: 'Carrossel',
  stories: 'Stories',
  post: 'Post',
  live: 'Live',
};

const STATUS_LABEL: Record<IdeaStatus, string> = {
  idea: 'Ideia',
  script: 'Roteiro',
  production: 'Produção',
  published: 'Publicado',
};

const STATUS_OPTIONS: IdeaStatus[] = ['idea', 'script', 'production', 'published'];

const NODE_CLASS: Record<Idea['pillar'], string> = {
  tech: styles.nodeTech,
  life: styles.nodeLife,
  both: styles.nodeBoth,
};

const TAG_CLASS: Record<Idea['pillar'], string> = {
  tech: styles.tagTech,
  life: styles.tagLife,
  both: styles.tagBoth,
};

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: IdeaStatus) => void;
}

export function IdeaCard({ idea, onEdit, onDelete, onStatusChange }: IdeaCardProps) {
  const scheduledDate = formatScheduledDate(idea.scheduled_date);
  const hash = `#${idea.id.slice(0, 4)}`;

  return (
    <li className={styles.item}>
      <span className={[styles.node, NODE_CLASS[idea.pillar]].join(' ')} aria-hidden="true" />
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{idea.title}</h3>
          <span className={styles.hash}>{hash}</span>
        </div>

        <div className={styles.metaRow}>
          <span className={[styles.tag, TAG_CLASS[idea.pillar]].join(' ')}>{PILLAR_LABEL[idea.pillar]}</span>
          <span className={styles.tag}>{FORMAT_LABEL[idea.format]}</span>
          {scheduledDate && <span className={styles.scheduledDate}>{scheduledDate}</span>}
        </div>

        {idea.notes && <p className={styles.notes}>{idea.notes}</p>}

        <div className={styles.footer}>
          <label>
            <span className="sr-only">Status de {idea.title}</span>
            <select
              className={styles.statusSelect}
              value={idea.status}
              onChange={(event) => onStatusChange(idea.id, event.target.value as IdeaStatus)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABEL[status]}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.iconButton} onClick={() => onEdit(idea)}>
              Editar
            </button>
            <button type="button" className={styles.iconButton} onClick={() => onDelete(idea.id)}>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
