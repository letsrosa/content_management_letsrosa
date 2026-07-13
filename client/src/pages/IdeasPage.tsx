import { useState } from 'react';
import styles from '../App.module.css';
import { PillarChips } from '../components/filters/PillarChips';
import { StatusTabs } from '../components/filters/StatusTabs';
import { IdeaForm } from '../components/idea-form/IdeaForm';
import { IdeaLog } from '../components/idea-log/IdeaLog';
import { Button } from '../components/ui/Button';
import { useIdeas } from '../hooks/useIdeas';
import type { CreateIdeaInput, Idea } from '../types/idea';

export function IdeasPage() {
  const {
    ideas,
    loading,
    error,
    filters,
    setPillarFilter,
    setStatusFilter,
    createIdea,
    updateIdea,
    changeStatus,
    deleteIdea,
  } = useIdeas();

  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  function openCreateForm() {
    setEditingIdea(null);
    setFormError(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(idea: Idea) {
    setEditingIdea(idea);
    setFormError(undefined);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingIdea(null);
    setFormError(undefined);
  }

  async function handleSubmit(input: CreateIdeaInput) {
    try {
      if (editingIdea) {
        await updateIdea(editingIdea.id, input);
      } else {
        await createIdea(input);
      }
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar ideia');
    }
  }

  async function handleDelete(id: string) {
    await deleteIdea(id);
  }

  return (
    <>
      <div className={styles.pageToolbar}>
        <h2 className={styles.pageTitle}>Ideias</h2>
        <Button variant="primary" onClick={openCreateForm}>
          + Nova ideia
        </Button>
      </div>

      <PillarChips selected={filters.pillar} onChange={setPillarFilter} />
      <StatusTabs selected={filters.status} onChange={setStatusFilter} />

      <main className={styles.main}>
        {loading && <p className={styles.statusMessage}>Carregando ideias...</p>}
        {error && <p className={styles.statusMessage}>{error}</p>}

        {!loading && !error && (
          <IdeaLog
            ideas={ideas}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onStatusChange={changeStatus}
            onCreateFirstIdea={openCreateForm}
          />
        )}
      </main>

      {isFormOpen && (
        <IdeaForm
          initialIdea={editingIdea ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          errorMessage={formError}
        />
      )}
    </>
  );
}
