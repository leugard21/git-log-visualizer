/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function CommitGraph() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    svg.on(".zoom", null);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event: any) => {
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom as any);

    svg.on("dblclick.zoom", null);
    svg.on("dblclick", () => {
      svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    });
  }, []);

  return (
    <div className="relative h-full w-full">
      <svg ref={svgRef} className="h-full w-full bg-background">
        <g ref={gRef}>
          {/* placeholder grid */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 40}
              y1={0}
              x2={i * 40}
              y2={800}
              stroke="currentColor"
              strokeOpacity={0.1}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * 40}
              x2={800}
              y2={i * 40}
              stroke="currentColor"
              strokeOpacity={0.1}
            />
          ))}

          <text x={20} y={30} className="fill-muted-foreground text-sm select-none">
            Commit Graph Placeholder
          </text>
        </g>
      </svg>
    </div>
  );
}
