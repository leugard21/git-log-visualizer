/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { useCommitStore } from "@/store/useCommitStore";
import { useGraphStore } from "@/store/useGraphStore"; // used to wire Toolbar zoom buttons (Step 9)

// Layout constants (will evolve once we add real branch lanes)
const ROW_HEIGHT = 50;
const COL_X = 200;

// Simple word-wrap for SVG <text> using <tspan>s
function wrapText(text: string, charPerLine = 50): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const next = current ? current + " " + w : w;
    if (next.length > charPerLine) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function CommitGraph() {
  const commits = useCommitStore((s) => s.commits);
  const selected = useCommitStore((s) => s.selected);
  const selectCommit = useCommitStore((s) => s.selectCommit);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);

  const setZoomFns = useGraphStore((s) => s.setZoomFns);

  // Compute node positions (newest first order already enforced by parser; using array index here)
  const nodes = useMemo(() => {
    return commits.map((c, i) => ({
      ...c,
      x: COL_X,
      y: i * ROW_HEIGHT + 40,
    }));
  }, [commits]);

  // Map parent links (source → this commit, target → parent commit)
  const links = useMemo(() => {
    const byHash = new Map(nodes.map((n) => [n.hash, n]));
    const out: { source: (typeof nodes)[number]; target: (typeof nodes)[number] }[] = [];
    for (const n of nodes) {
      for (const p of n.parents) {
        const target = byHash.get(p);
        if (target) out.push({ source: n, target });
      }
    }
    return out;
  }, [nodes]);

  // D3 zoom/pan setup and expose controls to the Toolbar via useGraphStore
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom as any);

    const zoomIn = () => svg.transition().duration(200).call(zoom.scaleBy, 1.2);
    const zoomOut = () => svg.transition().duration(200).call(zoom.scaleBy, 0.8);
    const resetView = () => svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);

    setZoomFns({ zoomIn, zoomOut, resetView });

    // double-click to reset view
    svg.on("dblclick.zoom", null);
    svg.on("dblclick", () => resetView());

    return () => {
      setZoomFns({ zoomIn: null, zoomOut: null, resetView: null });
      svg.on(".zoom", null);
    };
  }, [setZoomFns]);

  return (
    <div className="relative h-full w-full">
      <svg ref={svgRef} className="h-full w-full bg-background">
        <g ref={gRef}>
          {/* Optional faint grid */}
          {Array.from({ length: 30 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 100}
              y1={0}
              x2={i * 100}
              y2={5000}
              stroke="currentColor"
              strokeOpacity={0.05}
            />
          ))}
          {Array.from({ length: 120 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * ROW_HEIGHT}
              x2={5000}
              y2={i * ROW_HEIGHT}
              stroke="currentColor"
              strokeOpacity={0.05}
            />
          ))}

          {/* Parent links */}
          {links.map((l, i) => (
            <line
              key={i}
              x1={l.source.x}
              y1={l.source.y}
              x2={l.target.x}
              y2={l.target.y}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeOpacity={0.35}
            />
          ))}

          {/* Commit nodes */}
          {nodes.map((n) => {
            const isSelected = selected?.hash === n.hash;
            return (
              <g
                key={n.hash}
                transform={`translate(${n.x},${n.y})`}
                className="cursor-pointer"
                onClick={() => selectCommit(n)}
              >
                <circle
                  r={isSelected ? 10 : 8}
                  className={
                    isSelected ? "fill-primary stroke-ring stroke-2" : "fill-primary stroke-border"
                  }
                >
                  <title>
                    {n.hash.slice(0, 7)} — {n.message}
                    {"\n"}by {n.authorName} on {new Date(n.authorDate).toLocaleString()}
                  </title>
                </circle>

                {/* Wrapped commit message to the right of the node */}
                <text x={16} y={4} className="text-xs fill-foreground select-none">
                  {wrapText(n.message, 50).map((line, i) => (
                    <tspan key={i} x={16} dy={i === 0 ? 0 : 14}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
