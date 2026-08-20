'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Plus, FileSpreadsheet, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { rateCardsApi } from '@/lib/api/rateCards';
import { useAuth } from '@/providers/AuthProvider';
import RateCardTable from '@/components/rate-cards/RateCardTable';

export default function RateCardsPage() {
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const canManage = hasRole('ADMIN', 'ESTIMATION_LEAD');

  const [activeTab, setActiveTab] = useState<'manpower' | 'instruments' | 'hardware'>('manpower');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [role, setRole] = useState('');
  const [ratePerDay, setRatePerDay] = useState(5000);
  const [instrumentName, setInstrumentName] = useState('');
  const [rentalRatePerDay, setRentalRatePerDay] = useState(2500);
  const [hardwareName, setHardwareName] = useState('');
  const [unitCost, setUnitCost] = useState(1000);
  const [category, setCategory] = useState('General');

  // Queries
  const { data: manpower = [], isLoading: isLoadingManpower } = useQuery({
    queryKey: ['rate-cards-manpower'],
    queryFn: rateCardsApi.getManpower,
  });

  const { data: dbInstruments = [], isLoading: isLoadingInstruments } = useQuery({
    queryKey: ['rate-cards-instruments'],
    queryFn: rateCardsApi.getInstruments,
  });

  const { data: hardware = [], isLoading: isLoadingHardware } = useQuery({
    queryKey: ['rate-cards-hardware'],
    queryFn: rateCardsApi.getHardware,
  });

  // Filter out older instrument data and merge new 14 instruments
  const instruments = React.useMemo(() => {
    const OLD_INSTRUMENT_NAMES = [
      'e meter',
      'earth resistance tester (megger det4)',
      'insulation resistance tester 5kv',
      'power quality analyzer (fluke 435)',
      'thermal imaging camera (flir e8)',
    ];

    const DEFAULT_INSTRUMENT_RATES = [
      { id: 'inst-1', instrumentName: 'Power Logger', rentalRatePerDay: 3500 },
      { id: 'inst-2', instrumentName: 'Ultrasonic flow meter', rentalRatePerDay: 7000 },
      { id: 'inst-3', instrumentName: 'Aquastic Ultrasonic leakage detector', rentalRatePerDay: 4000 },
      { id: 'inst-4', instrumentName: 'Air Flow Meter', rentalRatePerDay: 4500 },
      { id: 'inst-5', instrumentName: 'Thermal Camera', rentalRatePerDay: 1000 },
      { id: 'inst-6', instrumentName: 'Digital Clamp Meter', rentalRatePerDay: 1000 },
      { id: 'inst-7', instrumentName: 'Earth Meggar', rentalRatePerDay: 1000 },
      { id: 'inst-8', instrumentName: 'Lux Meter', rentalRatePerDay: 500 },
      { id: 'inst-9', instrumentName: 'Thermometer', rentalRatePerDay: 500 },
      { id: 'inst-10', instrumentName: 'Temperature data logger', rentalRatePerDay: 500 },
      { id: 'inst-11', instrumentName: 'Anemometer', rentalRatePerDay: 500 },
      { id: 'inst-12', instrumentName: 'Differential Manometer', rentalRatePerDay: 1000 },
      { id: 'inst-13', instrumentName: 'Flue Gas analyser', rentalRatePerDay: 5000 },
      { id: 'inst-14', instrumentName: 'Others / Custom Instrument', rentalRatePerDay: 1000 },
    ];

    const cleanDbInstruments = dbInstruments.filter(
      (item) => !OLD_INSTRUMENT_NAMES.includes((item.instrumentName || '').toLowerCase().trim())
    );

    const combined = [...cleanDbInstruments];
    DEFAULT_INSTRUMENT_RATES.forEach((defInst) => {
      const exists = combined.some(
        (item) => item.instrumentName.toLowerCase().trim() === defInst.instrumentName.toLowerCase().trim()
      );
      if (!exists) {
        combined.push(defInst);
      }
    });

    return combined;
  }, [dbInstruments]);

  // Mutations
  const createManpowerMutation = useMutation({
    mutationFn: rateCardsApi.createManpower,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-cards-manpower'] });
      toast.success('Manpower rate added');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add manpower rate');
    },
  });

  const updateManpowerMutation = useMutation({
    mutationFn: (vars: { id: string; data: any }) => rateCardsApi.updateManpower(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-cards-manpower'] });
      toast.success('Manpower rate updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update manpower rate');
    },
  });

  const deleteManpowerMutation = useMutation({
    mutationFn: rateCardsApi.deleteManpower,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-cards-manpower'] });
      toast.success('Manpower rate deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete manpower rate');
    },
  });

  const createInstrumentMutation = useMutation({
    mutationFn: rateCardsApi.createInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-cards-instruments'] });
      toast.success('Instrument rate added');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add instrument rate');
    },
  });

  const updateInstrumentMutation = useMutation({
    mutationFn: (vars: { id: string; data: any }) => rateCardsApi.updateInstrument(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-cards-instruments'] });
      toast.success('Instrument rate updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update instrument rate');
    },
  });

  const deleteInstrumentMutation = useMutation({
    mutationFn: rateCardsApi.deleteInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-cards-instruments'] });
      toast.success('Instrument rate deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete instrument rate');
    },
  });

  const createHardwareMutation = useMutation({
    mutationFn: rateCardsApi.createHardware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-cards-hardware'] });
      toast.success('Hardware item added');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add hardware item');
    },
  });

  const updateHardwareMutation = useMutation({
    mutationFn: (vars: { id: string; data: any }) => rateCardsApi.updateHardware(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-cards-hardware'] });
      toast.success('Hardware item updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update hardware item');
    },
  });

  const deleteHardwareMutation = useMutation({
    mutationFn: rateCardsApi.deleteHardware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-cards-hardware'] });
      toast.success('Hardware item deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete hardware item');
    },
  });

  const closeModal = () => {
    setIsAddModalOpen(false);
    setRole('');
    setInstrumentName('');
    setHardwareName('');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'manpower') {
      createManpowerMutation.mutate({ role, ratePerDay });
    } else if (activeTab === 'instruments') {
      createInstrumentMutation.mutate({ instrumentName, rentalRatePerDay });
    } else {
      createHardwareMutation.mutate({ name: hardwareName, unitCost, category });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-indigo-600" /> Master Rate Cards Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain standard manpower daily rates, instrument rental fees, and hardware costs
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Rate Entry
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 w-fit">
        <button
          onClick={() => setActiveTab('manpower')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'manpower'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Manpower Daily Rates ({manpower.length})
        </button>
        <button
          onClick={() => setActiveTab('instruments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'instruments'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Instrument Rental Fees ({instruments.length})
        </button>
        <button
          onClick={() => setActiveTab('hardware')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hardware'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Hardware Costs ({hardware.length})
        </button>
      </div>

      {/* Table Display */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {activeTab === 'manpower' && (
          <RateCardTable
            data={manpower}
            columns={[
              { key: 'role', label: 'Role Title' },
              { key: 'ratePerDay', label: 'Rate / Day', isCurrency: true },
              { key: 'currency', label: 'Currency' },
            ]}
            onUpdate={async (id, data) => {
              await updateManpowerMutation.mutateAsync({ id, data });
            }}
            onDelete={async (id) => {
              await deleteManpowerMutation.mutateAsync(id);
            }}
            canManage={canManage}
          />
        )}

        {activeTab === 'instruments' && (
          <RateCardTable
            data={instruments}
            columns={[
              { key: 'instrumentName', label: 'Instrument Name' },
              { key: 'rentalRatePerDay', label: 'Rental Fee / Day', isCurrency: true },
            ]}
            onUpdate={async (id, data) => {
              await updateInstrumentMutation.mutateAsync({ id, data });
            }}
            onDelete={async (id) => {
              await deleteInstrumentMutation.mutateAsync(id);
            }}
            canManage={canManage}
          />
        )}

        {activeTab === 'hardware' && (
          <RateCardTable
            data={hardware}
            columns={[
              { key: 'name', label: 'Hardware Item Name' },
              { key: 'category', label: 'Category' },
              { key: 'unitCost', label: 'Unit Cost', isCurrency: true },
            ]}
            onUpdate={async (id, data) => {
              await updateHardwareMutation.mutateAsync({ id, data });
            }}
            onDelete={async (id) => {
              await deleteHardwareMutation.mutateAsync(id);
            }}
            canManage={canManage}
          />
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 capitalize">
              Add New {activeTab} Entry
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {activeTab === 'manpower' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title *</label>
                    <input
                      type="text"
                      list="rate-card-roles-list"
                      required
                      placeholder="e.g. Trainee Energy Engineer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                    <datalist id="rate-card-roles-list">
                      <option value="Senior Energy Engineer" />
                      <option value="Junior Energy Engineer" />
                      <option value="IoT Engineer" />
                      <option value="Trainee Energy Engineer" />
                      <option value="Energy Auditor" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Rate Per Day (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={ratePerDay}
                      onChange={(e) => setRatePerDay(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </>
              )}

              {activeTab === 'instruments' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Instrument Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Thermal Imaging Camera FLIR E8"
                      value={instrumentName}
                      onChange={(e) => setInstrumentName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Rental Rate Per Day (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={rentalRatePerDay}
                      onChange={(e) => setRentalRatePerDay(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </>
              )}

              {activeTab === 'hardware' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Item Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arc Flash PPE Kit"
                      value={hardwareName}
                      onChange={(e) => setHardwareName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Cost (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={unitCost}
                      onChange={(e) => setUnitCost(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
