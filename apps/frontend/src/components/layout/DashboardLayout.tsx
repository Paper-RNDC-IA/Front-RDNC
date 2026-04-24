import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { ChatWidget } from '../chat/ChatWidget';

export function DashboardLayout(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fffcfa] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar open={isMenuOpen} onNavigate={() => setIsMenuOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopHeader onOpenMenu={() => setIsMenuOpen((prev) => !prev)} />
          <main className="relative flex-1 bg-[#fffdfb] px-4 py-5 sm:px-5 sm:py-7 md:px-10 md:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(249,115,22,0.05),transparent_30%)]" />
            <Outlet />
          </main>
          <ChatWidget />
        </div>
      </div>
    </div>
  );
}
