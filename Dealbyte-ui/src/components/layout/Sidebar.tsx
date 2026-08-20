'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Calculator,
  FileSpreadsheet,
  CheckCircle2,
  FileText,
  CreditCard,
  History,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, hasRole } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'ESTIMATION_LEAD', 'SALES_EXECUTIVE', 'MANAGER'],
    },
    {
      name: 'Services & Projects',
      href: '/services',
      icon: Briefcase,
      roles: ['ADMIN', 'ESTIMATION_LEAD', 'SALES_EXECUTIVE', 'MANAGER'],
    },
    {
      name: 'Costing Sheet',
      href: '/costing-sheet',
      icon: Calculator,
      roles: ['ADMIN', 'ESTIMATION_LEAD', 'SALES_EXECUTIVE', 'MANAGER'],
    },
    {
      name: 'Create Quote',
      href: '/quotes/new',
      icon: FileSpreadsheet,
      roles: ['ADMIN', 'ESTIMATION_LEAD', 'SALES_EXECUTIVE'],
      badge: 'Build',
    },
    {
      name: 'Approvals',
      href: '/approvals',
      icon: CheckCircle2,
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      name: 'Proposals',
      href: '/proposals',
      icon: FileText,
      roles: ['ADMIN', 'ESTIMATION_LEAD', 'SALES_EXECUTIVE', 'MANAGER'],
    },
    {
      name: 'Rate Cards',
      href: '/rate-cards',
      icon: CreditCard,
      roles: ['ADMIN', 'ESTIMATION_LEAD'],
    },
    {
      name: 'Audit Logs',
      href: '/audit-logs',
      icon: History,
      roles: ['ADMIN', 'ESTIMATION_LEAD', 'SALES_EXECUTIVE', 'MANAGER'],
    },
    {
      name: 'Roles & Members',
      href: '/users',
      icon: Users,
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['ADMIN'],
    },
  ];

  return (
    <aside className="w-60 bg-[#0D1B3C] text-slate-100 flex flex-col shrink-0 border-r border-slate-800 shadow-2xl print:hidden">
      {/* Brand Header — Clean Horizontal Logo Card */}
      <div className="p-5 pb-3 border-b border-slate-700/80 bg-[#0D1B3C]">
        <div className="bg-[#0d1c3d] border border-slate-700/60 py-2 px-3.5 rounded-xl shadow-inner flex items-center justify-center h-16 mx-1.5 overflow-hidden">
          <Image
            src="/Company-Logo-3-1.png"
            alt="Company Logo"
            width={200}
            height={70}
            className="object-contain max-h-12 w-auto"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          if (!item.roles.some((r) => hasRole(r as any))) return null;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-slate-400')} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      {user && (
        <div className="p-4 border-t border-slate-800/80 bg-[#071026]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-100 truncate">{user.name}</p>
                <p className="text-xs text-blue-400 font-medium truncate capitalize">
                  {user.role.toLowerCase().replace('_', ' ')}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
