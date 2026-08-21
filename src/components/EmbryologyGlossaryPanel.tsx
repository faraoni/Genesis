import React, { useState, useMemo } from 'react';
import { EMBRYOLOGY_GLOSSARY_TERMS, GlossaryTerm } from '../data/embryologyGlossaryData';
import {
  BookOpen,
  Search,
  X,
  Sparkles,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Tag,
  Stethoscope,
  Compass,
  Layers,
  ChevronRight,
  HelpCircle,
  Dna,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectTerm?: (term: GlossaryTerm) => void;
  initialSearchQuery?: string;
}

export const EmbryologyGlossaryPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectTerm,
  initialSearchQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGermLayer, setSelectedGermLayer] = useState<string>('All');
  const [selectedTermId, setSelectedTermId] = useState<string | null>(EMBRYOLOGY_GLOSSARY_TERMS[0].id);
  const [bookmarkedTermIds, setBookmarkedTermIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('embryo_bookmarked_terms');
      return saved ? JSON.parse(saved) : ['gastrulation', 'neural_crest', 'sonic_hedgehog'];
    } catch {
      return ['gastrulation', 'neural_crest', 'sonic_hedgehog'];
    }
  });
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Extract unique categories and germ layers
  const categories = useMemo(() => {
    const set = new Set<string>();
    EMBRYOLOGY_GLOSSARY_TERMS.forEach(t => set.add(t.category));
    return ['All', ...Array.from(set)];
  }, []);

  const germLayers = ['All', 'Ectoderm', 'Mesoderm', 'Endoderm', 'Neural Crest', 'Extraembryonic', 'Multiple'];

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return EMBRYOLOGY_GLOSSARY_TERMS.filter(item => {
      // Bookmark filter
      if (showOnlyBookmarks && !bookmarkedTermIds.includes(item.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Germ layer filter
      if (selectedGermLayer !== 'All' && item.germLayerOrigin !== selectedGermLayer) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTerm = item.term.toLowerCase().includes(q);
        const matchesShort = item.shortDefinition.toLowerCase().includes(q);
        const matchesFull = item.fullExplanation.toLowerCase().includes(q);
        const matchesClinical = item.clinicalRelevance.toLowerCase().includes(q);
        const matchesRelated = item.relatedTerms.some(r => r.toLowerCase().includes(q));
        const matchesStages = item.carnegieStagesRelevant?.toLowerCase().includes(q);
        return matchesTerm || matchesShort || matchesFull || matchesClinical || matchesRelated || matchesStages;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedGermLayer, showOnlyBookmarks, bookmarkedTermIds]);

  // Selected term object
  const activeTerm = useMemo(() => {
    if (!selectedTermId) return filteredTerms[0] || null;
    return EMBRYOLOGY_GLOSSARY_TERMS.find(t => t.id === selectedTermId) || filteredTerms[0] || null;
  }, [selectedTermId, filteredTerms]);

  // Bookmark Toggle
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedTermIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('embryo_bookmarked_terms', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Copy Definition
  const handleCopy = (term: GlossaryTerm, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const text = `${term.term} (${term.pronunciation || ''})\nCategory: ${term.category}\n\nDefinition: ${term.shortDefinition}\n\nDetailed Explanation: ${term.fullExplanation}\n\nClinical Relevance: ${term.clinicalRelevance}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(term.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Text-To-Speech Pronunciation
  const handleSpeakTerm = (term: GlossaryTerm, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(term.term);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Click on related term
  const handleJumpToRelatedTerm = (relatedTermName: string) => {
    const found = EMBRYOLOGY_GLOSSARY_TERMS.find(t =>
      t.term.toLowerCase().includes(relatedTermName.toLowerCase()) ||
      relatedTermName.toLowerCase().includes(t.term.toLowerCase())
    );
    if (found) {
      setSelectedTermId(found.id);
      setSearchQuery('');
    } else {
      setSearchQuery(relatedTermName);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="embryology_glossary_drawer_overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="embryology_glossary_panel"
        className="w-full sm:w-[580px] lg:w-[680px] h-full bg-slate-950 border-l border-sky-500/30 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/40 text-sky-400 shadow-md shadow-sky-950/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base tracking-tight">Embryology Glossary & Lexicon</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  {EMBRYOLOGY_GLOSSARY_TERMS.length} Terms
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Peer-reviewed embryological terminology, etymology, and clinical correlations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Saved Bookmarks Filter Button */}
            <button
              id="btn_glossary_filter_bookmarks"
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showOnlyBookmarks
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-950/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Show only bookmarked terms"
            >
              <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarks ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Saved ({bookmarkedTermIds.length})</span>
            </button>

            {/* Close Button */}
            <button
              id="btn_glossary_close"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
              title="Close Glossary Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input_glossary_search"
              type="text"
              placeholder="Search terms, morphogens, germ layers, clinical defects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-sky-500/70 focus:outline-none text-xs text-white placeholder-slate-500 font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all text-[11px] font-medium border ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md shadow-sky-950/50'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Germ Layer Filter Ribbon */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 font-medium text-[10px] uppercase tracking-wider">Origin:</span>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {germLayers.map((layer) => {
                const isSelected = selectedGermLayer === layer;
                return (
                  <button
                    key={layer}
                    onClick={() => setSelectedGermLayer(layer)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all border ${
                      isSelected
                        ? 'bg-indigo-500/30 border-indigo-500 text-indigo-200 font-bold'
                        : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {layer}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two-Column Master/Detail Layout or Stacked View */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          {/* Term List Navigation Sidebar */}
          <div className="w-full md:w-5/12 border-r border-slate-800/80 overflow-y-auto divide-y divide-slate-900/80 max-h-64 md:max-h-none bg-slate-950/50">
            {filteredTerms.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-xs font-semibold text-slate-400">No glossary terms matched</p>
                <p className="text-[11px] text-slate-500 mt-1">Try adjusting your keyword search or category filter</p>
              </div>
            ) : (
              filteredTerms.map((t) => {
                const isSelected = activeTerm?.id === t.id;
                const isBookmarked = bookmarkedTermIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    id={`glossary_item_${t.id}`}
                    onClick={() => {
                      setSelectedTermId(t.id);
                      if (onSelectTerm) onSelectTerm(t);
                    }}
                    className={`p-3 cursor-pointer transition-all flex items-start justify-between gap-2 text-left ${
                      isSelected
                        ? 'bg-sky-500/15 border-l-2 border-l-sky-400 text-sky-100'
                        : 'hover:bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-sky-300' : 'text-white'}`}>
                          {t.term}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {t.shortDefinition}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {t.germLayerOrigin && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {t.germLayerOrigin}
                          </span>
                        )}
                        {t.carnegieStagesRelevant && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-950/40 border border-sky-800/40 text-sky-400">
                            {t.carnegieStagesRelevant.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={(e) => toggleBookmark(t.id, e)}
                        className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark term'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-700'}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Term Detailed Inspector Column */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/80 space-y-4">
            {activeTerm ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Term Header Card */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black text-white">{activeTerm.term}</h2>
                        {activeTerm.pronunciation && (
                          <span className="text-xs font-mono text-sky-300 bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 rounded-lg">
                            {activeTerm.pronunciation}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-indigo-300/90 font-medium mt-1">
                        {activeTerm.category}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-1.5">
                      {/* Audio Pronunciation Button */}
                      <button
                        id="btn_glossary_speak_term"
                        onClick={(e) => handleSpeakTerm(activeTerm, e)}
                        className={`p-2 rounded-xl border transition-all ${
                          isSpeaking
                            ? 'bg-sky-500 text-slate-950 border-sky-400 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-sky-400'
                        }`}
                        title="Listen to medical pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {/* Copy Definition */}
                      <button
                        id="btn_glossary_copy_definition"
                        onClick={(e) => handleCopy(activeTerm, e)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
                        title="Copy complete definition"
                      >
                        {copiedId === activeTerm.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>

                      {/* Bookmark Button */}
                      <button
                        id="btn_glossary_bookmark_active"
                        onClick={(e) => toggleBookmark(activeTerm.id, e)}
                        className={`p-2 rounded-xl border transition-all ${
                          bookmarkedTermIds.includes(activeTerm.id)
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400 hover:text-amber-300'
                        }`}
                        title="Save to bookmarks"
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarkedTermIds.includes(activeTerm.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Summary Callout */}
                  <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 text-xs text-sky-200 leading-relaxed font-medium">
                    {activeTerm.shortDefinition}
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    {activeTerm.germLayerOrigin && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">
                        <Layers className="w-3.5 h-3.5 text-sky-400" />
                        <span className="font-semibold text-[11px]">Origin: {activeTerm.germLayerOrigin}</span>
                      </div>
                    )}
                    {activeTerm.carnegieStagesRelevant && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">
                        <Compass className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-semibold text-[11px]">{activeTerm.carnegieStagesRelevant}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Explanation Card */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    Embryological Mechanism & Morphogenesis
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeTerm.fullExplanation}
                  </p>
                  {activeTerm.etymology && (
                    <div className="pt-2 text-[11px] text-slate-400 italic flex items-center gap-1 border-t border-slate-800/60 mt-2">
                      <span className="font-medium text-slate-500 not-italic">Etymology:</span>
                      <span>{activeTerm.etymology}</span>
                    </div>
                  )}
                </div>

                {/* Clinical Relevance & High-Yield Pathology */}
                <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
                    Clinical Correlation & Teratology
                  </h4>
                  <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                    {activeTerm.clinicalRelevance}
                  </p>
                </div>

                {/* Cross-Referenced Related Terms */}
                {activeTerm.relatedTerms && activeTerm.relatedTerms.length > 0 && (
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-400" />
                      Related Anatomical & Molecular Concepts
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeTerm.relatedTerms.map((rel) => (
                        <button
                          key={rel}
                          onClick={() => handleJumpToRelatedTerm(rel)}
                          className="px-2.5 py-1 rounded-lg text-xs bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-300 transition-all flex items-center gap-1 font-medium"
                        >
                          <span>{rel}</span>
                          <ChevronRight className="w-3 h-3 text-indigo-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <BookOpen className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm font-bold text-slate-400">Select a term from the list</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Review definitions, pronunciations, developmental origins, and clinical correlates
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panel Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/70 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px]">Indexed for USMLE Step 1, Anatomy, & Embryology curricula</span>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedGermLayer('All');
              setShowOnlyBookmarks(false);
            }}
            className="text-[11px] text-sky-400 hover:text-sky-300 underline font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
