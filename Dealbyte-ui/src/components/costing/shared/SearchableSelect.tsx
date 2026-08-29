'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Sparkles } from 'lucide-react';
import { formatMoney } from '../utils';

export interface SearchableOption {
  label: string;
  value: string;
  price?: number;
  uom?: string;
  subtitle?: string;
  category?: string;
}

export interface SearchableSelectProps {
  options: SearchableOption[];
  value: string;
  onChange: (value: string, selectedOption?: SearchableOption) => void;
  placeholder?: string;
  customOptionLabel?: string;
  theme?: 'purple' | 'indigo' | 'emerald' | 'slate' | 'cyan' | 'blue' | 'green' | 'teal' | 'amber';
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '-- Select Hardware (Searchable) --',
  customOptionLabel = '✨ Custom Hardware Component',
  theme = 'purple',
  className = '',
  buttonClassName = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return options.find(
      (opt) => opt.value === value || opt.label === value || opt.subtitle === value
    );
  }, [options, value]);

  // Filtered options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const query = searchTerm.toLowerCase().trim();
    return options.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(query);
      const matchSubtitle = opt.subtitle?.toLowerCase().includes(query);
      const matchUom = opt.uom?.toLowerCase().includes(query);
      const matchPrice = opt.price ? String(opt.price).includes(query) : false;
      const matchCategory = opt.category?.toLowerCase().includes(query);
      return matchLabel || matchSubtitle || matchUom || matchPrice || matchCategory;
    });
  }, [options, searchTerm]);

  // Theme styling tokens
  const themeStylesMap = {
    purple: {
      buttonBorder: 'border-purple-200 hover:border-purple-400 focus:border-purple-600',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
      activeItem: 'bg-purple-50 text-purple-950 font-bold',
      focusRing: 'focus:ring-purple-500',
      accentText: 'text-purple-600',
    },
    indigo: {
      buttonBorder: 'border-indigo-200 hover:border-indigo-400 focus:border-indigo-600',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      activeItem: 'bg-indigo-50 text-indigo-950 font-bold',
      focusRing: 'focus:ring-indigo-500',
      accentText: 'text-indigo-600',
    },
    emerald: {
      buttonBorder: 'border-emerald-200 hover:border-emerald-400 focus:border-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      activeItem: 'bg-emerald-50 text-emerald-950 font-bold',
      focusRing: 'focus:ring-emerald-500',
      accentText: 'text-emerald-600',
    },
    green: {
      buttonBorder: 'border-emerald-200 hover:border-emerald-400 focus:border-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      activeItem: 'bg-emerald-50 text-emerald-950 font-bold',
      focusRing: 'focus:ring-emerald-500',
      accentText: 'text-emerald-600',
    },
    cyan: {
      buttonBorder: 'border-cyan-200 hover:border-cyan-400 focus:border-cyan-600',
      badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-200',
      activeItem: 'bg-cyan-50 text-cyan-950 font-bold',
      focusRing: 'focus:ring-cyan-500',
      accentText: 'text-cyan-600',
    },
    blue: {
      buttonBorder: 'border-cyan-200 hover:border-cyan-400 focus:border-cyan-600',
      badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-200',
      activeItem: 'bg-cyan-50 text-cyan-950 font-bold',
      focusRing: 'focus:ring-cyan-500',
      accentText: 'text-cyan-600',
    },
    teal: {
      buttonBorder: 'border-teal-200 hover:border-teal-400 focus:border-teal-600',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-200',
      activeItem: 'bg-teal-50 text-teal-950 font-bold',
      focusRing: 'focus:ring-teal-500',
      accentText: 'text-teal-600',
    },
    amber: {
      buttonBorder: 'border-amber-200 hover:border-amber-400 focus:border-amber-600',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
      activeItem: 'bg-amber-50 text-amber-950 font-bold',
      focusRing: 'focus:ring-amber-500',
      accentText: 'text-amber-600',
    },
    slate: {
      buttonBorder: 'border-slate-200 hover:border-slate-400 focus:border-slate-600',
      badgeBg: 'bg-slate-100 text-slate-900 border-slate-200',
      activeItem: 'bg-slate-50 text-slate-950 font-bold',
      focusRing: 'focus:ring-slate-500',
      accentText: 'text-slate-600',
    },
  };
  const themeStyles = themeStylesMap[theme as keyof typeof themeStylesMap] || themeStylesMap.purple;

  const handleSelect = (opt: SearchableOption) => {
    onChange(opt.value, opt);
    setIsOpen(false);
  };

  const handleCustomSelect = () => {
    onChange('__CUSTOM__');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs flex items-center justify-between gap-2 transition-all cursor-pointer ${themeStyles.buttonBorder} ${buttonClassName}`}
      >
        <span className="truncate text-left flex-1">
          {selectedOption ? (
            <span className="flex items-center gap-1.5 truncate">
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.price !== undefined && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border shrink-0 ${themeStyles.badgeBg}`}>
                  {selectedOption.price > 0 ? `₹${formatMoney(selectedOption.price)}` : 'POR'} / {selectedOption.uom || 'Nos'}
                </span>
              )}
            </span>
          ) : value === '__CUSTOM__' ? (
            <span className="text-amber-700 font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" /> Custom Hardware Component
            </span>
          ) : (
            <span className="text-slate-400 font-medium">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Searchable Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[320px] max-w-[540px] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Search Input Box */}
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search hardware, price, UoM..."
              className="w-full bg-transparent text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none py-1"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Results Summary & Custom Button */}
          <div className="px-3 py-1.5 bg-slate-100/60 border-b border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-500">
            <span>
              {filteredOptions.length} item{filteredOptions.length === 1 ? '' : 's'} available
            </span>
            <button
              type="button"
              onClick={handleCustomSelect}
              className="text-amber-700 hover:text-amber-800 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="h-3 w-3" /> Custom Hardware
            </button>
          </div>

          {/* Options Scrollable List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected =
                  opt.value === value || opt.label === value || opt.subtitle === value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? themeStyles.activeItem
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-bold text-slate-900 truncate leading-snug">
                        {opt.label}
                      </div>
                      {opt.subtitle && opt.subtitle !== opt.label && (
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-tight">
                          {opt.subtitle}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end">
                      {opt.price !== undefined && (
                        <span className="font-black text-slate-900 text-xs">
                          {opt.price > 0 ? `₹${formatMoney(opt.price)}` : 'POR'}
                        </span>
                      )}
                      {opt.uom && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          / {opt.uom}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className={`h-4 w-4 shrink-0 ml-1.5 self-center ${themeStyles.accentText}`} />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching hardware found for "{searchTerm}".
                <button
                  type="button"
                  onClick={handleCustomSelect}
                  className="block mx-auto mt-2 text-indigo-600 font-bold hover:underline"
                >
                  Use as Custom Component
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
