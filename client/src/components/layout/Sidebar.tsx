import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  User,
  LogOut,
  IndianRupee,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../stores/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/budgets', icon: Wallet, label: 'Budgets' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/profile', icon: User, label: 'Profile' },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800',
        className,
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-900/50">
          <IndianRupee size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-bold tracking-wider text-white">MONETRA</p>
          <p className="text-[10px] text-slate-500 tracking-wide">Personal Finance</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Navigation
        </p>
        <ul className="flex flex-col gap-0.5" role="list">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 border',
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-transparent',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={17}
                      aria-hidden="true"
                      className={cn('shrink-0', isActive ? 'text-emerald-400' : 'text-slate-500')}
                    />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-slate-800 px-3 py-4 space-y-1">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-slate-800/60">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-sm font-bold text-white">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-200">{user?.name}</p>
            <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-150"
        >
          <LogOut size={16} aria-hidden="true" className="shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
