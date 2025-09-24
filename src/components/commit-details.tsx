"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCommitStore } from "@/store/useCommitStore";

export function CommitDetails() {
  const selected = useCommitStore((s) => s.selected);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Commit Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selected ? (
          <p className="text-sm text-muted-foreground">Select a commit to see details here.</p>
        ) : (
          <>
            <div>
              <h3 className="text-sm font-medium">Message</h3>
              <p className="text-sm">{selected.message}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium">Author</h3>
              <p className="text-sm">
                {selected.authorName}{" "}
                {selected.authorEmail && (
                  <span className="text-muted-foreground">&lt;{selected.authorEmail}&gt;</span>
                )}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Date</h3>
              <p className="text-sm">{new Date(selected.authorDate).toLocaleString()}</p>
            </div>

            {selected.stats && (
              <div>
                <h3 className="text-sm font-medium">Stats</h3>
                <p className="text-sm text-muted-foreground">
                  {selected.stats.filesChanged ?? 0} files changed, {selected.stats.insertions ?? 0}{" "}
                  insertions(+), {selected.stats.deletions ?? 0} deletions(-)
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
