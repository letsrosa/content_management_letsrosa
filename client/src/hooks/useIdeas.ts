import { useCallback, useEffect, useState } from 'react';
import * as ideasApi from '../services/ideasApi';
import type { CreateIdeaInput, Idea, IdeaFilters, IdeaStatus, Pillar, UpdateIdeaInput } from '../types/idea';

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filters, setFilters] = useState<IdeaFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ideasApi.listIdeas(filters);
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ideias');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const setPillarFilter = useCallback((pillar: Pillar | undefined) => {
    setFilters((prev) => ({ ...prev, pillar }));
  }, []);

  const setStatusFilter = useCallback((status: IdeaStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const createIdea = useCallback(async (input: CreateIdeaInput) => {
    const idea = await ideasApi.createIdea(input);
    setIdeas((prev) => [idea, ...prev]);
    return idea;
  }, []);

  const updateIdea = useCallback(async (id: string, input: UpdateIdeaInput) => {
    const idea = await ideasApi.updateIdea(id, input);
    setIdeas((prev) => prev.map((item) => (item.id === id ? idea : item)));
    return idea;
  }, []);

  const changeStatus = useCallback(async (id: string, status: IdeaStatus) => {
    const idea = await ideasApi.updateIdeaStatus(id, status);
    setIdeas((prev) => prev.map((item) => (item.id === id ? idea : item)));
    return idea;
  }, []);

  const removeIdea = useCallback(async (id: string) => {
    await ideasApi.deleteIdea(id);
    setIdeas((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    ideas,
    loading,
    error,
    filters,
    setPillarFilter,
    setStatusFilter,
    createIdea,
    updateIdea,
    changeStatus,
    deleteIdea: removeIdea,
  };
}
