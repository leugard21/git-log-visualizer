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

export function FilterPanel() {
  const authors = ["Alice", "Bob", "Charlie"];
  const branches = ["main", "develop", "feature-x"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Authors</h3>
          <div className="space-y-2">
            {authors.map((a) => (
              <div key={a} className="flex items-center space-x-2">
                <Checkbox id={`author-${a}`} />
                <Label htmlFor={`author-${a}`} className="text-sm">
                  {a}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Branch</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All branches" />
            </SelectTrigger>
            <SelectContent>
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
            <Input type="date" />
            <Input type="date" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
