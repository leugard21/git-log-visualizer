"use client";

import { Sidebar } from "./sidebar";
import Toolbar from "./toolbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-rows-[auto_1fr] h-dvh">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <h1 className="text-lg font-semibold">Git Log Visualizer</h1>
        <Toolbar />
      </header>

      <div className="grid grid-cols-[280px_1fr_360px] gap-0 h-full">
        <aside className="border-r overflow-y-auto">
          <Sidebar />
        </aside>

        <main className="overflow-hidden">{children}</main>

        <aside className="border-l overflow-y-auto"></aside>
      </div>
    </div>
  );
}
