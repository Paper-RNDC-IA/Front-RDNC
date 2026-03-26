import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { ChatWidget } from '../chat/ChatWidget';

export function DashboardLayout(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar open={isMenuOpen} onNavigate={() => setIsMenuOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopHeader onOpenMenu={() => setIsMenuOpen((prev) => !prev)} />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </main>
          <ChatWidget />
        </div>
      </div>
    </div>
  );
}
