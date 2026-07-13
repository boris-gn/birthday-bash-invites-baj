import { createFileRoute } from "@tanstack/react-router";
import { Invitation } from "@/components/Invitation";

export const Route = createFileRoute("/")({
  component: Invitation,
});
