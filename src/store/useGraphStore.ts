"use client";

import { create } from "zustand";

type ZoomFn = (() => void) | null;

type GraphState = {
  zoomIn: ZoomFn;
  zoomOut: ZoomFn;
  resetView: ZoomFn;
  setZoomFns: (fns: { zoomIn: ZoomFn; zoomOut: ZoomFn; resetView: ZoomFn }) => void;
};

export const useGraphStore = create<GraphState>((set) => ({
  zoomIn: null,
  zoomOut: null,
  resetView: null,
  setZoomFns: (fns) => set(fns),
}));
