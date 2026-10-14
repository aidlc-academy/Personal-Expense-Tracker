import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Wallet, BarChart3, User } from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Txns' },
  { to: '/budgets', icon: Wallet, label: 'Budgets' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-slate-800 bg-[#0d1526]/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Mobile navigation"
    >
      <ul className="flex h-16" role="list">
        {navItems.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex h-full w-full flex-col items-center justify-center gap-0.5',
                  'text-[11px] font-medium transition-colors duration-150',
                  isActive ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150',
                    isActive ? 'bg-emerald-500/15 text-emerald-400' : '',
                  )}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
