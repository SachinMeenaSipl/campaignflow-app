import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
};

const toneMap: Record<string, "default" | "success" | "warning" | "danger"> = {
  completed: "success",
  sent: "success",
  active: "success",
  sending: "warning",
  scheduled: "default",
  queued: "default",
  draft: "warning",
  failed: "danger",
  unsubscribed: "danger"
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge tone={toneMap[status] ?? "default"}>{status}</Badge>;
}
