
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />

      <main className="min-h-screen min-w-0 lg:pl-56">
        {children}
      </main>
    </div>
  );
}
