import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { EMBRYO_QUIZ_QUESTIONS } from '../data/quizData';
import { EMBRYO_STAGES } from '../data/embryoStagesData';
import { ANKI_EMBRYO_FLASHCARDS, AnkiFlashcard } from '../data/ankiFlashcardsData';
import { QuizQuestion, EmbryoStage, HotspotPin, GermLayer } from '../types';
import { AnkiFlashcardViewer3D } from './AnkiFlashcardViewer3D';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw, 
  Sparkles, 
  Award,
  BookOpen,
  Layers,
  Eye,
  EyeOff,
  Flame,
  Brain,
  Check,
  Tag,
  Stethoscope,
  Compass,
  Shuffle,
  Volume2,
  ChevronRight,
  Filter,
  BarChart3,
  Dna,
  Zap,
  Clock,
  Keyboard
} from 'lucide-react';

interface Props {
  onOpenGlossary?: (termName: string) => void;
}

type QuizTabMode = 'flashcards' | 'sandbox' | 'board_vignettes';

interface FlashcardProgress {
  [cardId: string]: {
    mastery: number; // 0 (New) to 4 (Mastered)
    reviewsCount: number;
    lastRating?: 'again' | 'hard' | 'good' | 'easy';
    lastReviewedAt?: number;
  };
}

