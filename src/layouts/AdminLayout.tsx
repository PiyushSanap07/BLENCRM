import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCheck, Kanban, CheckSquare,
  Calendar, FileText, CreditCard, FileCheck,
  BarChart3, Users2, Settings, Menu, X, Search,
  Sun, Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads Management', path: '/dashboard/leads', icon: Users },
  { name: 'Clients Directory', path: '/dashboard/clients', icon: UserCheck },
  { name: 'Sales Pipeline', path: '/dashboard/pipeline', icon: Kanban },
  { name: 'Tasks & Activities', path: '/dashboard/activities', icon: CheckSquare },
  { name: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
  { name: 'Invoices', path: '/dashboard/invoices', icon: FileText },
  { name: 'Payments', path: '/dashboard/payments', icon: CreditCard },
  { name: 'Estimates', path: '/dashboard/estimates', icon: FileCheck },
  { name: 'Reports', path: '/dashboard/reports', icon: BarChart3 },
  { name: 'Team', path: '/dashboard/team', icon: Users2 },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex text-slate-800 dark:text-slate-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
        
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {/* blenDigital actual logo */}
            <img
              src="/image.png"
              alt="blenDigital Logo"
              className="w-9 h-9 object-contain rounded-lg"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white">
                BLENDIGITAL
              </span>
              <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mt-0.5">CRM</span>
            </div>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                style={isActive ? { background: 'linear-gradient(135deg, #00C9A7, #22C55E)' } : {}}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #00C9A7, #22C55E)' }}
          >
            D
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">Dheeraj Sir</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Admin Account</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients, invoices, leads..."
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-900 border-none focus:ring-2 outline-none"
                style={{ '--tw-ring-color': '#00C9A7' } as React.CSSProperties}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};