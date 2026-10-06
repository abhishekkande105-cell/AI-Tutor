import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Flame, 
  Target, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Calculator, 
  Atom, 
  FlaskConical, 
  Code2, 
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface StudentDashboardProps {
  onStartTutor: (topicId?: number, initialPrompt?: string) => void;
  onNavigate: (view: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onStartTutor, onNavigate }) => {
  const { user } = useAuth();

  const subjects = [
    {
      id: 1,
      name: 'Mathematics',
      progress: 72,
      icon: Calculator,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      topic: 'Algebra — Linear Equations',
      nextGoal: 'Two-step equation balancing',
    },
    {
      id: 2,
      name: 'Physics',
      progress: 54,
      icon: Atom,
      color: 'bg-sky-500',
      textColor: 'text-sky-700',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      topic: "Newton's Laws of Motion",
      nextGoal: 'Free-body vector diagrams',
    },
    {
      id: 3,
      name: 'Chemistry',
      progress: 81,
      icon: FlaskConical,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      topic: 'Chemical Equations & Balancing',
      nextGoal: 'Stoichiometric molar ratios',
    },
    {
      id: 4,
      name: 'Programming',
      progress: 67,
      icon: Code2,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      topic: 'Python Loops & Iteration',
      nextGoal: 'Nested iteration and comprehension',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Good morning, {user?.full_name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              {user?.streak_days || 7} Day Streak
            </span>
          </div>
          <p className="mt-1.5 text-slate-600 text-sm">
            Ready to learn something new today? SocraticAI Tutor is ready to guide you.
          </p>
        </div>

        {/* Quick Launch Button */}
        <button
          onClick={() => onStartTutor(1, "Can you solve 2x + 5 = 15?")}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md transition-all shrink-0 group"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>Launch AI Tutor Session</span>
          <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Main Focus: Continue Learning Card */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-800/80 text-blue-200 border border-blue-700/50">
              <span>Continue Learning</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Algebra • Linear Equations</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              “Solve 2x + 5 = 15 with inverse operations”
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your tutor will guide you to isolate the unknown term step-by-step. Discover the inverse arithmetic rule on your own!
            </p>
          </div>

          <button
            onClick={() => onStartTutor(1, "Can you solve 2x + 5 = 15?")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-950 font-bold text-sm shadow-lg hover:bg-blue-50 transition-all shrink-0"
          >
            <Play className="w-4 h-4 fill-blue-950" />
            <span>Resume Tutoring</span>
          </button>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-blue-950">Your Learning Subjects</h2>
            <p className="text-xs text-slate-500">Track mastery and launch targeted guided practice</p>
          </div>
          <button
            onClick={() => onNavigate('subjects')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            View All Subjects <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {subjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${sub.bgColor} ${sub.textColor} flex items-center justify-center border ${sub.borderColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {sub.progress}%
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-1">{sub.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{sub.topic}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${sub.color} rounded-full transition-all duration-500`}
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    Next: {sub.nextGoal.slice(0, 18)}...
                  </span>
                  <button
                    onClick={() => onStartTutor(sub.id)}
                    className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
                    title={`Practice ${sub.name}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Bottom: Recommended For You & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recommended for You */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-base text-blue-950">Recommended for You</h3>
            </div>
            <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">Adaptive Path</span>
          </div>

          <div className="space-y-3">
            <div 
              onClick={() => onStartTutor(1, "Can you help me solve 3y - 7 = 14?")}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="font-semibold text-xs text-slate-900">Two-Step Linear Equations</div>
                <div className="text-[11px] text-slate-500">Reinforce inverse operations with subtraction terms</div>
              </div>
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div 
              onClick={() => onStartTutor(2, "A 5 kg block experiences a net force of 20 N. What is its acceleration?")}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="font-semibold text-xs text-slate-900">Newton's Second Law (F = ma)</div>
                <div className="text-[11px] text-slate-500">Physics conceptual application & vector awareness</div>
              </div>
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-base text-blue-950">Recent Sessions</h3>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900"
            >
              Full History
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Algebra — Linear Equations
                </div>
                <div className="text-[11px] text-slate-500">Solved independently • 1 hint used</div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Score
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Newton's Laws of Motion
                </div>
                <div className="text-[11px] text-slate-500">Guided discovery • 2 hints used</div>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                88% Score
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
