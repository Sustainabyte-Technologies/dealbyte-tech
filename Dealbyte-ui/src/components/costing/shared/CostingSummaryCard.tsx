import React from 'react';
import {
  Sparkles,
  RefreshCw,
  Save,
} from 'lucide-react';

export interface CostingSummaryCardProps {
  activeSubServiceName: string;
  dbTemplate: any;
  handleLoadTemplateDB: (template: any) => void;
  handleSaveMasterTemplateDB: () => void;
  isSavingTemplate: boolean;
  handleSaveCostingSheetDB: () => void;
  isSavingSheet: boolean;
}

export const CostingSummaryCard: React.FC<CostingSummaryCardProps> = ({
  activeSubServiceName,
  dbTemplate,
  handleLoadTemplateDB,
  handleSaveMasterTemplateDB,
  isSavingTemplate,
  handleSaveCostingSheetDB,
  isSavingSheet,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
      <div className="text-xs text-slate-500 font-medium">
        * Real-time engine calculations with database template sync and audit trail logging.
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {dbTemplate && (
          <button
            type="button"
            onClick={() => handleLoadTemplateDB(dbTemplate)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-emerald-600" /> Load DB Template ({activeSubServiceName})
          </button>
        )}
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
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSavingSheet ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Costing Sheet
        </button>
      </div>
    </div>
  );
};
