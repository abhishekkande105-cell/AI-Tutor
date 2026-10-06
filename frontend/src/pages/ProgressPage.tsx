import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid, Legend 
} from 'recharts';
import { 
  Flame, 
  CheckCircle2, 
  Target, 
  Clock, 
  Lightbulb, 
  Award, 
  Compass, 
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { api } from '../services/api';
import { ProgressSummary } from '../types';

export const ProgressPage: React.FC = () => {
  const [data, setData] = useState<ProgressSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProg = async () => {
      try {
        setIsLoading(true);
        const res = await api.getProgress();
        setData(res);
      } catch (e) {
        console.error('Failed to load progress', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProg();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium text-sm">Aggregating pedagogical analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              My Learning Progress
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Active Term
            </span>
          </div>
          <p className="mt-1 text-slate-600 text-sm">
            Detailed breakdown of concept mastery, problem solving accuracy, and Socratic independence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-center">
            <span className="text-xs text-blue-700 font-semibold uppercase tracking-wider block">Overall Mastery</span>
            <span className="text-2xl font-black text-blue-950">{data.overall_progress}%</span>
          </div>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Progress</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{data.overall_progress}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold">▲ +4% this week</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{data.questions_completed}</div>
          <div className="text-[10px] text-slate-500 font-medium">Problems solved</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Accuracy</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{data.accuracy_pct}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold">High precision</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{data.learning_streak_days} <span className="text-sm font-semibold">Days</span></div>
          <div className="text-[10px] text-orange-600 font-semibold">🔥 Continuous daily flow</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Hints Used</span>
            <Lightbulb className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{data.hints_used}</div>
          <div className="text-[10px] text-slate-500 font-medium">Avg 0.29 per question</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Study Time</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{data.learning_time}</div>
          <div className="text-[10px] text-slate-500 font-medium">Active engagement</div>
        </div>

      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Subject Performance Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-base text-blue-950">Subject Performance</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Current Mastery vs Target</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.subject_performance} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="score" name="Your Mastery" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Course Target" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity Line/Area Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-700" />
              <h3 className="font-bold text-base text-blue-950">Weekly Learning Activity</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Minutes Studied</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weekly_activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(value: any, name: any) => [name === 'minutes' ? `${value} mins` : `${value} questions`, name === 'minutes' ? 'Active Time' : 'Questions']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="minutes" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMinutes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Topic Strength Breakdown & AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Topic Strengths List */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-base text-blue-950">Topic Strength & Diagnostics</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Benchmark Comparison</span>
          </div>

          <div className="space-y-4 pt-1">
            {data.topic_strength.map((t, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{t.topic}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Target: {t.benchmark}%</span>
                    <span className={`font-black ${t.mastery >= t.benchmark ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {t.mastery}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${t.mastery >= 75 ? 'bg-emerald-500' : t.mastery >= 60 ? 'bg-blue-600' : 'bg-amber-500'}`}
                    style={{ width: `${t.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Learning Recommendation Box */}
        <div className="lg:col-span-4 bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-800 text-blue-200 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-white">Teacher's Personalized Insight</h4>
            <p className="text-xs text-blue-100 leading-relaxed">
              {data.recommendation}
            </p>
          </div>

          <div className="pt-6 border-t border-blue-800/80">
            <div className="text-[11px] text-blue-300 font-medium">
              Socratic pedagogy adjusts prompt depth and hint scaffolding based on these metrics.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
