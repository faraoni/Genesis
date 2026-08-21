import React, { useState, useRef, useEffect } from 'react';
import { EmbryoStage } from '../types';
import { Search, X, ChevronRight, Hash, Calendar, Sparkles } from 'lucide-react';

interface Props {
  stages: EmbryoStage[];
  currentStage: EmbryoStage;
  onSelectStage: (stage: EmbryoStage) => void;
}

export const CarnegieStageSearchBar: React.FC<Props> = ({
  stages,
  currentStage,
  onSelectStage,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  // Filter stages by Carnegie Stage number, week, title, subtitle, or key events
  const filteredStages = stages.filter((stage) => {
    if (!normalizedQuery) return true;

    // Check Carnegie Stage number matches like "CS 10", "CS10", "10", "Carnegie 10", "Stage 10"
    const csNumStr = stage.carnegieStage ? String(stage.carnegieStage) : '';
    const csMatch = 
      (csNumStr && (
        normalizedQuery === csNumStr ||
        normalizedQuery === `cs ${csNumStr}` ||
        normalizedQuery === `cs${csNumStr}` ||
        normalizedQuery === `carnegie ${csNumStr}` ||
        normalizedQuery === `stage ${csNumStr}` ||
        normalizedQuery.includes(csNumStr) && (normalizedQuery.startsWith('cs') || normalizedQuery.startsWith('carnegie'))
      ));

    // Check Week matches like "Week 4", "Wk 4", "W4", "4"
    const weekStr = String(stage.week);
    const weekMatch = 
      normalizedQuery === `week ${weekStr}` ||
      normalizedQuery === `wk ${weekStr}` ||
      normalizedQuery === `wk${weekStr}` ||
      normalizedQuery === `w${weekStr}`;

    // Text search
    const textMatch = 
      stage.title.toLowerCase().includes(normalizedQuery) ||
      stage.subtitle.toLowerCase().includes(normalizedQuery) ||
      stage.trimester.toLowerCase().includes(normalizedQuery) ||
      stage.morphogens.some(m => m.toLowerCase().includes(normalizedQuery)) ||
      stage.keyEvents.some(k => k.toLowerCase().includes(normalizedQuery));

    return csMatch || weekMatch || textMatch;
  });

  const handleSelect = (stage: EmbryoStage) => {
    onSelectStage(stage);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter' && filteredStages.length > 0) {
      handleSelect(filteredStages[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-sky-400/80 pointer-events-none" />
        <input
          ref={inputRef}
          id="input_carnegie_search"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search Carnegie Stage (e.g., 'CS 10', 'Week 4', 'Neurulation')..."
          className="w-full pl-9 pr-8 py-2 bg-slate-900/90 hover:bg-slate-900 focus:bg-slate-950 border border-slate-700/80 focus:border-sky-500 rounded-xl text-xs text-slate-100 placeholder-slate-400/80 outline-none transition-all shadow-inner focus:ring-1 focus:ring-sky-500/50"
        />
        {query && (
          <button
            id="btn_clear_carnegie_search"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-1 text-slate-400 hover:text-white rounded-md transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Auto-suggest / Search Results Dropdown */}
      {isOpen && (
        <div 
          id="carnegie_search_results"
          className="absolute top-full left-0 mt-1.5 w-full max-h-80 overflow-y-auto bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-xl shadow-2xl p-1.5 z-50 divide-y divide-slate-800/80 scrollbar-thin scrollbar-thumb-slate-700"
        >
          <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            <span>
              {query ? `Found ${filteredStages.length} matching stage${filteredStages.length === 1 ? '' : 's'}` : 'Carnegie Developmental Stages'}
            </span>
            <span className="text-slate-500 font-mono text-[9px] lowercase">press enter to jump</span>
          </div>

          {filteredStages.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No matching Carnegie stage found for "{query}". Try "CS 10", "Gastrula", "Heart", or "Week 6".
            </div>
          ) : (
            <div className="py-1 space-y-0.5">
              {filteredStages.map((stage) => {
                const isSelected = stage.id === currentStage.id;
                return (
                  <button
                    key={stage.id}
                    id={`btn_search_result_${stage.id}`}
                    onClick={() => handleSelect(stage)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="flex flex-col items-center justify-center w-12 h-9 rounded bg-slate-950/80 border border-slate-800 flex-shrink-0 text-center">
                        <span className="text-[9px] font-mono text-sky-400 leading-tight">Wk {stage.week}</span>
                        {stage.carnegieStage ? (
                          <span className="text-[10px] font-mono font-bold text-amber-300 leading-tight">
                            CS{stage.carnegieStage}
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono text-slate-400 leading-tight">FETAL</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">{stage.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{stage.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800/70 px-1.5 py-0.5 rounded">
                        {stage.crlMm} mm
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
