import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Atom, 
  FlaskConical, 
  Code2, 
  Microscope, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Target,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { Subject } from '../types';

interface SubjectsPageProps {
  onStartTutor: (topicId?: number, initialPrompt?: string) => void;
  onStartPractice: (topicId?: number) => void;
}

export const SubjectsPage: React.FC<SubjectsPageProps> = ({ onStartTutor, onStartPractice }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const iconMap: Record<string, any> = {
    Calculator,
    Atom,
    FlaskConical,
    Code2,
    Microscope,
  };

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        setIsLoading(true);
        const res = await api.getSubjects();
        setSubjects(res);
      } catch (err) {
        console.error('Failed to load subjects', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubs();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium text-sm">Loading curriculum subjects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            My Subjects
          </h1>
          <p className="mt-1 text-slate-600 text-sm">
            Explore subjects, review curriculum topics, and practice with your Socratic AI guide.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200">
          5 Enrolled Disciplines
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-6">
        {subjects.map((sub) => {
          const Icon = iconMap[sub.icon] || Calculator;

          return (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-card transition-all p-6 space-y-6"
            >
              {/* Subject Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: sub.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{sub.name}</h2>
                    <p className="text-xs text-slate-500">{sub.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-semibold block uppercase">Mastery</span>
                    <span className="text-xl font-black text-slate-900">{sub.progress}%</span>
                  </div>

                  <div className="w-28 sm:w-36 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${sub.progress}%`, backgroundColor: sub.color }}
                    />
                  </div>
                </div>
              </div>

              {/* Topics Grid within Subject */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Curriculum Topics
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sub.topics.map((top) => (
                    <div
                      key={top.id}
                      className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                            {top.difficulty}
                          </span>
                          <span className="text-[11px] font-bold text-blue-900">
                            {top.mastery_score || 65}%
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs text-slate-900">{top.name}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{top.description}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                        <button
                          onClick={() => onStartTutor(top.id)}
                          className="flex-1 py-1.5 px-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-blue-200" />
                          <span>AI Tutor</span>
                        </button>
                        <button
                          onClick={() => onStartPractice(top.id)}
                          className="py-1.5 px-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Practice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
