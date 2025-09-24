"use client";

export default function CommitGraph() {
  return (
    <div className="h-full w-full relative">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
        {Array.from({ length: 1244 }).map((_, i) => (
          <div className="border border-dashed" key={i} />
        ))}
        <div className="p-4 text-sm text-muted-foreground">Commit graph placeholder</div>
      </div>
    </div>
  );
}
