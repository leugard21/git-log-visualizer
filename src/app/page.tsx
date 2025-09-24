import { AppShell } from "@/components/app-shell";
import { CommitGraph } from "@/components/commit-graph";

export default function Page() {
  return (
    <AppShell>
      <CommitGraph />
    </AppShell>
  );
}
