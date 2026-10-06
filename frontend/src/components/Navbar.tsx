import React from 'react';
import { GraduationCap, Sparkles, UserCheck, School, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onStartDemoGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onStartDemoGuide }) => {
  const { user, role, status, demoLogin } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-md group-hover:bg-blue-800 transition-colors">
              <GraduationCap className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl text-blue-950 tracking-tight">SocraticAI</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">EdTech</span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Learn the concept. Solve it yourself.</p>
            </div>
          </button>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* AI Connection Status Badge */}
          <div className="hidden md:flex items-center">
            {status.gemma_configured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                Gemma AI Connected
              </span>
            ) : (
              <span 
                title="Socratic pedagogical engine active. To connect live Gemma model, add GEMINI_API_KEY in backend/.env"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 cursor-help"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Demo Mode (Pedagogical Engine)
              </span>
            )}
          </div>

          {/* Quick Demo Script Button */}
          {onStartDemoGuide && (
            <button
              onClick={onStartDemoGuide}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Judge Quick Walkthrough</span>
            </button>
          )}

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                demoLogin('STUDENT');
                if (currentView === 'teacher') onNavigate('dashboard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === 'STUDENT'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Student view"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Student</span>
            </button>

            <button
              onClick={() => {
                demoLogin('TEACHER');
                onNavigate('teacher');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === 'TEACHER'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Teacher Dashboard"
            >
              <School className="w-3.5 h-3.5 text-emerald-600" />
              <span>Teacher</span>
            </button>
          </div>

          {/* User Profile Mini */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.full_name}`}
                alt={user.full_name}
                className="w-8 h-8 rounded-full border border-blue-200 bg-blue-50"
              />
              <div className="hidden xl:block text-left text-xs">
                <div className="font-semibold text-slate-900 leading-tight">{user.full_name}</div>
                <div className="text-slate-500 text-[10px]">{user.grade_level || user.role}</div>
              </div>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
