export type Pillar = 'tech' | 'life' | 'both';
export type Format = 'reels' | 'carrossel' | 'stories' | 'post' | 'live';
export type IdeaStatus = 'idea' | 'script' | 'production' | 'published';

export interface Idea {
  id: string;
  title: string;
  pillar: Pillar;
  format: Format;
  status: IdeaStatus;
  scheduled_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IdeaFilters {
  pillar?: Pillar;
  status?: IdeaStatus;
}

export interface CreateIdeaInput {
  title: string;
  pillar: Pillar;
  format: Format;
  status?: IdeaStatus;
  scheduled_date?: string;
  notes?: string;
}

export type UpdateIdeaInput = Partial<CreateIdeaInput>;
