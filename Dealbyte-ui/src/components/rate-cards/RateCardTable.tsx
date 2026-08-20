'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ColumnDef {
  key: string;
  label: string;
  isCurrency?: boolean;
}

interface RateCardTableProps {
  data: any[];
  columns: ColumnDef[];
  onUpdate: (id: string, updatedFields: Record<string, any>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  canManage?: boolean;
}

export default function RateCardTable({
  data,
  columns,
  onUpdate,
  onDelete,
  canManage = true,
}: RateCardTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});

  const startEdit = (row: any) => {
    setEditingId(row.id);
    setEditForm({ ...row });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    try {
      // Extract only modifiable column keys to avoid submitting unwanted metadata (e.g. id, createdAt, updatedAt)
      const cleanPayload: Record<string, any> = {};
      columns.forEach((col) => {
        if (editForm[col.key] !== undefined) {
          cleanPayload[col.key] = editForm[col.key];
        }
      });
      await onUpdate(id, cleanPayload);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Failed to update rate card item:', error);
    }
  };

  if (data.length === 0) {
    return <div className="p-8 text-center text-slate-400 text-xs">No rate card items found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="py-3.5 px-6">
                {col.label}
              </th>
            ))}
            {canManage && <th className="py-3.5 px-6 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-800">
          {data.map((row) => {
            const isEditing = editingId === row.id;

            return (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="py-3.5 px-6 font-medium">
                    {isEditing ? (
                      <input
                        type={col.isCurrency ? 'number' : 'text'}
                        value={editForm[col.key] ?? ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            [col.key]: col.isCurrency ? Number(e.target.value) : e.target.value,
                          })
                        }
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs w-full"
                      />
                    ) : col.isCurrency ? (
                      formatCurrency(row[col.key])
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}

                {canManage && (
                  <td className="py-3.5 px-6 text-right space-x-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(row.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Save"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(row)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(row.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
