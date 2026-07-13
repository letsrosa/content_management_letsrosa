import type { IdeaStatus } from '../../types/idea';
import styles from './filters.module.css';

interface StatusOption {
  value: IdeaStatus | undefined;
  label: string;
}

const OPTIONS: StatusOption[] = [
  { value: undefined, label: 'Todas' },
  { value: 'idea', label: 'Ideia' },
  { value: 'script', label: 'Roteiro' },
  { value: 'production', label: 'Produção' },
  { value: 'published', label: 'Publicado' },
];

interface StatusTabsProps {
  selected: IdeaStatus | undefined;
  onChange: (status: IdeaStatus | undefined) => void;
}

export function StatusTabs({ selected, onChange }: StatusTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Filtrar por status">
      {OPTIONS.map((option) => {
        const isActive = selected === option.value;
        return (
          <button
            key={option.label}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={[styles.tab, isActive ? styles.tabActive : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
