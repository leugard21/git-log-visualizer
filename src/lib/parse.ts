import type { Commit } from "@/types/git";

const SHORTSTAT_RE =
  /(?:(\d+)\s+files?\s+changed)?(?:,\s*(\d+)\s+insertions?\(\+\))?(?:,\s*(\d+)\s+deletions?\(-\))?/i;

type RawCommit = Partial<Commit> & {
  parents?: string | string[];
  authorDate?: string;
};

function isString(x: unknown): x is string {
  return typeof x === "string";
}

function normalizeCommit(raw: RawCommit): Commit | null {
  if (!raw || !raw.hash || !raw.authorName || !raw.authorDate || !raw.message) return null;

  let parents: string[] = [];

  if (Array.isArray(raw.parents)) {
    parents = raw.parents.map(String);
  } else if (isString(raw.parents)) {
    const trimmed = raw.parents.trim();
    parents = trimmed ? trimmed.split(/\s+/) : [];
  }

  let iso = raw.authorDate!;
  try {
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) iso = d.toISOString();
  } catch {}

  const commit: Commit = {
    hash: String(raw.hash),
    parents,
    authorName: String(raw.authorName),
    authorEmail: raw.authorEmail ? String(raw.authorEmail) : undefined,
    authorDate: iso,
    message: String(raw.message),
    stats: raw.stats
      ? {
          filesChanged: raw.stats.filesChanged,
          insertions: raw.stats.insertions,
          deletions: raw.stats.deletions,
        }
      : undefined,
    branch: raw.branch,
  };

  return commit;
}

function parseJsonArray(text: string): Commit[] | null {
  try {
    const arr = JSON.parse(text);
    if (!Array.isArray(arr)) return null;
    const commits: Commit[] = [];
    for (const item of arr) {
      const c = normalizeCommit(item as RawCommit);
      if (c) commits.push(c);
    }
    return commits;
  } catch {
    return null;
  }
}

function parseNdjsonWithOptionalStats(text: string): Commit[] | null {
  const lines = text.split(/\r?\n/);
  const commits: Commit[] = [];
  let last: Commit | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("{") && line.endsWith("}")) {
      try {
        const obj = JSON.parse(line) as RawCommit;
        const c = normalizeCommit(obj);
        if (c) {
          commits.push(c);
          last = c;
        }
        continue;
      } catch {}
    }

    if (last) {
      const m = line.match(SHORTSTAT_RE);
      if (m) {
        const filesChanged = m[1] ? Number(m[1]) : undefined;
        const insertions = m[2] ? Number(m[2]) : undefined;
        const deletions = m[3] ? Number(m[3]) : undefined;
        last.stats = { filesChanged, insertions, deletions };
        continue;
      }
    }
  }

  return commits.length ? commits : null;
}

export function parseGitLog(text: string): { commits: Commit[]; warnings: string[] } {
  const warnings: string[] = [];
  let commits = parseJsonArray(text);

  if (!commits) {
    commits = parseNdjsonWithOptionalStats(text);
  }

  if (!commits) {
    throw new Error(
      "Unrecognized format. Provide JSON array or NDJSON (one JSON commit per line)."
    );
  }

  const seen = new Set<string>();
  const cleaned: Commit[] = [];
  for (const c of commits) {
    if (seen.has(c.hash)) {
      warnings.push(`Duplicate hash skipped: ${c.hash}`);
      continue;
    }
    seen.add(c.hash);
    cleaned.push(c);
  }

  cleaned.sort((a, b) => (a.authorDate < b.authorDate ? 1 : a.authorDate > b.authorDate ? -1 : 0));

  return { commits: cleaned, warnings };
}
