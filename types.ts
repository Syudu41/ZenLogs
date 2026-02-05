
export type LogCategory = 'Personal' | 'Work' | 'Ideas' | 'Goals' | 'Journal';

export interface LogEntry {
  id: string;
  timestamp: number;
  content: string;
  category: LogCategory;
  tags: string[];
  mood?: string;
}

export interface DailySummary {
  date: string;
  summary: string;
  keyTakeaways: string[];
  suggestedFocus: string;
}
