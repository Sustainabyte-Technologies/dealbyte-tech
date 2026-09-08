import React from 'react';
import {
  Sparkles,
  RefreshCw,
  Save,
} from 'lucide-react';

export interface CostingSummaryCardProps {
  activeSubServiceName?: string;
  dbTemplate?: any;
  handleLoadTemplateDB?: (template: any) => void;
  handleSaveMasterTemplateDB: () => void;
  isSavingTemplate: boolean;
  handleSaveCostingSheetDB: () => void;
  isSavingSheet: boolean;
  isEditing?: boolean;
  editId?: string;
}

export const CostingSummaryCard: React.FC<CostingSummaryCardProps> = ({
  handleSaveMasterTemplateDB,
  isSavingTemplate,
  handleSaveCostingSheetDB,
  isSavingSheet,
  isEditing = false,
  editId,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
      <div className="text-xs text-slate-500 font-medium">
        {isEditing ? (
          <span className="text-amber-700 font-semibold">
            * Editing Costing Sheet #{editId} — Saving will update this record in the database.
          </span>
        ) : (
          '* Real-time engine calculations with database template sync and audit trail logging.'
        )}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleSaveMasterTemplateDB}
          disabled={isSavingTemplate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-600/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSavingTemplate ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Save Master Template
        </button>
        <button
          type="button"
          onClick={handleSaveCostingSheetDB}
          disabled={isSavingSheet}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer ${
            isEditing
              ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25 ring-2 ring-amber-400/30'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
          }`}
        >
          {isSavingSheet ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isEditing ? (isSavingSheet ? 'Updating Sheet...' : 'Update Costing Sheet') : (isSavingSheet ? 'Saving Sheet...' : 'Save Costing Sheet')}
        </button>
      </div>
    </div>
  );
};
