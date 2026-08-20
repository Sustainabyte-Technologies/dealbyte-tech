'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowRight, Lock, Mail, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@dealbyte.com',
      password: 'admin123',
    },
  });

  const onSubmit = async (data: LoginInputs) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back to DealByte!');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setQuickUser = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
  };

  return (
    <div className="min-h-screen bg-[#0D1B3C] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3BD98E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-4">
          <div className="h-16 px-4 rounded-2xl bg-white p-2 flex items-center justify-center shadow-xl shadow-[#3BD98E]/20">
            <Image
              src="/dealbyte-horizontal-logo.png"
              alt="DealByte Logo"
              width={180}
              height={56}
              className="object-contain max-h-full w-auto"
            />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-white tracking-tight">
          DealByte Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-300">
          Costing & Proposal Automation System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#071026]/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-semibold text-slate-200">Email Address</label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#0D1B3C]/70 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#3BD98E] focus:border-transparent transition-all"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">Password</label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#0D1B3C]/70 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#3BD98E] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-[#3BD98E]/20 text-sm font-bold text-[#0D1B3C] bg-[#3BD98E] hover:bg-[#3BD98E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3BD98E] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-[#0D1B3C] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs font-semibold text-[#3BD98E] uppercase tracking-wider mb-3 text-center">
              Quick Login Roles (Demo)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setQuickUser('admin@dealbyte.com', 'admin123')}
                type="button"
                className="px-3 py-2 bg-[#0D1B3C] hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 text-left transition-colors font-medium"
              >
                👑 Admin
              </button>
              <button
                onClick={() => setQuickUser('sales@dealbyte.com', 'password123')}
                type="button"
                className="px-3 py-2 bg-[#0D1B3C] hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 text-left transition-colors font-medium"
              >
                💼 Sales Exec
              </button>
              <button
                onClick={() => setQuickUser('manager@dealbyte.com', 'password123')}
                type="button"
                className="px-3 py-2 bg-[#0D1B3C] hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 text-left transition-colors font-medium"
              >
                🛡️ Manager
              </button>
              <button
                onClick={() => setQuickUser('estimation@dealbyte.com', 'password123')}
                type="button"
                className="px-3 py-2 bg-[#0D1B3C] hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 text-left transition-colors font-medium"
              >
                📊 Estimation Lead
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
