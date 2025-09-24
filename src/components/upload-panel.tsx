/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { useCommitStore } from "@/store/useCommitStore";
import { useCallback, useRef, useState } from "react";
import { formatBytes } from "@/lib/bytes";
import { UploadCloud, X } from "lucide-react";
import { Button } from "./ui/button";
import { parseGitLog } from "@/lib/parse";

const ACCEPT_TYPES = ["application/json", "text/plain"];

const ACCEPT_EXTS = [".json", ".ndjson", ".txt"];
const MAX_SIZE_BYTES = 50 * 1024 * 1024;

export default function UploadPanel() {
  const uploaded = useCommitStore((s) => s.uploaded);
  const setUploaded = useCommitStore((s) => s.setUploaded);
  const setCommits = useCommitStore((s) => s.setCommits);
  const commits = useCommitStore((s) => s.commits);

  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFile = useCallback(
    async (file: File) => {
      if (!file) return;

      const extOk = ACCEPT_EXTS.some((e) => file.name.toLowerCase().endsWith(e));
      const typeOk = ACCEPT_TYPES.includes(file.type) || file.type === "";
      if (!extOk && !typeOk) {
        toast.error("Unsupported file type. Use .json, .ndjson, or .txt");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(
          `File too large (${formatBytes(file.size)}). Max is ${formatBytes(MAX_SIZE_BYTES)}.`
        );
        return;
      }

      try {
        const text = await file.text();
        const lineCount = (text.match(/\r?\n/g) || []).length + (text.endsWith("\n") ? 0 : 1);
        setUploaded({
          name: file.name,
          size: file.size,
          type: file.type || "text/plain",
          text,
          lineCount,
        });
        toast.success(`Loaded "${file.name}" (${formatBytes(file.size)})`);
      } catch (e) {
        console.error(e);
        toast.error("Failed to read file");
      }
    },
    [setUploaded]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.currentTarget.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const parseNow = () => {
    if (!uploaded) {
      toast.error("No file loaded.");
      return;
    }
    try {
      const { commits: parsed, warnings } = parseGitLog(uploaded.text);
      setCommits(parsed);
      const uniqueAuthors = new Set(parsed.map((c) => c.authorEmail || c.authorName)).size;
      toast.success(
        `Parsed ${parsed.length} commits • ${uniqueAuthors} author${uniqueAuthors === 1 ? "" : "s"}`
      );
      if (warnings.length) {
        toast.message(
          `Warnings: ${warnings.slice(0, 3).join(" | ")}${warnings.length > 3 ? " …" : ""}`
        );
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to parse file");
    }
  };

  const clear = () => setUploaded(null);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upload Git Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          onDrop={handleDrop}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          className={[
            "relative flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-6 text-center transition",
            dragActive ? "border-primary bg-secondary/50" : "border-border",
          ].join(" ")}
        >
          <UploadCloud className="mb-2 size-6 opacity-80" />
          <p className="text-sm">
            Drag & Drop your <span className="font-medium">JSON/NDJSON</span> here
          </p>
          <p className="text-xs text-muted-foreground mt-2">or</p>
          <div className="mt-2 items-center gap-2">
            <label className="inline-block">
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT_EXTS.join(",")}
                onChange={handleInput}
                className="sr-only"
                aria-label="Upload Git log file"
                tabIndex={-1}
              />
              <Button size="sm" variant="default" onClick={openPicker}>
                Choose file
              </Button>
            </label>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Max {formatBytes(MAX_SIZE_BYTES)}. Accepts .json, .ndjson, .txt
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={parseNow} disabled={!uploaded}>
            Parse file
          </Button>
          <span className="text-xs text-muted-foreground">
            {commits.length > 0 ? `Loaded ${commits.length} commits` : "No commits loaded"}
          </span>
        </div>

        {uploaded ? (
          <div className="flex items-start justify-between rounded-md border p-2">
            <div className="text-sm">
              <div className="font-medium">{uploaded.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatBytes(uploaded.size)} • ~{uploaded.lineCount} lines
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clear}
              aria-label="Clear uploaded file"
              className="shrink-0"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
