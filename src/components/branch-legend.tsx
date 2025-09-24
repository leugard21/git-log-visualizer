"use client";

import { useCommitStore } from "@/store/useCommitStore";
import { colorForBranch } from "@/lib/colors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BranchLegend() {
  const commits = useCommitStore((s) => s.commits);
  const branches = Array.from(new Set(commits.map((c) => c.branch).filter(Boolean))) as string[];

  if (branches.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Branches</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {branches.map((b) => (
          <div key={b} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block size-3 rounded-sm border"
              style={{ background: colorForBranch(b) }}
            />
            <span>{b}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
