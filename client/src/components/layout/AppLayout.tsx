import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1120]">
      {/* Desktop sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Main content
          On mobile: pb-nav clears the fixed bottom nav + safe-area inset.
          On desktop (lg+): normal 8px bottom pad — no bottom nav present. */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full pb-nav lg:pb-8">
          <Outlet />
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
