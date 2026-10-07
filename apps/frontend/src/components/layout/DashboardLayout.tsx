import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export function DashboardLayout(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#101828]">
      <div className="flex min-h-screen">
        <Sidebar open={isMenuOpen} onNavigate={() => setIsMenuOpen(false)} />
        {isMenuOpen ? (
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          />
        ) : null}
        <div className="flex min-h-screen flex-1 flex-col">
          <TopHeader onOpenMenu={() => setIsMenuOpen((prev) => !prev)} />
          <main className="relative mx-auto w-full max-w-[1280px] flex-1 px-4 py-5 sm:px-5 sm:py-7 md:px-10 md:py-12">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
