import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AIMessage } from '../types';

export const AIAdvisorView: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Where am I overspending?',
    'How can I save ₹5,000 this month?',
    'Analyze my spending this month',
    'Create a budget for me',
    'Help me reach my emergency fund goal',
    'Why did my expenses increase vs last month?'
  ];

  useEffect(() => {
    async function loadConv() {
      try {
        const res = await api.getAIConversation();
        setMessages(res.conversation.messages);
      } catch (err) {
        console.error('Failed to load AI conversation:', err);
      }
    }
    loadConv();
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    setInputVal('');

    // Append optimistic user message
    const tempUserMsg: AIMessage = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const res = await api.sendAIMessage(text);
      setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), tempUserMsg, res.message]);
    } catch (err: any) {
      const errorMsg: AIMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue analyzing your financial records. Please try again. (${err.message || 'Service unavailable'})`,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col h-[calc(100vh-5rem)]">
      {/* Advisor Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              FinAdvisor AI
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Grounded in Your Ledger
              </span>
            </h1>
            <p className="text-xs text-slate-500">Your personal financial planning & cashflow assistant</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-emerald-500" />
          <span>Strictly Private Session</span>
        </div>
      </div>

      {/* Suggested Prompts Shelf */}
      <div className="py-3 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Suggested:</span>
        {suggestedPrompts.map(p => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            disabled={isLoading}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300 whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto py-6 space-y-5">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  isUser
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 rounded-tr-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs rounded-tl-xs space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* Follow-up suggestions */}
                {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 flex flex-wrap gap-1.5">
                    {msg.suggested_actions.map(act => (
                      <button
                        key={act}
                        onClick={() => handleSend(act)}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors"
                      >
                        {act} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span>FinAdvisor AI is analyzing your cashflow and spending patterns...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Ask me about your budget, spending, or savings..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/30"
          />
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-40 shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
          FinAdvisor provides educational financial planning assistance and does not constitute professional financial, investment, tax, or legal advice.
        </p>
      </div>
    </div>
  );
};
