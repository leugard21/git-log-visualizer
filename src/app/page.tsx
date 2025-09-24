import { AppShell } from "@/components/app-shell";
import CommitDetails from "@/components/commit-details";
import { CommitGraph } from "@/components/commit-graph";

export default function Page() {
  return (
    <AppShell>
      <div className="h-full">
        <CommitGraph />
      </div>

      <div className="hidden" />
      <div className="hidden" />

      <div className="hidden">
        <CommitDetails />
      </div>
    </AppShell>
  );
}
