import React, { useState, useEffect } from 'react';
import { 
  History, 
  CheckCircle2, 
  Lightbulb, 
  Clock, 
  Award, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { LearningHistoryItem } from '../types';

interface HistoryPageProps {
  onRevisitTopic?: (topicId: number) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onRevisitTopic }) => {
  const [historyItems, setHistoryItems] = useState<LearningHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await api.getHistory();
        setHistoryItems(res);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium text-sm">Loading learning history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Learning History
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
              Verified Timeline
            </span>
          </div>
          <p className="mt-1 text-slate-600 text-sm">
            Chronological record of your problem sessions, hints utilized, and Socratic achievements.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
          {historyItems.length} Completed Milestones
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative border-l-2 border-blue-200 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
        {historyItems.map((item) => (
          <div key={item.id} className="relative group">
            
            {/* Timeline Bullet Node */}
            <div className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-blue-900 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-900"></span>
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-card transition-all p-5 sm:p-6 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-900 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {item.period}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• {item.date_display}</span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ✓ {item.status}
                  </span>
                  <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                    Score: {item.score}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {item.subject} — {item.topic}
                </h3>
                <p className="text-xs text-slate-600 font-mono mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200 inline-block">
                  “{item.problem}”
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <strong>{item.hints_used}</strong> {item.hints_used === 1 ? 'hint' : 'hints'} used
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {item.time_spent}
                  </span>
                </div>

                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {item.outcome}
                </span>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
