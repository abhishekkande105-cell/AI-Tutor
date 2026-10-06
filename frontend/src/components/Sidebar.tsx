import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  Flame, 
  Target, 
  BarChart3, 
  History, 
  Settings, 
  School,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { user, role } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'My Subjects', icon: BookOpen },
    { 
      id: 'tutor', 
      label: 'AI Tutor', 
      icon: Sparkles,
      highlight: true,
      badge: 'Teacher Guided'
    },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'history', label: 'Learning History', icon: History },
    { id: 'settings', label: 'Settings & AI', icon: Settings },
  ];

  if (role === 'TEACHER' || role === 'ADMIN') {
    navItems.unshift({
      id: 'teacher',
      label: 'Teacher Console',
      icon: School,
      highlight: false,
      badge: 'Faculty'
    });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex">
      <div className="space-y-6">
        
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Academic Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm'
                    : item.highlight
                    ? 'text-blue-900 bg-blue-50/70 hover:bg-blue-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-200' : item.highlight ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Learning Streak widget */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Learning Streak</span>
            <span className="flex items-center text-xs font-extrabold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
              <Flame className="w-3.5 h-3.5 mr-0.5 fill-orange-500 text-orange-500 animate-pulse" />
              {user?.streak_days || 7} Days
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Consistent Socratic discovery strengthens long-term concept retention.
          </p>
          <div className="mt-3 flex gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div 
                key={i} 
                className={`flex-1 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                  i < (user?.streak_days ? Math.min(user.streak_days, 7) : 7)
                    ? 'bg-orange-500 text-white' 
                    : 'bg-amber-200/50 text-slate-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer teacher card */}
      <div className="pt-4 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-900">Socratic Mentor</div>
            <div className="text-[11px] text-slate-500">Patience. Guidance. Mastery.</div>
          </div>
        </div>
      </div>

    </aside>
  );
};
