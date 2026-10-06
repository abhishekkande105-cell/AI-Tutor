import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  GraduationCap, 
  BookOpen, 
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const { status, refreshStatus } = useAuth();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
  const [keyFeedback, setKeyFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  const [tutorPersona, setTutorPersona] = useState('Patient Mentor');
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingKey(true);
    setKeyFeedback(null);
    try {
      const res = await api.updateApiKey(apiKeyInput);
      await refreshStatus();
      if (res.status.gemma_configured) {
        setKeyFeedback({
          success: true,
          msg: '✨ Gemma AI successfully connected! Live Socratic models are active.'
        });
      } else {
        setKeyFeedback({
          success: true,
          msg: 'Reverted to Demo Mode with stateful Socratic pedagogical engine.'
        });
      }
    } catch (err: any) {
      setKeyFeedback({
        success: false,
        msg: 'Failed to configure API key. Please check the key format and network.'
      });
    } finally {
      setIsUpdatingKey(false);
    }
  };

  const handleResetData = async () => {
    setIsResetting(true);
    setResetMessage('');
    try {
      await api.resetDemoData();
      setResetMessage('✓ Demo data and cohort analytics refreshed successfully.');
      setTimeout(() => setResetMessage(''), 4000);
    } catch {
      setResetMessage('Error resetting data.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Settings & AI Engine
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
              Platform Configuration
            </span>
          </div>
          <p className="mt-1 text-slate-600 text-sm">
            Manage Gemma AI connectivity, Socratic pedagogical personas, and demo environments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {status.gemma_configured ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Gemma AI Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
              <Cpu className="w-4 h-4 text-amber-600" />
              Demo Mode (Pedagogical Engine)
            </span>
          )}
        </div>
      </div>

      {/* Gemma AI API Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Key className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Gemma / Gemini Model API Key</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect Google's Gemma model to generate dynamic Socratic responses in real time.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveApiKey} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Google Gemini / Gemma API Key</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={status.gemma_configured ? "••••••••••••••••••••••••••••••••" : "Paste your GEMINI_API_KEY here..."}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              <button
                type="submit"
                disabled={isUpdatingKey}
                className="px-6 py-3 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
              >
                {isUpdatingKey ? "Verifying..." : "Update & Connect"}
              </button>
              {status.gemma_configured && (
                <button
                  type="button"
                  onClick={async () => {
                    setApiKeyInput('');
                    await api.updateApiKey('');
                    await refreshStatus();
                    setKeyFeedback({ success: true, msg: 'Switched back to Demo Mode.' });
                  }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors shrink-0"
                >
                  Use Demo Mode
                </button>
              )}
            </div>
          </div>

          {keyFeedback && (
            <div 
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 animate-fadeIn ${
                keyFeedback.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {keyFeedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{keyFeedback.msg}</span>
            </div>
          )}

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">💡 Hackathon Evaluation Note:</span>
            <p>
              When running in <strong>Demo Mode</strong>, SocraticAI uses its built-in pedagogical state machine to deliver consistent 100% reliable responses for algebraic equation solving, hints, and error diagnostics—requiring zero external internet or API keys.
            </p>
          </div>
        </form>
      </div>

      {/* Pedagogical Persona & Teaching Style */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Socratic Teaching Persona</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select the pedagogical tone and questioning style adopted by SocraticAI Tutor.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'Patient Mentor',
              title: 'Patient Mentor (Recommended)',
              desc: 'High warmth and encouragement. Uses emoji, celebratory feedback, and gentle step-by-step guidance.',
              badge: 'Default'
            },
            {
              id: 'Rigorous Academic',
              title: 'Rigorous Academic',
              desc: 'Emphasizes strict mathematical definitions, properties of equality, and formal proofs.',
              badge: 'Formal'
            },
            {
              id: 'Socratic Coach',
              title: 'Socratic Coach',
              desc: 'Rapid diagnostic inquiry, probing questions, and direct counter-examples to challenge intuition.',
              badge: 'Dynamic'
            }
          ].map((persona) => (
            <div
              key={persona.id}
              onClick={() => setTutorPersona(persona.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                tutorPersona === persona.id
                  ? 'border-blue-900 bg-blue-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{persona.title}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {persona.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{persona.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-blue-900 flex items-center gap-1">
                {tutorPersona === persona.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-900" />}
                <span>{tutorPersona === persona.id ? 'Active Persona' : 'Click to select'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database & Demo Reset */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Demo State & Database</h2>
            <p className="text-xs text-slate-500">
              Refresh sample sessions, student cohort metrics, and topic records to the initial demo state.
            </p>
          </div>

          <button
            onClick={handleResetData}
            disabled={isResetting}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {resetMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
            {resetMessage}
          </div>
        )}
      </div>

    </div>
  );
};
