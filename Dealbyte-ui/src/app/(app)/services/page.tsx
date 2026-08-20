'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  FileCheck,
  Edit2,
  RefreshCw,
  FolderGit2,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import { servicesApi, ServiceItem } from '@/lib/api/services';
import { useAuth } from '@/providers/AuthProvider';

const INITIAL_PROJECTS: ServiceItem[] = [
  {
    id: 'proj-optibyte',
    name: 'Optibyte',
    category: 'Projects Catalog',
    description: 'Optical Fiber & High-bandwidth Byte Communications Infrastructure',
    hasCostingTemplate: true,
    _count: { deals: 4, quotes: 5 },
  },
  {
    id: 'proj-digiweld',
    name: 'Digiweld',
    category: 'Projects Catalog',
    description: 'Digital Welding Automation & Weld Quality Diagnostics System',
    hasCostingTemplate: true,
    _count: { deals: 1, quotes: 2 },
  },
  {
    id: 'proj-tec-byte',
    name: 'Tec Byte',
    category: 'Projects Catalog',
    description: 'Technology & Digital Byte Solutions Platform for Industrial Edge Monitoring',
    hasCostingTemplate: false,
    _count: { deals: 0, quotes: 1 },
  },
  {
    id: 'proj-fix-byte',
    name: 'Fix Byte',
    category: 'Projects Catalog',
    description: 'Automated Machinery Diagnostics & Precision Fix Platform',
    hasCostingTemplate: false,
    _count: { deals: 1, quotes: 1 },
  },
  {
    id: 'proj-compass',
    name: 'Compass',
    category: 'Projects Catalog',
    description: 'Enterprise Navigation & Spatial Resource Compass System',
    hasCostingTemplate: false,
    _count: { deals: 2, quotes: 2 },
  },
];

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const canManage = hasRole('ADMIN', 'ESTIMATION_LEAD');

  // Tab State: SERVICES vs PROJECTS
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'PROJECTS'>('SERVICES');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [hasCostingTemplate, setHasCostingTemplate] = useState(false);
  const [itemType, setItemType] = useState<'SERVICE' | 'PROJECT'>('SERVICE');

  const { data: dbServices = [], isLoading, refetch } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getAll(),
  });

  // Helper to check if an item is a project
  const isProjectItem = (s: ServiceItem) => {
    const cat = (s.category || '').toLowerCase();
    const nm = (s.name || '').toLowerCase();
    return (
      cat.includes('project') ||
      ['optibyte', 'digiweld', 'tec byte', 'fix byte', 'compass'].includes(nm)
    );
  };

  // Combine DB services with default projects ensuring all requested projects exist
  const allCombinedItems: ServiceItem[] = [...dbServices];
  INITIAL_PROJECTS.forEach((proj) => {
    const exists = allCombinedItems.some(
      (item) => item.name.toLowerCase() === proj.name.toLowerCase()
    );
    if (!exists) {
      allCombinedItems.push(proj);
    }
  });

  const servicesList = allCombinedItems.filter((item) => !isProjectItem(item));
  const projectsList = allCombinedItems.filter((item) => isProjectItem(item));

  const currentTabItems = activeTab === 'SERVICES' ? servicesList : projectsList;

  const createMutation = useMutation({
    mutationFn: servicesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success(`${itemType === 'PROJECT' ? 'Project' : 'Service'} created successfully!`);
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save offering');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; data: any }) => servicesApi.update(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Updated successfully!');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update offering');
    },
  });

  const openCreateModal = () => {
    setEditingService(null);
    setName('');
    setItemType(activeTab === 'PROJECTS' ? 'PROJECT' : 'SERVICE');
    setCategory(activeTab === 'PROJECTS' ? 'Projects - Automation' : 'Audit & Compliance');
    setDescription('');
    setHasCostingTemplate(true);
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setName(service.name);
    setItemType(isProjectItem(service) ? 'PROJECT' : 'SERVICE');
    setCategory(service.category);
    setDescription(service.description || '');
    setHasCostingTemplate(service.hasCostingTemplate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) {
      toast.error('Name and Category are required');
      return;
    }

    const finalCategory =
      itemType === 'PROJECT' && !category.toLowerCase().includes('project')
        ? `Projects - ${category}`
        : category;

    if (editingService && !editingService.id.startsWith('proj-')) {
      updateMutation.mutate({
        id: editingService.id,
        data: { name, category: finalCategory, description, hasCostingTemplate },
      });
    } else {
      createMutation.mutate({ name, category: finalCategory, description, hasCostingTemplate });
    }
  };

  // Categories list for filter based on active tab
  const categories = Array.from(new Set(currentTabItems.map((s) => s.category))).filter(Boolean);

  const filteredItems = currentTabItems.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-600" /> Services &amp; Projects Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage available service offerings, project implementations, categories, and costing template availability
          </p>
        </div>

        {canManage && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
          >
            <Plus className="h-4 w-4" /> Add New {activeTab === 'PROJECTS' ? 'Project' : 'Service'}
          </button>
        )}
      </div>

      {/* Two Main Tabs: Services vs Projects */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setActiveTab('SERVICES');
            setCategoryFilter('ALL');
          }}
          className={`flex items-center gap-2 px-6 py-3 font-extrabold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'SERVICES'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60 rounded-t-xl shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Services Catalog
          <span className="ml-1.5 px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full">
            {servicesList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('PROJECTS');
            setCategoryFilter('ALL');
          }}
          className={`flex items-center gap-2 px-6 py-3 font-extrabold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'PROJECTS'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60 rounded-t-xl shadow-xs'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
          }`}
        >
          <FolderGit2 className="h-4 w-4" />
          Projects Catalog
          <span className="ml-1.5 px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full">
            {projectsList.length}
          </span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()} by name or description...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-500">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories ({currentTabItems.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={() => refetch()}
            className="p-2 text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Items List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading catalog items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            {activeTab === 'SERVICES' ? (
              <Briefcase className="h-10 w-10 mx-auto text-slate-300" />
            ) : (
              <FolderGit2 className="h-10 w-10 mx-auto text-slate-300" />
            )}
            <p className="text-sm font-medium">
              No {activeTab.toLowerCase()} found matching search filters.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">
                  {activeTab === 'PROJECTS' ? 'Project Name' : 'Service Name'}
                </th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Costing Template</th>
                <th className="py-3.5 px-6">Total Quotes</th>
                {canManage && <th className="py-3.5 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{item.name}</span>
                      {activeTab === 'PROJECTS' && (
                        <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-extrabold bg-emerald-100 text-emerald-800 rounded-md">
                          Project
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <div className="text-xs text-slate-500 font-normal mt-0.5 max-w-md">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {item.hasCostingTemplate ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Template Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                        <XCircle className="h-3.5 w-3.5" /> Custom Quote Needed
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700">
                    {item._count?.quotes || 0} quotes
                  </td>
                  {canManage && (
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Item"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingService
                ? `Edit ${itemType === 'PROJECT' ? 'Project' : 'Service'}`
                : `Add New ${itemType === 'PROJECT' ? 'Project' : 'Service Offering'}`}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher in Modal */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Type</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setItemType('SERVICE')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      itemType === 'SERVICE'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Service
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemType('PROJECT')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      itemType === 'PROJECT'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Project
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {itemType === 'PROJECT' ? 'Project Name *' : 'Service Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={itemType === 'PROJECT' ? 'e.g. Energy Conservation Project' : 'e.g. Electrical Safety Audit'}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={
                    itemType === 'PROJECT'
                      ? 'e.g. Hardware & Automation'
                      : 'e.g. Audit & Compliance'
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Scope, specifications, and details..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="hasCostingTemplate"
                  checked={hasCostingTemplate}
                  onChange={(e) => setHasCostingTemplate(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="hasCostingTemplate" className="text-xs font-medium text-slate-700">
                  Has Standard Costing Engine Template
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
