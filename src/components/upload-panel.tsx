"use client";

import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

export default function UploadPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upload Git Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input
          type="file"
          accept=".json,.ndjson,.txt,application/json"
          onChange={() => toast.message("File selected")}
        />
        <p className="text-xs text-muted-foreground">
          Supports JSON or NDJSON exported from <code>git log</code>.
        </p>
      </CardContent>
    </Card>
  );
}
