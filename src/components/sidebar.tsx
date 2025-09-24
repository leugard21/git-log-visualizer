"use client";

import UploadPanel from "./upload-panel";

export function Sidebar() {
  return (
    <div className="p-3 space-y-4">
      <UploadPanel />
      <div className="text-xs text-muted-foreground">Filters will appear here</div>
    </div>
  );
}
