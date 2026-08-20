'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Shield } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-xs sticky top-0 z-30 print:hidden">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-[#0D1B3C] tracking-tight">
          Costing & Proposal Automation
        </h2>
        {user?.role && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#0D1B3C]/5 text-[#0D1B3C] border border-[#0D1B3C]/10">
            <Shield className="h-3.5 w-3.5 text-[#3BD98E]" />
            {user.role.replace('_', ' ')}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/quotes/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#0D1B3C] bg-[#3BD98E] hover:bg-[#3BD98E]/90 rounded-xl shadow-md transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Create Quote</span>
        </Link>
      </div>
    </header>
  );
}
