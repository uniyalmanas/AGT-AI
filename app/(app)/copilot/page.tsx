"use client";

import { useState, useRef, useEffect } from "react";
import { Scale, Send, Sparkles, BookOpen, AlertTriangle, Copy, Check, RotateCcw, ArrowRight, ShieldAlert } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  riskLevel?: "high" | "medium" | "low" | "none";
  riskWarning?: string;
  followUpQuestions?: string[];
}

const STARTER_PROMPTS = [
  {
    title: "Blocked Credit 17(5)",
    text: "Can our client claim ITC on corporate car rentals, employee insurance, and food expenses under Section 17(5)?",
  },
  {
    title: "Rule 86B 1% Cash Pay",
    text: "What are the applicability criteria and exceptions for mandatory 1% cash tax payment under Rule 86B?",
  },
  {
    title: "Export GST Refunds",
    text: "What are the step-by-step conditions to claim GST refund on exports without payment of tax under LUT?",
  },
  {
    title: "Sec 73 vs 74 Notices",
    text: "What is the time limit for Proper Officer to issue DRC-01 notice under Section 73 versus Section 74 (fraud cases)?",
  },
];

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function handleSend(textToSend?: string) {
    const questionText = (textToSend || input).trim();
    if (!questionText || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: questionText,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch response");
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        citations: data.citations,
        riskLevel: data.riskLevel,
        riskWarning: data.riskWarning,
        followUpQuestions: data.followUpQuestions,
      };

      setMessages([...newMessages, assistantMsg]);
    } catch (e: unknown) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `**Error**: ${e instanceof Error ? e.message : "Could not complete legal query."}`,
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  function copyText(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
            <Scale size={24} className="text-brand-600" />
            GST Law Copilot ("GST Law GPT")
          </h1>
          <p className="text-sm text-ink-300 mt-0.5">
            AI Legal Counsel for CA firms — CGST/IGST Acts, Circulars, Case Law & ITC Compliance
          </p>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="btn-secondary text-xs">
            <RotateCcw size={14} /> Clear Conversation
          </button>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 card p-6 overflow-y-auto space-y-6 bg-white mb-4 border border-ink-100">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
              <Sparkles size={28} className="text-brand-600" />
            </div>
            <h2 className="text-lg font-bold text-ink-900">Ask GST Law Copilot Anything</h2>
            <p className="text-xs text-ink-300 max-w-md mt-1 mb-8 leading-relaxed">
              Ask about blocked credit under Section 17(5), notice defenses, Rule 86B cash limits, export refunds, or recent AAR rulings.
            </p>

            {/* Starter Prompts */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-2xl text-left">
              {STARTER_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.text)}
                  className="p-4 rounded-xl border border-ink-100 hover:border-brand-300 hover:bg-brand-50/50 transition text-left group bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-brand-700">{p.title}</span>
                    <ArrowRight size={13} className="text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-ink-400 line-clamp-2">{p.text}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              {m.role === "user" ? (
                <div className="max-w-2xl bg-brand-600 text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm shadow-sm">
                  {m.content}
                </div>
              ) : (
                <div className="w-full card p-5 bg-ink-50/50 border border-ink-100 rounded-2xl rounded-tl-none">
                  {/* Citations Badges */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <BookOpen size={13} className="text-brand-600" />
                      <span className="text-[11px] font-semibold text-ink-300 uppercase tracking-wider mr-1">Citations:</span>
                      {m.citations.map((cite, i) => (
                        <span key={i} className="text-[11px] font-mono bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md border border-brand-200">
                          {cite}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Risk Warning Box */}
                  {m.riskWarning && (
                    <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2.5 rounded-xl text-xs flex items-center gap-2.5">
                      <ShieldAlert size={16} className="text-amber-600 flex-shrink-0" />
                      <span>{m.riskWarning}</span>
                    </div>
                  )}

                  {/* Answer Text */}
                  <div className="text-xs text-ink-900 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                    {m.content}
                  </div>

                  {/* Copy Button & Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-100">
                    <button
                      onClick={() => copyText(m.id, m.content)}
                      className="text-xs text-ink-300 hover:text-ink-700 flex items-center gap-1.5 transition"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check size={13} className="text-emerald-600" /> Copied legal advice
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy to Clipboard
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-ink-300 font-mono">Verified under CGST Act 2017</span>
                  </div>

                  {/* Follow up suggestions */}
                  {m.followUpQuestions && m.followUpQuestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-ink-100">
                      <p className="text-[11px] font-semibold text-ink-300 uppercase tracking-wider mb-2">Suggested Next Questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {m.followUpQuestions.map((fq, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(fq)}
                            className="text-xs bg-white text-brand-700 border border-brand-200 px-3 py-1.5 rounded-xl hover:bg-brand-50 transition text-left"
                          >
                            → {fq}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center gap-3 p-4 card bg-brand-50/40 border border-brand-100 rounded-2xl w-fit">
            <span className="spinner" />
            <span className="text-xs text-brand-700 font-medium">GST Law Copilot analyzing CGST/IGST Acts & Circulars…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3 flex-shrink-0"
      >
        <input
          type="text"
          className="input py-3 px-4 text-xs font-sans shadow-sm"
          placeholder="Ask any GST legal, technical, or Section 17(5) query (e.g. 'Can ITC be claimed on hotel stay for staff?')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary py-3 px-5">
          <Send size={15} /> Ask AI Legal
        </button>
      </form>
    </div>
  );
}
