import Sidebar from "@/components/Sidebar";

// Layout for the authenticated app surface — sidebar + scrollable main area.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-ink-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full min-w-0">{children}</main>
    </div>
  );
}