export const EmbryoQuiz: React.FC<Props> = ({ onOpenGlossary }) => {
  // Active Tab Sub-Mode
  const [activeTabMode, setActiveTabMode] = useState<QuizTabMode>('flashcards');

  // ==========================================
  // 1. ANKI 3D FLASHCARDS STATE
  // ==========================================
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [selectedGermLayerFilter, setSelectedGermLayerFilter] = useState<string>('All');
  const [selectedSystemFilter, setSelectedSystemFilter] = useState<string>('All');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('All');
  const [selectedMasteryFilter, setSelectedMasteryFilter] = useState<'all' | 'due' | 'learning' | 'mastered'>('all');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState<number>(0);
  const [sessionRatings, setSessionRatings] = useState<{ again: number; hard: number; good: number; easy: number }>({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0
  });

  // LocalStorage Persistence for Spaced Repetition Mastery
  const [progress, setProgress] = useState<FlashcardProgress>(() => {
    try {
      const saved = localStorage.getItem('embryo_anki_flashcards_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save Progress
  const saveProgress = useCallback((newProg: FlashcardProgress) => {
    setProgress(newProg);
    try {
      localStorage.setItem('embryo_anki_flashcards_progress', JSON.stringify(newProg));
    } catch {}
  }, []);

  // Filtered Cards Deck
  const filteredCards = useMemo(() => {
    let list = ANKI_EMBRYO_FLASHCARDS.filter((card) => {
      // Germ layer filter
      if (selectedGermLayerFilter !== 'All' && card.germLayer !== selectedGermLayerFilter.toLowerCase()) {
        return false;
      }
      // System filter
      if (selectedSystemFilter !== 'All' && card.systemCategory !== selectedSystemFilter) {
        return false;
      }
      // Stage range filter
      if (selectedStageFilter !== 'All') {
        if (selectedStageFilter === 'Pre-Embryonic (W1-2)' && card.week > 2) return false;
        if (selectedStageFilter === 'Gastrula & Neurula (W3-4)' && (card.week < 3 || card.week > 4)) return false;
        if (selectedStageFilter === 'Organogenesis (W5-6)' && (card.week < 5 || card.week > 6)) return false;
        if (selectedStageFilter === 'Fetal Period (W8-38)' && card.week < 8) return false;
      }
      // Mastery filter
      const cardMastery = progress[card.id]?.mastery || 0;
      if (selectedMasteryFilter === 'due' && cardMastery >= 3) return false;
      if (selectedMasteryFilter === 'learning' && (cardMastery < 1 || cardMastery >= 3)) return false;
      if (selectedMasteryFilter === 'mastered' && cardMastery < 3) return false;

      return true;
    });

    if (isShuffled) {
      // Deterministic or pseudorandom shuffle
      return [...list].sort(() => 0.5 - Math.sin(list.length));
    }
    return list;
  }, [selectedGermLayerFilter, selectedSystemFilter, selectedStageFilter, selectedMasteryFilter, isShuffled, progress]);

  // Current Active Flashcard
  const activeCard: AnkiFlashcard | undefined = filteredCards[cardIndex] || filteredCards[0];

  // Corresponding 3D EmbryoStage Object for active flashcard
  const activeStage: EmbryoStage = useMemo(() => {
    if (!activeCard) return EMBRYO_STAGES[0];
    const found = EMBRYO_STAGES.find((s) => s.id === activeCard.stageId || s.week === activeCard.week);
    return found || EMBRYO_STAGES[0];
  }, [activeCard]);

  // Stats Calculations
  const stats = useMemo(() => {
    let mastered = 0;
    let learning = 0;
    let newCards = 0;

    ANKI_EMBRYO_FLASHCARDS.forEach((c) => {
      const m = progress[c.id]?.mastery || 0;
      if (m >= 3) mastered++;
      else if (m > 0) learning++;
      else newCards++;
    });

    const total = ANKI_EMBRYO_FLASHCARDS.length;
    const retentionRate = total > 0 ? Math.round(((mastered * 1.0 + learning * 0.5) / total) * 100) : 0;

    return { mastered, learning, newCards, total, retentionRate };
  }, [progress]);

  // Spaced Repetition Rating Action
  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!activeCard) return;

    const currentMastery = progress[activeCard.id]?.mastery || 0;
    let newMastery = currentMastery;

    if (rating === 'again') {
      newMastery = 0;
    } else if (rating === 'hard') {
      newMastery = Math.min(4, Math.max(1, currentMastery + 1));
    } else if (rating === 'good') {
      newMastery = Math.min(4, Math.max(2, currentMastery + 2));
    } else if (rating === 'easy') {
      newMastery = 4;
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    }

    const updatedProgress = {
      ...progress,
      [activeCard.id]: {
        mastery: newMastery,
        reviewsCount: (progress[activeCard.id]?.reviewsCount || 0) + 1,
        lastRating: rating,
        lastReviewedAt: Date.now()
      }
    };
    saveProgress(updatedProgress);

    setSessionReviewedCount((prev) => prev + 1);
    setSessionRatings((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));

    // Move to next card
    if (cardIndex < filteredCards.length - 1) {
      setCardIndex((prev) => prev + 1);
      setIsFlipped(false);
      setShowHint(false);
    } else {
      // Loop or finish
      setCardIndex(0);
      setIsFlipped(false);
      setShowHint(false);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleNextCard = () => {
    if (cardIndex < filteredCards.length - 1) {
      setCardIndex((prev) => prev + 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handlePrevCard = () => {
    if (cardIndex > 0) {
      setCardIndex((prev) => prev - 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all your 3D Anki flashcard mastery data and review counts?')) {
      saveProgress({});
      setSessionReviewedCount(0);
      setSessionRatings({ again: 0, hard: 0, good: 0, easy: 0 });
      setCardIndex(0);
      setIsFlipped(false);
    }
  };

  // Keyboard Navigation Listener
  useEffect(() => {
    if (activeTabMode !== 'flashcards') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === '1' && isFlipped) {
        e.preventDefault();
        handleRateCard('again');
      } else if (e.key === '2' && isFlipped) {
        e.preventDefault();
        handleRateCard('hard');
      } else if (e.key === '3' && isFlipped) {
        e.preventDefault();
        handleRateCard('good');
      } else if (e.key === '4' && isFlipped) {
        e.preventDefault();
        handleRateCard('easy');
      } else if (e.key === 'h' || e.key === 'H') {
        setShowHint((prev) => !prev);
      } else if (e.key === 'ArrowRight' || e.key === ']') {
        handleNextCard();
      } else if (e.key === 'ArrowLeft' || e.key === '[') {
        handlePrevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabMode, isFlipped, cardIndex, filteredCards.length, activeCard, progress]);

  // Audio Pronunciation
  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  // ==========================================
  // 2. 3D OCCLUSION SANDBOX STATE
  // ==========================================
  const [sandboxStage, setSandboxStage] = useState<EmbryoStage>(EMBRYO_STAGES[4] || EMBRYO_STAGES[0]);
  const [sandboxHideAll, setSandboxHideAll] = useState<boolean>(true);
  const [sandboxSelectedPin, setSandboxSelectedPin] = useState<HotspotPin | null>(null);
  const [sandboxPinRevealed, setSandboxPinRevealed] = useState<{ [pinId: string]: boolean }>({});

  const handleToggleRevealSandboxPin = (pinId: string) => {
    setSandboxPinRevealed((prev) => ({ ...prev, [pinId]: !prev[pinId] }));
  };

  const handleRevealAllSandboxPins = () => {
    const revealedAll: { [pinId: string]: boolean } = {};
    (sandboxStage.hotspots || []).forEach((p) => {
      revealedAll[p.id] = true;
    });
    setSandboxPinRevealed(revealedAll);
    setSandboxHideAll(false);
  };

  const handleHideAllSandboxPins = () => {
    setSandboxPinRevealed({});
    setSandboxHideAll(true);
  };

  // ==========================================
  // 3. BOARD VIGNETTES STATE
  // ==========================================
  const [vignetteIndex, setVignetteIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [vignetteScore, setVignetteScore] = useState(0);
  const [showVignetteResult, setShowVignetteResult] = useState(false);

  const question: QuizQuestion = EMBRYO_QUIZ_QUESTIONS[vignetteIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmitVignetteAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    setIsAnswered(true);

    if (selectedOption === question.correctIndex) {
      setVignetteScore((prev) => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNextVignette = () => {
    if (vignetteIndex < EMBRYO_QUIZ_QUESTIONS.length - 1) {
      setVignetteIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowVignetteResult(true);
      if (vignetteScore >= EMBRYO_QUIZ_QUESTIONS.length / 2) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const handleRestartVignette = () => {
    setVignetteIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setVignetteScore(0);
    setShowVignetteResult(false);
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
      {/* Quiz Navigation Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-400 shadow-md">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Embryology Active Recall & Self-Testing Hub
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                USMLE & Anki Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active structural recall with 3D label occlusion, spaced repetition intervals, and clinical vignettes
            </p>
          </div>
        </div>

        {/* Sub-Mode Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 self-start lg:self-auto">
          <button
            id="tab_mode_anki_flashcards"
            onClick={() => setActiveTabMode('flashcards')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTabMode === 'flashcards'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>3D Anki Flashcards</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
              {ANKI_EMBRYO_FLASHCARDS.length}
            </span>
          </button>

          <button
            id="tab_mode_3d_sandbox"
            onClick={() => setActiveTabMode('sandbox')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTabMode === 'sandbox'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>3D Occlusion Sandbox</span>
          </button>

          <button
            id="tab_mode_board_vignettes"
            onClick={() => setActiveTabMode('board_vignettes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTabMode === 'board_vignettes'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Clinical Vignettes</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 font-mono">
              {EMBRYO_QUIZ_QUESTIONS.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: 3D ANKI FLASHCARDS (ACTIVE RECALL & OCCLUSION)                     */}
      {/* ========================================================================= */}
      {activeTabMode === 'flashcards' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Top Bar: Mastery Stats & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            {/* Stats Metrics */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">Retention:</span>
                <span className="font-bold text-amber-400">{stats.retentionRate}%</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mastered: <strong>{stats.mastered}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Learning: <strong>{stats.learning}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                <span>New: <strong>{stats.newCards}</strong></span>
              </div>
            </div>

            {/* Quick Actions: Shuffle, Reset */}
            <div className="flex items-center gap-2">
              <button
                id="btn_anki_shuffle"
                onClick={() => setIsShuffled(!isShuffled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isShuffled
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Shuffle Flashcard Deck"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>

              <button
                id="btn_anki_reset_prog"
                onClick={handleResetProgress}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all"
                title="Reset Spaced Repetition Mastery"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Filter Ribbon: Germ Layers & Developmental Epochs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              Origin:
            </span>
            {['All', 'Ectoderm', 'Mesoderm', 'Endoderm', 'Neural_Crest', 'Extraembryonic'].map((layer) => {
              const label = layer === 'Neural_Crest' ? 'Neural Crest' : layer;
              const isSelected = selectedGermLayerFilter === (layer === 'Neural_Crest' ? 'Neural Crest' : layer);
              return (
                <button
                  key={layer}
                  onClick={() => {
                    setSelectedGermLayerFilter(layer === 'Neural_Crest' ? 'Neural Crest' : layer);
                    setCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-950/60'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}

            <div className="w-px h-4 bg-slate-800 mx-1 hidden sm:block" />

            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Epoch:</span>
            {['All', 'Pre-Embryonic (W1-2)', 'Gastrula & Neurula (W3-4)', 'Organogenesis (W5-6)', 'Fetal Period (W8-38)'].map((ep) => {
              const isSelected = selectedStageFilter === ep;
              return (
                <button
                  key={ep}
                  onClick={() => {
                    setSelectedStageFilter(ep);
                    setCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ep}
                </button>
              );
            })}
          </div>

          {/* Main Flashcard Container: 3D Stage on Left, Flashcard Inspection on Right */}
          {activeCard ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* 3D Active Recall Canvas (Left 7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <AnkiFlashcardViewer3D
                  currentStage={activeStage}
                  activeFlashcard={activeCard}
                  isRevealed={isFlipped}
                  onToggleReveal={() => setIsFlipped(!isFlipped)}
                  hideAllLabels={!isFlipped}
                />

                {/* Card Deck Navigation Header Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                  <button
                    id="btn_anki_prev_card"
                    disabled={cardIndex === 0}
                    onClick={handlePrevCard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 font-semibold transition-all border border-slate-800"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-cyan-400 font-bold">Card {cardIndex + 1}</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-400">{filteredCards.length}</span>
                  </div>

                  <button
                    id="btn_anki_next_card"
                    disabled={cardIndex === filteredCards.length - 1}
                    onClick={handleNextCard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 font-semibold transition-all border border-slate-800"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Anki Flashcard Panel (Right 5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Flashcard Body Card */}
                <div className={`p-5 rounded-3xl border transition-all flex flex-col gap-4 shadow-xl ${
                  isFlipped 
                    ? 'bg-slate-950/95 border-emerald-500/40 shadow-emerald-950/20' 
                    : 'bg-slate-950/95 border-cyan-500/40 shadow-cyan-950/20'
                }`}>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                          {activeCard.stageTitle}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                          {activeCard.systemCategory}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-white mt-1.5">
                        {isFlipped ? activeCard.structureName : 'Target 3D Structure Identification'}
                      </h3>
                    </div>

                    {/* Pronunciation speech button */}
                    {isFlipped && (
                      <button
                        id="btn_speak_flashcard"
                        onClick={() => handleSpeak(activeCard.structureName)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 transition-all"
                        title="Listen to medical pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* QUESTION STATE (FRONT) */}
                  {!isFlipped ? (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* Active Question Prompt */}
                      <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-100 leading-relaxed font-medium">
                        {activeCard.promptQuestion}
                      </div>

                      {/* Recall Checklist */}
                      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          Self-Recall Objectives:
                        </div>
                        <ul className="space-y-1.5 text-slate-300 text-xs list-disc list-inside">
                          <li>Name the pointed 3D anatomical structure</li>
                          <li>Identify its primary embryonic germ layer</li>
                          <li>List at least 1 adult organ/tissue derivative</li>
                          <li>State the primary clinical congenital defect</li>
                        </ul>
                      </div>

                      {/* Hint Toggle */}
                      <div>
                        <button
                          id="btn_toggle_flashcard_hint"
                          onClick={() => setShowHint(!showHint)}
                          className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>{showHint ? 'Hide Molecular Signaling Hint' : 'Show Molecular Hint'}</span>
                        </button>
                        {showHint && (
                          <div className="mt-2 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200/90 font-mono animate-in fade-in">
                            <strong>Signaling Clue:</strong> {activeCard.molecularSignalingHint}
                          </div>
                        )}
                      </div>

                      {/* Flip Action Button */}
                      <button
                        id="btn_flip_flashcard_reveal"
                        onClick={() => setIsFlipped(true)}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Flip Card & Reveal Answer</span>
                        <span className="text-[10px] font-mono opacity-70 px-1.5 py-0.5 rounded bg-black/20">Spacebar</span>
                      </button>
                    </div>
                  ) : (
                    /* REVEALED STATE (BACK) */
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* Structure Title & Phonetic Banner */}
                      <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-black text-emerald-200">{activeCard.structureName}</h4>
                          {activeCard.pronunciation && (
                            <p className="text-[11px] font-mono text-emerald-400 mt-0.5">
                              {activeCard.pronunciation}
                            </p>
                          )}
                        </div>
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-slate-900 text-emerald-300 border border-emerald-500/40">
                          {activeCard.germLayerOrigin}
                        </span>
                      </div>

                      {/* Adult Fate & Derivatives */}
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                        <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-400" />
                          Adult Fate & Organ Derivatives:
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {activeCard.fateAdultDerivatives.map((f, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 text-[11px]">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Clinical Correlation & Board Pathology */}
                      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-1 text-xs">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
                          High-Yield Clinical Defect:
                        </div>
                        <p className="text-amber-200/90 leading-snug text-[11px] font-medium">
                          {activeCard.clinicalSignificance}
                        </p>
                      </div>

                      {/* Morphogenesis Mechanism & High-Yield Fact */}
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
                        <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          Board Fact:
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {activeCard.highYieldBoardFact}
                        </p>
                      </div>

                      {/* Lookup in Medical Glossary Button */}
                      {onOpenGlossary && (
                        <button
                          id="btn_flashcard_open_glossary"
                          onClick={() => onOpenGlossary(activeCard.structureName)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Look up "{activeCard.structureName}" in Glossary</span>
                        </button>
                      )}

                      {/* Anki Spaced Repetition Rating Controls */}
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider text-center">
                          Rate Your Active Recall (Spaced Repetition):
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {/* Again (Red) */}
                          <button
                            id="btn_anki_rate_again"
                            onClick={() => handleRateCard('again')}
                            className="py-2.5 px-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/50 text-rose-200 font-bold text-xs transition-all flex flex-col items-center gap-0.5 shadow-md active:scale-95"
                            title="Shortcut: Press 1"
                          >
                            <span className="text-[11px]">Again</span>
                            <span className="text-[9px] font-mono text-rose-400">&lt;1 min (1)</span>
                          </button>

                          {/* Hard (Orange) */}
                          <button
                            id="btn_anki_rate_hard"
                            onClick={() => handleRateCard('hard')}
                            className="py-2.5 px-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/50 text-amber-200 font-bold text-xs transition-all flex flex-col items-center gap-0.5 shadow-md active:scale-95"
                            title="Shortcut: Press 2"
                          >
                            <span className="text-[11px]">Hard</span>
                            <span className="text-[9px] font-mono text-amber-400">&lt;6 min (2)</span>
                          </button>

                          {/* Good (Emerald) */}
                          <button
                            id="btn_anki_rate_good"
                            onClick={() => handleRateCard('good')}
                            className="py-2.5 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-200 font-bold text-xs transition-all flex flex-col items-center gap-0.5 shadow-md active:scale-95"
                            title="Shortcut: Press 3"
                          >
                            <span className="text-[11px]">Good</span>
                            <span className="text-[9px] font-mono text-emerald-400">1 day (3)</span>
                          </button>

                          {/* Easy (Cyan/Blue) */}
                          <button
                            id="btn_anki_rate_easy"
                            onClick={() => handleRateCard('easy')}
                            className="py-2.5 px-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-200 font-bold text-xs transition-all flex flex-col items-center gap-0.5 shadow-md active:scale-95"
                            title="Shortcut: Press 4"
                          >
                            <span className="text-[11px]">Easy</span>
                            <span className="text-[9px] font-mono text-cyan-400">4 days (4)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Keyboard Shortcuts Helper Pill */}
                <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-slate-500">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">Space</kbd>
                    <span>Flip</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">1-4</kbd>
                    <span>Rate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">H</kbd>
                    <span>Hint</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">[ / ]</kbd>
                    <span>Nav</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <Sparkles className="w-10 h-10 text-cyan-400 mx-auto" />
              <h4 className="text-base font-bold text-white">No flashcards match the selected filters</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try resetting your germ layer, developmental epoch, or mastery filters to view more cards.
              </p>
              <button
                onClick={() => {
                  setSelectedGermLayerFilter('All');
                  setSelectedStageFilter('All');
                  setSelectedMasteryFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: 3D OCCLUSION SANDBOX (FREE PROBE & SELF-TEST)                      */}
      {/* ========================================================================= */}
      {activeTabMode === 'sandbox' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Stage Picker Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Carnegie / Embryo Stage to Probe:
              </span>
              {/* Occlusion Controls */}
              <div className="flex items-center gap-2">
                <button
                  id="btn_sandbox_hide_all"
                  onClick={handleHideAllSandboxPins}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    sandboxHideAll
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide All Labels (Blind Test)</span>
                </button>
                <button
                  id="btn_sandbox_reveal_all"
                  onClick={handleRevealAllSandboxPins}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    !sandboxHideAll
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reveal All Labels</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {EMBRYO_STAGES.map((stg) => {
                const isSelected = sandboxStage.id === stg.id;
                return (
                  <button
                    key={stg.id}
                    onClick={() => {
                      setSandboxStage(stg);
                      setSandboxSelectedPin(null);
                      setSandboxPinRevealed({});
                    }}
                    className={`px-3 py-2 rounded-xl whitespace-nowrap text-xs font-bold transition-all border shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-400 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>W{stg.week} • {stg.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D Sandbox Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 3D Canvas */}
            <div className="lg:col-span-8">
              <AnkiFlashcardViewer3D
                currentStage={sandboxStage}
                activeFlashcard={{
                  id: 'sandbox_probe',
                  stageId: sandboxStage.id,
                  stageTitle: sandboxStage.title,
                  week: sandboxStage.week,
                  hotspotId: sandboxSelectedPin?.id || '',
                  structureName: sandboxSelectedPin?.name || 'Select Structure',
                  pinPosition: sandboxSelectedPin?.position || [0, 0, 0],
                  germLayer: sandboxSelectedPin?.germLayer || 'mesoderm',
                  systemCategory: 'Cardiovascular',
                  promptQuestion: 'Identify this structure',
                  shortClue: '',
                  molecularSignalingHint: '',
                  germLayerOrigin: sandboxSelectedPin?.germLayer || '',
                  fateAdultDerivatives: sandboxSelectedPin?.fateAdultOrgans || [],
                  developmentalMechanism: sandboxSelectedPin?.fullDesc || '',
                  clinicalSignificance: sandboxSelectedPin?.clinicalSignificance || '',
                  highYieldBoardFact: ''
                }}
                isRevealed={!sandboxHideAll || (sandboxSelectedPin ? !!sandboxPinRevealed[sandboxSelectedPin.id] : false)}
                hideAllLabels={sandboxHideAll}
              />
            </div>

            {/* Structure Pin Inspection Panel */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Anatomical Pins ({sandboxStage.hotspots?.length || 0})
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-400">Click to probe</span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {(sandboxStage.hotspots || []).map((pin, idx) => {
                    const isRevealed = !sandboxHideAll || !!sandboxPinRevealed[pin.id];
                    const isSelected = sandboxSelectedPin?.id === pin.id;

                    return (
                      <div
                        key={pin.id}
                        id={`sandbox_pin_${pin.id}`}
                        onClick={() => setSandboxSelectedPin(pin)}
                        className={`p-3 rounded-xl border text-xs transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-100 shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-white">
                              {isRevealed ? pin.name : `Mystery Structure #${idx + 1}`}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRevealSandboxPin(pin.id);
                            }}
                            className={`p-1 rounded-lg border text-xs transition-all ${
                              isRevealed
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                            title={isRevealed ? 'Hide Label' : 'Reveal Label'}
                          >
                            {isRevealed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {isRevealed && (
                          <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-800 animate-in fade-in">
                            <div className="flex items-center gap-1.5 text-indigo-300">
                              <span className="font-semibold uppercase text-[10px]">Origin:</span>
                              <span>{pin.germLayer}</span>
                            </div>
                            <p className="text-slate-300 leading-snug">{pin.shortDesc}</p>
                            <p className="text-amber-300/90 font-medium">{pin.clinicalSignificance}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: BOARD REVIEW VIGNETTES (USMLE MULTIPLE CHOICE)                     */}
      {/* ========================================================================= */}
      {activeTabMode === 'board_vignettes' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Stats */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-slate-400">
              Vignette {vignetteIndex + 1} of {EMBRYO_QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-slate-950 text-cyan-400 border border-slate-800">
              Score: {vignetteScore} / {EMBRYO_QUIZ_QUESTIONS.length}
            </span>
          </div>

          {!showVignetteResult ? (
            <div className="space-y-4">
              {/* Milestone Tag */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                  {question.embryologicalMilestone}
                </span>
              </div>

              {/* Vignette Text */}
              <div className="bg-slate-950/90 border border-slate-800/90 p-4 rounded-2xl text-xs text-slate-200 leading-relaxed">
                {question.vignette}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === question.correctIndex;

                  let style = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60';
                  if (isAnswered) {
                    if (isCorrect) {
                      style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold ring-1 ring-emerald-500';
                    } else if (isSelected) {
                      style = 'bg-rose-950/60 border-rose-500 text-rose-200 line-through';
                    } else {
                      style = 'bg-slate-950/30 border-slate-850 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    style = 'bg-cyan-950/70 border-cyan-400 text-cyan-100 font-semibold ring-1 ring-cyan-400';
                  }

                  return (
                    <button
                      key={idx}
                      id={`btn_quiz_opt_${idx}`}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center justify-between ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isAnswered && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Embryological Rationale:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{question.explanation}</p>

                  <div className="pt-2 border-t border-slate-850 flex items-start gap-1.5 text-amber-300/90 font-mono text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>High-Yield Fact: {question.highYieldFact}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {!isAnswered ? (
                  <button
                    id="btn_submit_quiz_answer"
                    disabled={selectedOption === null}
                    onClick={handleSubmitVignetteAnswer}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white font-bold text-xs transition-all shadow-md shadow-cyan-600/20"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    id="btn_next_quiz_question"
                    onClick={handleNextVignette}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-600/20 flex items-center gap-1.5"
                  >
                    <span>{vignetteIndex < EMBRYO_QUIZ_QUESTIONS.length - 1 ? 'Next Vignette' : 'View Results'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Card */
            <div className="bg-slate-950/90 border border-slate-800 p-8 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Clinical Quiz Completed!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  You scored <span className="font-bold text-cyan-400 font-mono text-sm">{vignetteScore}</span> out of{' '}
                  <span className="font-bold text-white font-mono text-sm">{EMBRYO_QUIZ_QUESTIONS.length}</span> (
                  {Math.round((vignetteScore / EMBRYO_QUIZ_QUESTIONS.length) * 100)}%)
                </p>
              </div>

              <button
                id="btn_restart_quiz"
                onClick={handleRestartVignette}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
