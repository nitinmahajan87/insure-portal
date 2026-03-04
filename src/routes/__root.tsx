import { createRootRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useAuthStore } from "@/store/authStore";
import { LoginPage } from "@/features/auth/LoginPage";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Select apiKey directly — more reliable than calling isAuthenticated() in a selector
  const apiKey = useAuthStore((s) => s.apiKey);

  if (!apiKey) {
    return <LoginPage />;
  }

  return <AppShell />;
}
