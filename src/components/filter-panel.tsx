/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCommitStore } from "@/store/useCommitStore";

export function FilterPanel() {
  const commits = useCommitStore((s) => s.commits);
  const filters = useCommitStore((s) => s.filters);
  const setFilters = useCommitStore((s) => s.setFilters);

  const authors = Array.from(new Set(commits.map((c) => c.authorName || c.authorEmail)));
  const branches = Array.from(new Set(commits.map((c) => c.branch).filter(Boolean))) as string[];

  const toggleAuthor = (a: string) => {
    setFilters((f) => {
      const selected = new Set(f.authors);
      if (selected.has(a)) selected.delete(a);
      else selected.add(a);
      return { ...f, authors: Array.from(selected) };
    });
  };

  const handleBranch = (b: string) => {
    setFilters({ branches: b ? [b] : [] });
  };

  const handleDateFrom = (v: string) => {
    setFilters({ dateFrom: v || null });
  };

  const handleDateTo = (v: string) => {
    setFilters({ dateTo: v || null });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Authors</h3>
          <div className="space-y-2">
            {authors.map((a: any) => (
              <div key={a} className="flex items-center space-x-2">
                <Checkbox
                  id={`author-${a}`}
                  checked={filters.authors.includes(a)}
                  onCheckedChange={() => toggleAuthor(a)}
                />
                <Label htmlFor={`author-${a}`} className="text-sm">
                  {a}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Branch</h3>
          <Select
            value={filters.branches[0] ?? "__all__"}
            onValueChange={(val) => {
              if (val === "__all__") {
                setFilters({ branches: [] });
              } else {
                setFilters({ branches: [val] });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Date range</h3>
          <div className="space-y-2">
            <Input
              type="date"
              value={filters.dateFrom ?? ""}
              onChange={(e) => handleDateFrom(e.target.value)}
            />
            <Input
              type="date"
              value={filters.dateTo ?? ""}
              onChange={(e) => handleDateTo(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
