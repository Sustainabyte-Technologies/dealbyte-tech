'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { proposalsApi, ProposalStatus } from '@/lib/api/proposals';
import ProposalPreview from '@/components/proposals/ProposalPreview';

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: proposal, isLoading, error } = useQuery({
    queryKey: ['proposal', id],
    queryFn: () => proposalsApi.getOne(id),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: ProposalStatus) => proposalsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal', id] });
      toast.success('Proposal status updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update proposal status');
    },
  });

  if (isLoading) {
    return <div className="p-12 text-center text-slate-400">Loading proposal document...</div>;
  }

  if (error || !proposal) {
    return (
      <div className="bg-rose-50 p-8 rounded-2xl border border-rose-200 text-center max-w-md mx-auto my-12">
        <h3 className="font-bold text-rose-900">Proposal Document Not Found</h3>
        <button
          onClick={() => router.push('/proposals')}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Proposals
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Proposals
        </button>
      </div>

      <ProposalPreview
        proposal={proposal}
        onUpdateStatus={(status) => updateStatusMutation.mutate(status)}
        isUpdating={updateStatusMutation.isPending}
      />
    </div>
  );
}
