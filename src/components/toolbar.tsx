"use client";

import { Button } from "@/components/ui/button";
import { Download, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import { useGraphStore } from "@/store/useGraphStore";

export function Toolbar() {
  const zoomIn = useGraphStore((s) => s.zoomIn);
  const zoomOut = useGraphStore((s) => s.zoomOut);
  const resetView = useGraphStore((s) => s.resetView);

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={() => resetView?.()}>
        <RefreshCw className="size-4 mr-2" />
        Reset
      </Button>
      <Button variant="outline" size="sm" onClick={() => zoomOut?.()}>
        <ZoomOut className="size-4 mr-2" />
        Zoom Out
      </Button>
      <Button variant="outline" size="sm" onClick={() => zoomIn?.()}>
        <ZoomIn className="size-4 mr-2" />
        Zoom In
      </Button>
      <Button size="sm" onClick={() => toast.success("Export coming soon")}>
        <Download className="size-4 mr-2" />
        Export
      </Button>
    </div>
  );
}
