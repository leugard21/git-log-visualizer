/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Commit, CommitFilters, UploadedLog } from "@/types/git";

type CommitState = {
  commits: Commit[];
  uploaded: UploadedLog | null;

  filters: CommitFilters;
  selected: Commit | null;

  setCommits: (commits: Commit[]) => void;
  clearCommits: () => void;

  setFilters: (updater: Partial<CommitFilters> | ((f: CommitFilters) => CommitFilters)) => void;

  selectCommit: (commit: Commit | null) => void;

  setUploaded: (u: UploadedLog | null) => void;
};

const initialFilters: CommitFilters = {
  authors: [],
  branches: [],
  dateFrom: null,
  dateTo: null,
  query: "",
};

export const useCommitStore = create<CommitState>()(
  persist(
    (set, get) => ({
      commits: [],
      uploaded: null,

      filters: initialFilters,
      selected: null,

      setCommits: (commits) => set({ commits, selected: null }),
      clearCommits: () => set({ commits: [], selected: null }),

      setFilters: (updater) => {
        const current = get().filters;
        const next =
          typeof updater === "function" ? (updater as any)(current) : { ...current, ...updater };
        set({ filters: next });
      },

      selectCommit: (commit) => set({ selected: commit }),

      setUploaded: (u) => set({ uploaded: u }),
    }),
    {
      name: "glv:commit-store:v1",
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);
