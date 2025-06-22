import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <div className="flex h-screen bg-lightBg text-textMain">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen((o) => !o)}
        user={session?.user}
        roles={(session?.user as any)?.roles || []}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen((o) => !o)} user={session?.user} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
