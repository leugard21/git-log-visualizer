/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Commit, CommitFilters, UploadedLog } from "@/types/git";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CommitState = {
  commits: Commit[];
  byHash: Map<string, Commit>;
  selectedHash: string | null;
  filters: CommitFilters;

  uploaded: UploadedLog | null;

  setCommits: (commits: Commit[]) => void;
  clearCommits: () => void;
  setFilters: (updater: Partial<CommitFilters> | ((f: CommitFilters) => CommitFilters)) => void;
  selectCommit: (hash: string | null) => void;

  setUploaded: (u: UploadedLog | null) => void;

  getSelected: () => Commit | null;
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
      byHash: new Map(),
      selectedHash: null,
      filters: initialFilters,

      uploaded: null,

      setCommits: (commits) => {
        const byHash = new Map<string, Commit>();
        for (const c of commits) byHash.set(c.hash, c);
        set({ commits, byHash, selectedHash: null });
      },

      clearCommits: () => set({ commits: [], byHash: new Map(), selectedHash: null }),

      setFilters: (updater) => {
        const current = get().filters;
        const next =
          typeof updater === "function" ? (updater as any)(current) : { ...current, ...updater };
        set({ filters: next });
      },

      selectCommit: (hash) => set({ selectedHash: hash }),

      setUploaded: (u) => set({ uploaded: u }),

      getSelected: () => {
        const { selectedHash, byHash } = get();
        if (!selectedHash) return null;
        return byHash.get(selectedHash) ?? null;
      },
    }),
    {
      name: "glv:commit-store:v1",
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);
