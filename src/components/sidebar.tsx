"use client";

import { FilterPanel } from "./filter-panel";
import UploadPanel from "./upload-panel";

export function Sidebar() {
  return (
    <div className="p-3 space-y-4">
      <UploadPanel />
      <FilterPanel />
    </div>
  );
}
