import type { Pillar } from '../../types/idea';
import styles from './filters.module.css';

interface PillarOption {
  value: Pillar | undefined;
  label: string;
}

const OPTIONS: PillarOption[] = [
  { value: undefined, label: 'Todos' },
  { value: 'tech', label: 'Tech' },
  { value: 'life', label: 'Lifestyle' },
  { value: 'both', label: 'Ambos' },
];

interface PillarChipsProps {
  selected: Pillar | undefined;
  onChange: (pillar: Pillar | undefined) => void;
}

function activeClassFor(pillar: Pillar | undefined): string {
  if (pillar === 'tech') return styles.chipActiveTech;
  if (pillar === 'life') return styles.chipActiveLife;
  if (pillar === 'both') return styles.chipActiveBoth;
  return styles.chipActiveNeutral;
}

export function PillarChips({ selected, onChange }: PillarChipsProps) {
  return (
    <div className={styles.filtersRow} role="group" aria-label="Filtrar por pilar">
      {OPTIONS.map((option) => {
        const isActive = selected === option.value;
        return (
          <button
            key={option.label}
            type="button"
            className={[styles.chip, isActive ? activeClassFor(option.value) : ''].filter(Boolean).join(' ')}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
