import React, { useState } from 'react';
import { EmbryoStage } from '../types';
import { Bot, Send, Sparkles, Loader2, BookOpen, Lightbulb } from 'lucide-react';

interface Props {
  currentStage: EmbryoStage;
  initialQuestion?: string;
}

export const EmbryoAITutor: React.FC<Props> = ({ currentStage, initialQuestion }) => {
  const [question, setQuestion] = useState(initialQuestion || '');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hello! I am your AI Human Embryology & Teratology Tutor. I am here to help you master developmental anatomy, Carnegie stages, molecular signaling (SHH, Wnt, BMP, FGF, Retinoic Acid), and clinical correlates for Week ${currentStage.week} (${currentStage.title}) or any embryonic milestone. Feel free to ask any question or tap a suggested topic below.`
    }
  ]);

  const quickPrompts = [
    `How does the primitive heart tube loop and septate into 4 chambers?`,
    `Explain the physiological midgut herniation and 270° counterclockwise rotation.`,
    `What causes Tetralogy of Fallot and why is it linked to neural crest cells?`,
    `How does the respiratory diverticulum branch and when does surfactant synthesis start?`,
    `Compare the embryological basis of Omphalocele vs Gastroschisis.`
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || question;
    if (!textToSend.trim() || loading) return;

    const newMsgs = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMsgs);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/embryo-ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          stageContext: {
            week: currentStage.week,
            title: currentStage.title,
            trimester: currentStage.trimester,
            crlMm: currentStage.crlMm,
            keyEvents: currentStage.keyEvents,
            morphogens: currentStage.morphogens
          }
        })
      });

      if (!res.ok) throw new Error('API server request failed');
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.answer || 'No response received.' }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `[Embryology Tutor Reference]\nDuring Week ${currentStage.week} (${currentStage.title}), developmental transformations are driven by tightly coordinated spatial morphogen gradients (SHH, BMP4, FGF8, Wnt). Review the anatomical cross-sections and clinical correlates above for specific USMLE and board milestones.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Gemini AI Embryology & Teratology Tutor
            </h3>
            <p className="text-xs text-slate-400">
              Interactive clinical discussions, signaling pathways, and developmental anatomy Q&A
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Grounded on Week {currentStage.week} Context
        </span>
      </div>

      {/* Suggested Quick Query Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
        <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1 flex-shrink-0">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          Quick Queries:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            id={`btn_quick_query_${i}`}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 text-[11px] px-3 py-1 rounded-xl bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 transition-all text-left"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="h-64 sm:h-72 overflow-y-auto space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 text-xs ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 items-center text-xs text-indigo-400 bg-slate-900 p-3 rounded-xl border border-slate-800 w-fit">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Consulting developmental biology database...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          id="input_ai_tutor_query"
          type="text"
          placeholder={`Ask about Week ${currentStage.week} development, morphogens, anomalies...`}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
        />
        <button
          id="btn_send_ai_query"
          type="submit"
          disabled={loading || !question.trim()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
