export type Commit = {
  hash: string;
  parents: string[];
  authorName: string;
  authorEmail?: string;
  authorDate: string;
  message: string;
  stats?: {
    filesChanged?: number;
    insertions?: number;
    deletions?: number;
  };
  branch?: string;
};

export type CommitFilters = {
  authors: string[];
  branches: string[];
  dateFrom?: string | null;
  dateTo: string | null;
  query?: string;
};

export type UploadedLog = {
  name: string;
  size: number;
  type: string;
  text: string;
  lineCount: number;
};
