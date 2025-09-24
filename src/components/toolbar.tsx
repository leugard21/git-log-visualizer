"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { Download, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";

export default function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <Button variant={"secondary"} size={"sm"} onClick={() => toast.info("Reset view")}>
        <RefreshCw className="size-4 mr-2" />
        Reset
      </Button>
      <Button variant="outline" size="sm">
        <ZoomOut className="size-4 mr-2" />
        Zoom Out
      </Button>
      <Button variant="outline" size="sm">
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
