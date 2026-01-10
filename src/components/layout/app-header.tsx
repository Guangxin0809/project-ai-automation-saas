import { SidebarTrigger } from "@/components/ui/sidebar";

export const AppHeader = () => (
  <header className="flex items-center gap-x-2 shrink-0 h-14 px-4 border-b bg-background">
    <SidebarTrigger />
  </header>
);
