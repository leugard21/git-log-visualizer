const CHART_TOKENS = [
  "oklch(var(--chart-1))",
  "oklch(var(--chart-2))",
  "oklch(var(--chart-3))",
  "oklch(var(--chart-4))",
  "oklch(var(--chart-5))",
];

function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function colorForBranch(branch?: string): string {
  if (!branch) return "oklch(var(--muted-foreground))"; // fallback
  const idx = hashString(branch) % CHART_TOKENS.length;
  return CHART_TOKENS[idx];
}
