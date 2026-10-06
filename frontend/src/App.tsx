import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { TutorPage } from './pages/TutorPage';
import { PracticePage } from './pages/PracticePage';
import { SubjectsPage } from './pages/SubjectsPage';
import { ProgressPage } from './pages/ProgressPage';
import { HistoryPage } from './pages/HistoryPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { SettingsPage } from './pages/SettingsPage';
import { X, ChevronRight, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, demoLogin } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeTopicId, setActiveTopicId] = useState<number>(1);
  const [initialTutorPrompt, setInitialTutorPrompt] = useState<string>("Can you solve 2x + 5 = 15?");
  const [showDemoGuide, setShowDemoGuide] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTutor = (topicId: number = 1, initialPrompt?: string) => {
    setActiveTopicId(topicId);
    if (initialPrompt) setInitialTutorPrompt(initialPrompt);
    setCurrentView('tutor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPractice = (topicId: number = 1) => {
    setActiveTopicId(topicId);
    setCurrentView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Demo Walkthrough steps as requested in Hackathon Spec
  const demoSteps = [
    {
      num: 1,
      title: "1. Landing Page",
      desc: "Hero explains 'Your personal AI teacher — not an answer machine' in 5 seconds.",
      action: () => navigateTo('landing')
    },
    {
      num: 2,
      title: "2. Student Dashboard",
      desc: "Good morning Alex! Shows Streak (7 Days), Subject mastery cards, and Continue Learning.",
      action: () => {
        demoLogin('STUDENT');
        navigateTo('dashboard');
      }
    },
    {
      num: 3,
      title: "3. Socratic AI Tutor",
      desc: "Classroom setup. Enter 'Solve 2x + 5 = 15' to begin guided discovery.",
      action: () => {
        demoLogin('STUDENT');
        handleStartTutor(1, "Can you solve 2x + 5 = 15?");
      }
    },
    {
      num: 4,
      title: "4. Student Progress Analytics",
      desc: "Inspect 78% mastery, 84% accuracy, 7-day streak, Recharts bar and weekly graphs.",
      action: () => navigateTo('progress')
    },
    {
      num: 5,
      title: "5. Teacher & Faculty Dashboard",
      desc: "Monitor cohort, common mistakes (34% sign errors), and Students Needing Support (Rahul, Priya, Aman).",
      action: () => {
        demoLogin('TEACHER');
        navigateTo('teacher');
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar 
        currentView={currentView} 
        onNavigate={navigateTo}
        onStartDemoGuide={() => setShowDemoGuide(true)}
      />

      {/* Main Layout */}
      {currentView === 'landing' ? (
        <main className="flex-1">
          <LandingPage 
            onStartLearning={() => {
              demoLogin('STUDENT');
              navigateTo('dashboard');
            }}
            onExploreTeacher={() => {
              demoLogin('TEACHER');
              navigateTo('teacher');
            }}
          />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Left Sidebar */}
          <Sidebar currentView={currentView} onNavigate={navigateTo} />

          {/* Center Main Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
            {currentView === 'dashboard' && (
              <StudentDashboard 
                onStartTutor={handleStartTutor} 
                onNavigate={navigateTo} 
              />
            )}

            {currentView === 'tutor' && (
              <TutorPage 
                initialTopicId={activeTopicId}
                initialPrompt={initialTutorPrompt}
                onNavigateProgress={() => navigateTo('progress')}
              />
            )}

            {currentView === 'practice' && (
              <PracticePage 
                initialTopicId={activeTopicId}
                onOpenTutorForHelp={(topicId, prompt) => handleStartTutor(topicId, prompt)}
              />
            )}

            {currentView === 'subjects' && (
              <SubjectsPage 
                onStartTutor={handleStartTutor}
                onStartPractice={handleStartPractice}
              />
            )}

            {currentView === 'progress' && <ProgressPage />}

            {currentView === 'history' && <HistoryPage />}

            {currentView === 'teacher' && <TeacherDashboard />}

            {currentView === 'settings' && <SettingsPage />}
          </main>
        </div>
      )}

      {/* Judge Quick Walkthrough Modal */}
      {showDemoGuide && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-elevated p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-200" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">3-Minute Hackathon Demo Script</h3>
                  <p className="text-xs text-slate-500">Step-by-step problem evaluation walkthrough</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDemoGuide(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {demoSteps.map((s) => (
                <div 
                  key={s.num}
                  onClick={() => {
                    s.action();
                    setShowDemoGuide(false);
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-blue-900">{s.title}</span>
                    <p className="text-[11px] text-slate-500">{s.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 text-center">
              Click any step above to jump directly to that part of the product.
            </div>
          </div>
        </div>
      )}

      {/* Floating Demo Walkthrough Pill on bottom right */}
      {!showDemoGuide && (
        <button
          onClick={() => setShowDemoGuide(true)}
          className="fixed bottom-5 right-5 z-40 bg-blue-950 text-white px-4 py-2.5 rounded-full shadow-elevated border border-blue-800 hover:bg-blue-900 flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Demo Guide</span>
        </button>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
