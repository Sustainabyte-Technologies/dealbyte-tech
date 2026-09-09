'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import {
  FileSpreadsheet,
  FileText,
  Building,
  User,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Edit3,
} from 'lucide-react';
import { toast } from 'sonner';
import { quotesApi } from '@/lib/api/quotes';
import { proposalsApi } from '@/lib/api/proposals';
import QuoteSummaryCard from '@/components/quotes/QuoteSummaryCard';
import ApprovalBanner from '@/components/quotes/ApprovalBanner';
import NegotiationPanel from '@/components/quotes/NegotiationPanel';
import { formatCurrency, formatDate } from '@/lib/utils';
import FullPageWatermark from '@/components/common/FullPageWatermark';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: quote, isLoading, error, refetch } = useQuery({
    queryKey: ['quote', id],
    queryFn: () => quotesApi.getOne(id),
  });

  const submitApprovalMutation = useMutation({
    mutationFn: () => quotesApi.submitForApproval(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote', id] });
      toast.success('Quote submitted for Manager approval!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit for approval');
    },
  });

  const negotiateMutation = useMutation({
    mutationFn: (marginPct: number) => quotesApi.negotiate(id, marginPct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote', id] });
      toast.success('Negotiation margin applied successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to negotiate quote');
    },
  });

  const generateProposalMutation = useMutation({
    mutationFn: () => proposalsApi.generate(id),
    onSuccess: (proposal) => {
      toast.success('Proposal document generated!');
      router.push(`/proposals/${proposal.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to generate proposal');
    },
  });

  if (isLoading) {
    return <div className="p-12 text-center text-slate-400">Loading quote details...</div>;
  }

  if (error || !quote) {
    return (
      <div className="bg-rose-50 p-8 rounded-2xl border border-rose-200 text-center max-w-md mx-auto my-12">
        <h3 className="font-bold text-rose-900">Quote Not Found</h3>
        <p className="text-xs text-rose-600 mt-1">The requested quote does not exist or has been deleted.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const subtotal = Number(quote.subtotal);
  const marginAmount = Number(quote.marginAmount);
  const bufferAmount = Number(quote.bufferAmount);
  const finalQuote = Number(quote.finalQuote);

  return (
    <div className="relative space-y-8 min-h-screen">
      {/* Full Page Branded Background Watermark */}
      <FullPageWatermark opacity={0.08} size="750px" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Quote for {quote.deal?.clientName || 'Client'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Service: <span className="font-semibold text-slate-700">{quote.service?.name}</span> • Created{' '}
            {formatDate(quote.createdAt)} by {quote.createdBy?.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/quotes/new?editQuoteId=${quote.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-indigo-700 font-extrabold text-xs rounded-xl shadow-xs border border-indigo-200 transition-colors cursor-pointer"
          >
            <Edit3 className="h-4 w-4 text-indigo-600" />
            Edit Quote
          </button>
          {(quote as any).proposals && (quote as any).proposals.length > 0 ? (
            <button
              onClick={() => router.push(`/proposals/${(quote as any).proposals[0].id}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              View Proposal Document
            </button>
          ) : (
            <button
              onClick={() => generateProposalMutation.mutate()}
              disabled={generateProposalMutation.isPending || quote.status === 'REJECTED'}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              {generateProposalMutation.isPending ? 'Generating Proposal...' : 'Generate Proposal Document'}
            </button>
          )}
        </div>
      </div>

      {/* Approval Status Banner */}
      <ApprovalBanner
        status={quote.status}
        approvalRequests={quote.approvalRequests}
        onSubmitApproval={() => submitApprovalMutation.mutate()}
        isSubmitting={submitApprovalMutation.isPending}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Line Items & Negotiation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Details Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400">Site Duration</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{quote.siteDays} Days</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Reporting Duration</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{quote.reportDays} Days</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Margin Applied</p>
              <p className="text-sm font-bold text-emerald-600 mt-1">{quote.marginPct}%</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Quote Buffer</p>
              <p className="text-sm font-bold text-indigo-600 mt-1">{quote.bufferPct}%</p>
            </div>
          </div>

          {/* Line Items Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 px-6 border-b border-slate-100 font-bold text-slate-900 text-sm">
              Detailed Line-Item Breakdown
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Description</th>
                  <th className="py-3 px-6 text-center">Qty / Days</th>
                  <th className="py-3 px-6 text-right">Unit Rate</th>
                  <th className="py-3 px-6 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {quote.lineItems?.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-6 font-semibold">
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-900">{item.description}</td>
                    <td className="py-3.5 px-6 text-center font-semibold">{item.qty}</td>
                    <td className="py-3.5 px-6 text-right">{formatCurrency(item.unitRate)}</td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Negotiation Panel */}
          <NegotiationPanel
            quoteId={quote.id}
            currentMarginPct={Number(quote.marginPct)}
            subtotal={subtotal}
            bufferPct={Number(quote.bufferPct)}
            onNegotiate={async (margin) => {
              await negotiateMutation.mutateAsync(margin);
            }}
            isSubmitting={negotiateMutation.isPending}
          />
        </div>

        {/* Right Column: Quote Summary Card */}
        <div>
          <QuoteSummaryCard
            manpowerCost={Number(quote.manpowerCost)}
            instrumentCost={Number(quote.instrumentCost)}
            foodTravelCost={Number(quote.foodTravelCost)}
            subtotal={subtotal}
            marginPct={Number(quote.marginPct)}
            marginAmount={marginAmount}
            bufferPct={Number(quote.bufferPct)}
            bufferAmount={bufferAmount}
            finalQuote={finalQuote}
            status={quote.status}
          />
        </div>
      </div>
    </div>
    </div>
  );
}
