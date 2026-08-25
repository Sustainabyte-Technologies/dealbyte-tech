'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Plus, FileSpreadsheet, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { rateCardsApi } from '@/lib/api/rateCards';
import { useAuth } from '@/providers/AuthProvider';
import RateCardTable from '@/components/rate-cards/RateCardTable';

import {
  PRESET_TEAM_MEMBERS,
  STANDARD_EMS_GATEWAY_HARDWARE_CATALOG,
  STANDARD_EMS_ELECTRICAL_HARDWARE_CATALOG,
} from '@/components/costing/constants';

export default function RateCardsPage() {
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const canManage = hasRole('ADMIN', 'ESTIMATION_LEAD');

  const [activeTab, setActiveTab] = useState<'manpower' | 'instruments' | 'hardware'>('manpower');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [memberName, setMemberName] = useState('');
  const [role, setRole] = useState('Senior Energy Engineer');
  const [roleLevel, setRoleLevel] = useState<'SENIOR_ENERGY' | 'JUNIOR_ENERGY' | 'IOT_ENGINEER' | 'TRAINEE_ENERGY' | 'CUSTOM'>('SENIOR_ENERGY');
  const [siteWorkCost, setSiteWorkCost] = useState(6000);
  const [reportWorkCost, setReportWorkCost] = useState(4200);
  const [foodRatePerDay, setFoodRatePerDay] = useState(600);
  const [instrumentName, setInstrumentName] = useState('');
  const [rentalRatePerDay, setRentalRatePerDay] = useState(2500);
  const [hardwareName, setHardwareName] = useState('');
  const [unitCost, setUnitCost] = useState(1000);
  const [category, setCategory] = useState('1. Sustainabyte Edge IoT Gateway Hardware');
  const [uom, setUom] = useState('Nos');

  // Custom added team members from local storage or memory
  const [customTeamMembers, setCustomTeamMembers] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dealbyte_custom_team_members');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Custom added hardware items from local storage or memory
  const [customHardwareList, setCustomHardwareList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dealbyte_custom_hardware_items');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Queries
  const { data: dbManpower = [], isLoading: isLoadingManpower } = useQuery({
    queryKey: ['rate-cards-manpower'],
    queryFn: rateCardsApi.getManpower,
  });

  const { data: dbInstruments = [], isLoading: isLoadingInstruments } = useQuery({
    queryKey: ['rate-cards-instruments'],
    queryFn: rateCardsApi.getInstruments,
  });

  const { data: dbHardware = [], isLoading: isLoadingHardware } = useQuery({
    queryKey: ['rate-cards-hardware'],
    queryFn: rateCardsApi.getHardware,
  });

  // Map dynamic team members from PRESET_TEAM_MEMBERS + custom added members
  const manpowerList = React.useMemo(() => {
    const baseList = PRESET_TEAM_MEMBERS.map((m, idx) => ({
      id: `mp-preset-${idx}`,
      name: m.name,
      role: m.roleTitle,
      roleLevel: m.roleLevel,
      siteWorkCost: m.siteWorkCost,
      reportWorkCost: m.reportWorkCost,
      foodRatePerDay: m.foodRatePerDay,
      currency: 'INR',
    }));

    return [...baseList, ...customTeamMembers];
  }, [customTeamMembers]);

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

  // Map hardware catalog items + custom added hardware items
  const hardwareList = React.useMemo(() => {
    const catalog = [
      ...STANDARD_EMS_GATEWAY_HARDWARE_CATALOG.filter((h) => h.unitCost > 0).map((h, i) => ({
        id: `gw-preset-${i}`,
        name: h.description,
        category: '1. Sustainabyte Edge IoT Gateway Hardware',
        uom: h.uom,
        unitCost: h.unitCost,
      })),
      ...STANDARD_EMS_ELECTRICAL_HARDWARE_CATALOG.filter((h) => h.unitCost > 0).map((h, i) => ({
        id: `el-preset-${i}`,
        name: h.description,
        category: '2. Electrical Hardware & Accessories',
        uom: h.uom,
        unitCost: h.unitCost,
      })),
      ...customHardwareList,
    ];
    return catalog;
  }, [customHardwareList]);

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
    setMemberName('');
    setRole('Senior Energy Engineer');
    setRoleLevel('SENIOR_ENERGY');
    setSiteWorkCost(6000);
    setReportWorkCost(4200);
    setFoodRatePerDay(600);
    setInstrumentName('');
    setHardwareName('');
    setCategory('1. Sustainabyte Edge IoT Gateway Hardware');
    setUom('Nos');
    setUnitCost(1000);
  };

  const handleRoleLevelSelect = (lvl: string) => {
    if (lvl === 'SENIOR_ENERGY') {
      setRoleLevel('SENIOR_ENERGY');
      setRole('Senior Energy Engineer');
      setSiteWorkCost(6000);
      setReportWorkCost(4200);
      setFoodRatePerDay(600);
    } else if (lvl === 'JUNIOR_ENERGY') {
      setRoleLevel('JUNIOR_ENERGY');
      setRole('Junior Energy Engineer');
      setSiteWorkCost(3000);
      setReportWorkCost(2300);
      setFoodRatePerDay(400);
    } else if (lvl === 'ENERGY_AUDITOR') {
      setRoleLevel('SENIOR_ENERGY');
      setRole('Energy Auditor');
      setSiteWorkCost(10000);
      setReportWorkCost(5000);
      setFoodRatePerDay(600);
    } else if (lvl === 'IOT_ENGINEER') {
      setRoleLevel('IOT_ENGINEER');
      setRole('IoT Engineer');
      setSiteWorkCost(3500);
      setReportWorkCost(0);
      setFoodRatePerDay(400);
    } else if (lvl === 'TRAINEE_ENERGY') {
      setRoleLevel('TRAINEE_ENERGY');
      setRole('Trainee Energy Engineer');
      setSiteWorkCost(2000);
      setReportWorkCost(0);
      setFoodRatePerDay(300);
    } else {
      setRoleLevel('CUSTOM');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'manpower') {
      const newMember = {
        id: `mp-custom-${Date.now()}`,
        name: memberName.trim() || 'New Team Member',
        role: role.trim() || 'Energy Engineer',
        roleLevel,
        siteWorkCost: Number(siteWorkCost) || 0,
        reportWorkCost: Number(reportWorkCost) || 0,
        foodRatePerDay: Number(foodRatePerDay) || 0,
        currency: 'INR',
      };

      const updated = [...customTeamMembers, newMember];
      setCustomTeamMembers(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dealbyte_custom_team_members', JSON.stringify(updated));
      }

      // Persist to DB rate cards
      createManpowerMutation.mutate({
        role: `${newMember.name} (${newMember.role})`,
        ratePerDay: newMember.siteWorkCost,
      });

      toast.success(`Added ${newMember.name} (${newMember.role})`);
      closeModal();
    } else if (activeTab === 'instruments') {
      createInstrumentMutation.mutate({ instrumentName, rentalRatePerDay });
    } else {
      const newHardware = {
        id: `hw-custom-${Date.now()}`,
        name: hardwareName.trim() || 'New Hardware Item',
        category: category.trim() || '1. Sustainabyte Edge IoT Gateway Hardware',
        uom: uom.trim() || 'Nos',
        unitCost: Number(unitCost) || 0,
      };

      const updated = [...customHardwareList, newHardware];
      setCustomHardwareList(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dealbyte_custom_hardware_items', JSON.stringify(updated));
      }

      createHardwareMutation.mutate({
        name: `${newHardware.name} [${newHardware.uom}]`,
        unitCost: newHardware.unitCost,
        category: newHardware.category,
      });

      toast.success(`Added ${newHardware.name} (${newHardware.uom} - ₹${newHardware.unitCost.toLocaleString()})`);
      closeModal();
    }
  };

  const handleUpdateManpower = async (id: string, updatedFields: Record<string, any>) => {
    if (id.startsWith('mp-preset-')) {
      const idx = parseInt(id.replace('mp-preset-', ''), 10);
      const target = PRESET_TEAM_MEMBERS[idx];
      if (target) {
        if (updatedFields.name !== undefined) target.name = updatedFields.name;
        if (updatedFields.role !== undefined) target.roleTitle = updatedFields.role;
        if (updatedFields.siteWorkCost !== undefined) target.siteWorkCost = Number(updatedFields.siteWorkCost);
        if (updatedFields.reportWorkCost !== undefined) target.reportWorkCost = Number(updatedFields.reportWorkCost);
        if (updatedFields.foodRatePerDay !== undefined) target.foodRatePerDay = Number(updatedFields.foodRatePerDay);
      }
      toast.success('Team member rate updated');
      queryClient.invalidateQueries({ queryKey: ['rate-cards-manpower'] });
    } else {
      const updated = customTeamMembers.map((m) => (m.id === id ? { ...m, ...updatedFields } : m));
      setCustomTeamMembers(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dealbyte_custom_team_members', JSON.stringify(updated));
      }
      toast.success('Team member rate updated');
    }
  };

  const handleDeleteManpower = async (id: string) => {
    const updated = customTeamMembers.filter((m) => m.id !== id);
    setCustomTeamMembers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dealbyte_custom_team_members', JSON.stringify(updated));
    }
    toast.success('Team member rate deleted');
  };

  const handleUpdateHardware = async (id: string, updatedFields: Record<string, any>) => {
    if (id.startsWith('gw-preset-')) {
      const idx = parseInt(id.replace('gw-preset-', ''), 10);
      const target = STANDARD_EMS_GATEWAY_HARDWARE_CATALOG[idx];
      if (target) {
        if (updatedFields.name !== undefined) target.description = updatedFields.name;
        if (updatedFields.uom !== undefined) target.uom = updatedFields.uom;
        if (updatedFields.unitCost !== undefined) target.unitCost = Number(updatedFields.unitCost);
      }
      toast.success('Hardware item updated');
      queryClient.invalidateQueries({ queryKey: ['rate-cards-hardware'] });
    } else if (id.startsWith('el-preset-')) {
      const idx = parseInt(id.replace('el-preset-', ''), 10);
      const target = STANDARD_EMS_ELECTRICAL_HARDWARE_CATALOG[idx];
      if (target) {
        if (updatedFields.name !== undefined) target.description = updatedFields.name;
        if (updatedFields.uom !== undefined) target.uom = updatedFields.uom;
        if (updatedFields.unitCost !== undefined) target.unitCost = Number(updatedFields.unitCost);
      }
      toast.success('Hardware item updated');
      queryClient.invalidateQueries({ queryKey: ['rate-cards-hardware'] });
    } else {
      const updated = customHardwareList.map((h) => (h.id === id ? { ...h, ...updatedFields } : h));
      setCustomHardwareList(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dealbyte_custom_hardware_items', JSON.stringify(updated));
      }
      toast.success('Hardware item updated');
    }
  };

  const handleDeleteHardware = async (id: string) => {
    const updated = customHardwareList.filter((h) => h.id !== id);
    setCustomHardwareList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dealbyte_custom_hardware_items', JSON.stringify(updated));
    }
    toast.success('Hardware item deleted');
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
          Manpower Roles &amp; Daily Rates ({manpowerList.length})
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
          Hardware &amp; Equipment Costs ({hardwareList.length})
        </button>
      </div>

      {/* Table Display */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {activeTab === 'manpower' && (
          <RateCardTable
            data={manpowerList}
            columns={[
              { key: 'name', label: 'Team Member' },
              { key: 'role', label: 'Role Title' },
              { key: 'siteWorkCost', label: 'Site Work Cost (₹/Day)', isCurrency: true },
              { key: 'reportWorkCost', label: 'Report Work Cost (₹/Day)', isCurrency: true },
              { key: 'foodRatePerDay', label: 'Food Cost (₹/Day)', isCurrency: true },
              { key: 'currency', label: 'Currency' },
            ]}
            onUpdate={handleUpdateManpower}
            onDelete={handleDeleteManpower}
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
            data={hardwareList}
            columns={[
              { key: 'name', label: 'Hardware Item Description' },
              { key: 'category', label: 'Category' },
              { key: 'uom', label: 'Unit (UoM)' },
              { key: 'unitCost', label: 'Unit Cost', isCurrency: true },
            ]}
            onUpdate={handleUpdateHardware}
            onDelete={handleDeleteHardware}
            canManage={canManage}
          />
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 capitalize">
              {activeTab === 'manpower'
                ? 'Add New Team Member & Role'
                : activeTab === 'hardware'
                ? 'Add New Hardware & Equipment Entry'
                : 'Add New Instrument Rental Entry'}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {activeTab === 'manpower' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Team Member Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Enter Name"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Role Preset Level</label>
                    <select
                      onChange={(e) => handleRoleLevelSelect(e.target.value)}
                      defaultValue="SENIOR_ENERGY"
                      className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-indigo-500 cursor-pointer shadow-2xs"
                    >
                      <option value="SENIOR_ENERGY">Senior Energy Engineer (₹6,000 Site / ₹4,200 Report / ₹600 Food)</option>
                      <option value="ENERGY_AUDITOR">Energy Auditor (₹10,000 Site / ₹5,000 Report / ₹600 Food)</option>
                      <option value="JUNIOR_ENERGY">Junior Energy Engineer (₹3,000 Site / ₹2,300 Report / ₹400 Food)</option>
                      <option value="IOT_ENGINEER">IoT Engineer (₹3,500 Site / ₹0 Report / ₹400 Food)</option>
                      <option value="TRAINEE_ENERGY">Trainee Energy Engineer (₹2,000 Site / ₹0 Report / ₹300 Food)</option>
                      <option value="CUSTOM">✨ Custom Role &amp; Rates</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Role Title / Designation *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Energy Engineer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Site Work (₹/d) *</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={siteWorkCost}
                        onChange={(e) => setSiteWorkCost(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Report (₹/d)</label>
                      <input
                        type="number"
                        min={0}
                        value={reportWorkCost}
                        onChange={(e) => setReportWorkCost(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Food Cost (₹/d)</label>
                      <input
                        type="number"
                        min={0}
                        value={foodRatePerDay}
                        onChange={(e) => setFoodRatePerDay(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                </div>
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
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hardware Item Description *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna..."
                      value={hardwareName}
                      onChange={(e) => setHardwareName(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-indigo-500 cursor-pointer shadow-2xs"
                    >
                      <option value="1. Sustainabyte Edge IoT Gateway Hardware">1. Sustainabyte Edge IoT Gateway Hardware</option>
                      <option value="2. Electrical Hardware & Accessories">2. Electrical Hardware & Accessories</option>
                      <option value="General Hardware & Consumables">General Hardware &amp; Consumables</option>
                      <option value="Sensors & Transmitters">Sensors &amp; Transmitters</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Unit (UoM) *</label>
                      <select
                        value={uom}
                        onChange={(e) => setUom(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-indigo-500 cursor-pointer shadow-2xs"
                      >
                        <option value="Nos">Nos (Numbers / Pieces)</option>
                        <option value="Set">Set (Mating Flanges, Nut Bolts &amp; Gaskets)</option>
                        <option value="Coil">Coil (Cable Coils)</option>
                        <option value="Mtr">Mtr (Meters)</option>
                        <option value="Job">Job (Consumables &amp; Accessories)</option>
                        <option value="Pkt">Pkt (Packets)</option>
                        <option value="Kg">Kg (Kilograms)</option>
                        <option value="Mtrs">Mtrs</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Unit Cost (₹) *</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={unitCost}
                        onChange={(e) => setUnitCost(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                      />
                    </div>
                  </div>
                </div>
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
