/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { useCommitStore } from "@/store/useCommitStore";
import { useGraphStore } from "@/store/useGraphStore";

const ROW_HEIGHT = 50;
const COL_X = 200;

function wrapText(text: string, charPerLine = 50): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).length > charPerLine) {
      lines.push(current.trim());
      current = w;
    } else {
      current += " " + w;
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

export function CommitGraph() {
  const commits = useCommitStore((s) => s.commits);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const setZoomFns = useGraphStore((s) => s.setZoomFns);

  const nodes = useMemo(() => {
    return commits.map((c, i) => ({
      ...c,
      x: COL_X,
      y: i * ROW_HEIGHT + 40,
    }));
  }, [commits]);

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

    return () => setZoomFns({ zoomIn: null, zoomOut: null, resetView: null });
  }, [setZoomFns]);

  return (
    <div className="relative h-full w-full">
      <svg ref={svgRef} className="h-full w-full bg-background">
        <g ref={gRef}>
          {links.map((l, i) => (
            <line
              key={i}
              x1={l.source.x}
              y1={l.source.y}
              x2={l.target.x}
              y2={l.target.y}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeOpacity={0.4}
            />
          ))}

          {nodes.map((n) => (
            <g key={n.hash} transform={`translate(${n.x},${n.y})`}>
              <circle r={8} className="fill-primary stroke-border">
                <title>
                  {n.hash.slice(0, 7)} — {n.message}
                  {"\n"}by {n.authorName} on {new Date(n.authorDate).toLocaleString()}
                </title>
              </circle>
              <text x={16} y={4} className="text-xs fill-foreground select-none">
                {wrapText(n.message, 50).map((line, i) => (
                  <tspan key={i} x={16} dy={i === 0 ? 0 : 14}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
