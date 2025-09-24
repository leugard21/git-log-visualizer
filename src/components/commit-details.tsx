"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function CommitDetails() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Commit Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Message</h3>
          <p className="text-sm text-muted-foreground">Select a commit to see details here.</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium">Author</h3>
          <p className="text-sm text-muted-foreground">—</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Date</h3>
          <p className="text-sm text-muted-foreground">—</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Stats</h3>
          <p className="text-sm text-muted-foreground">—</p>
        </div>
      </CardContent>
    </Card>
  );
}
