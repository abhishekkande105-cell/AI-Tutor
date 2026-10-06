import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Lightbulb, 
  RotateCcw, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Layers, 
  Flame, 
  ArrowRight,
  Info,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TutorSession, ChatMessage } from '../types';
import { FeedbackBadge } from '../components/FeedbackBadge';
import { fireStudentCelebration } from '../components/Confetti';

interface TutorPageProps {
  initialTopicId?: number;
  initialPrompt?: string;
  onNavigateProgress?: () => void;
}

export const TutorPage: React.FC<TutorPageProps> = ({ 
  initialTopicId = 1, 
  initialPrompt = "Can you solve 2x + 5 = 15?",
  onNavigateProgress
}) => {
  const { user, status } = useAuth();
  const [session, setSession] = useState<TutorSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentHint, setCurrentHint] = useState<{ step: number; title: string; content: string } | null>(null);
  const [showHintModal, setShowHintModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initialize or fetch session
  const initSession = async () => {
    try {
      setIsLoading(true);
      const sess = await api.startTutorSession(
        initialTopicId, 
        "Algebra — Linear Equations", 
        "Medium"
      );
      setSession(sess);
      setMessages(sess.messages || []);
      setIsCompleted(sess.status === 'COMPLETED');

      // If initial prompt is supplied and only 1 welcome message exists, auto-ask to start conversation
      if (initialPrompt && sess.messages && sess.messages.length === 1) {
        // Send initial student question after slight pause for natural realism
        setTimeout(async () => {
          try {
            const resp = await api.sendMessage(sess.session_id, initialPrompt);
            setMessages(prev => [
              ...prev,
              { id: Date.now(), sender: 'STUDENT', content: initialPrompt, feedback_type: 'NORMAL' },
              { 
                id: resp.id, 
                sender: 'AI', 
                content: resp.content, 
                feedback_type: resp.feedback_type as any,
                created_at: resp.created_at
              }
            ]);
            setSession(prev => prev ? {
              ...prev,
              current_step: resp.current_step,
              status: resp.status as any
            } : null);
          } catch (e) {
            console.error('Auto start prompt failed', e);
          }
        }, 400);
      }
    } catch (err) {
      console.error('Session init error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initSession();
  }, [initialTopicId]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !session || isLoading) return;

    setInputText('');
    
    // Add user message to UI immediately
    const tempStudentMsg: ChatMessage = {
      id: `client-${Date.now()}`,
      sender: 'STUDENT',
      content: text,
      feedback_type: 'NORMAL'
    };
    setMessages(prev => [...prev, tempStudentMsg]);
    setIsLoading(true);

    try {
      const resp = await api.sendMessage(session.session_id, text);
      
      const newAiMsg: ChatMessage = {
        id: resp.id,
        sender: 'AI',
        content: resp.content,
        feedback_type: resp.feedback_type as any,
        created_at: resp.created_at
      };
      setMessages(prev => [...prev, newAiMsg]);

      setSession(prev => prev ? {
        ...prev,
        current_step: resp.current_step,
        status: resp.status as any
      } : null);

      if (resp.is_completed || resp.feedback_type === 'SOLVED') {
        setIsCompleted(true);
        fireStudentCelebration();
      }
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestHint = async () => {
    if (!session || isLoading) return;
    setIsLoading(true);
    try {
      const hintRes = await api.requestHint(session.session_id);
      setCurrentHint({
        step: hintRes.hint_step,
        title: hintRes.title,
        content: hintRes.content
      });
      setShowHintModal(true);

      // Append hint into chat as well
      setMessages(prev => [...prev, hintRes.message]);
      setSession(prev => prev ? { ...prev, hints_used: hintRes.hint_step } : null);
    } catch (err) {
      console.error('Failed to request hint', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick prompt chips for live demo test
  const quickTestChips = [
    { label: "Subtract 5", text: "Subtract 5 from both sides." },
    { label: "2x = 10", text: "We get 2x = 10" },
    { label: "Divide by 2 (x = 5)", text: "Divide both sides by 2, so x = 5" },
    { label: "Add 5 (Test Gentle Correction)", text: "What if I add 5 to both sides?" },
    { label: "Just give me answer (Socratic test)", text: "Just give me the answer" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12">
      
      {/* Classroom Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Teacher Identity */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-blue-950">
                  SocraticAI Tutor
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Your Personal Learning Guide
                </span>
                {status.gemma_configured ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Gemma Connected
                  </span>
                ) : (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Demo Mode (Pedagogical Engine)
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed max-w-2xl">
                “Hi! I’m here to help you understand the problem. I won’t give you the answer right away — I’ll help you discover it.”
              </p>
            </div>
          </div>

          {/* Reset / New Session */}
          <button
            onClick={initSession}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Start fresh problem"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>

        {/* Academic Context Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <BookOpen className="w-4 h-4 text-blue-700 shrink-0" />
            <span><strong>Subject:</strong> {session?.topic?.subject_name || "Mathematics"} → {session?.topic?.name || "Algebra"}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Layers className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Difficulty:</strong> <span className="font-semibold text-amber-700">{session?.difficulty || "Medium"}</span></span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Objective:</strong> Understand inverse operations to isolate x</span>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-600">
            <span>Cognitive Step Progress:</span>
            <span className="font-bold text-blue-900">
              {isCompleted ? "Step 3 of 3 (Complete)" : `Step ${session?.current_step || 1} of 3`}
            </span>
          </div>
          <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-blue-600'}`}
              style={{ width: isCompleted ? '100%' : `${((session?.current_step || 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Conversation Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card flex flex-col h-[520px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
          
          {messages.map((msg, index) => {
            const isStudent = msg.sender === 'STUDENT';

            return (
              <div
                key={msg.id || index}
                className={`flex items-start gap-3 ${isStudent ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {!isStudent && (
                  <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center text-lg shrink-0 shadow-xs mt-0.5">
                    👩‍🏫
                  </div>
                )}

                {/* Message Content Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-2xs space-y-2.5 ${
                    isStudent
                      ? 'bg-blue-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  {/* Sender label and Feedback Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold ${isStudent ? 'text-blue-200' : 'text-blue-900'}`}>
                      {isStudent ? (user?.full_name || 'Student') : 'SocraticAI Tutor'}
                    </span>
                    {!isStudent && msg.feedback_type && (
                      <FeedbackBadge type={msg.feedback_type} />
                    )}
                  </div>

                  {/* Message Body with clean paragraph rendering */}
                  <div className={`space-y-2 ${isStudent ? 'text-blue-50 font-medium' : 'text-slate-800'}`}>
                    {msg.content.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className="whitespace-pre-wrap">{paragraph}</p>
                    ))}
                  </div>

                </div>

                {/* Student Avatar */}
                {isStudent && (
                  <div className="w-9 h-9 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                    <img 
                      src={user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=Student"} 
                      alt="Student" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing / Thinking Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center text-lg shrink-0">
                👩‍🏫
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-xs flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1 text-slate-600 font-semibold">Teacher is formulating a guiding question...</span>
              </div>
            </div>
          )}

          {/* Solved Celebratory Banner */}
          {isCompleted && (
            <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-blue-50 border-2 border-emerald-300 rounded-2xl p-5 text-center space-y-3 shadow-md animate-fadeIn my-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-xl shadow-xs">
                🌟
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Concept Mastered! You Solved It Yourself.
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                You didn’t just copy an answer — you reasoned through each algebraic step using inverse operations.
              </p>
              <div className="flex justify-center gap-3 pt-1">
                {onNavigateProgress && (
                  <button
                    onClick={onNavigateProgress}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Updated Progress</span>
                  </button>
                )}
                <button
                  onClick={initSession}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 rounded-xl transition-colors"
                >
                  Practice Another Problem
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Test Demo Chips Strip */}
        <div className="px-4 py-2 bg-slate-100/90 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-500 whitespace-nowrap text-[11px]">Quick Demo Responses:</span>
          {quickTestChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.text)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-900 font-medium whitespace-nowrap transition-all shadow-2xs"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Student Answer Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Write your answer or question here..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />

            {/* Hint Button */}
            <button
              type="button"
              onClick={handleRequestHint}
              disabled={isLoading}
              className="px-3.5 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
              title="Get a pedagogical hint (Hint 1 of 3)"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Ask for Hint</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
                {session?.hints_used || 0}/3
              </span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <span>Submit Answer</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Hint Disclosure Modal / Popover */}
          {showHintModal && currentHint && (
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 flex items-start justify-between gap-3 text-xs animate-fadeIn">
              <div className="space-y-1">
                <div className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-purple-700" />
                  <span>{currentHint.title}</span>
                </div>
                <p className="text-purple-800 leading-relaxed font-medium">
                  {currentHint.content}
                </p>
              </div>
              <button
                onClick={() => setShowHintModal(false)}
                className="text-purple-600 hover:text-purple-900 font-bold px-2 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
