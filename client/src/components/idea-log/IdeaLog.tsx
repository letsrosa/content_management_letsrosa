import type { Idea, IdeaStatus } from '../../types/idea';
import { EmptyState } from '../ui/EmptyState';
import { IdeaCard } from './IdeaCard';
import styles from './idea-log.module.css';

interface IdeaLogProps {
  ideas: Idea[];
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: IdeaStatus) => void;
  onCreateFirstIdea: () => void;
}

export function IdeaLog({ ideas, onEdit, onDelete, onStatusChange, onCreateFirstIdea }: IdeaLogProps) {
  if (ideas.length === 0) {
    return (
      <EmptyState
        title="Nenhuma ideia por aqui ainda"
        description="Registre sua próxima ideia de conteúdo para começar o diário."
        actionLabel="Criar primeira ideia"
        onAction={onCreateFirstIdea}
      />
    );
  }

  return (
    <ul className={styles.log}>
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      ))}
    </ul>
  );
}
