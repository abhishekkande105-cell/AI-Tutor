import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  TrendingUp, 
  HelpCircle, 
  X,
  BookOpen,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { api } from '../services/api';
import { StudentSupportProfile, CommonMistake } from '../types';

export const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [supportStudents, setSupportStudents] = useState<StudentSupportProfile[]>([]);
  const [commonMistakes, setCommonMistakes] = useState<CommonMistake[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentSupportProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        setIsLoading(true);
        const [dashRes, studRes, suppRes, mistRes] = await Promise.all([
          api.getTeacherDashboard(),
          api.getTeacherStudents(),
          api.getStudentsNeedingSupport(),
          api.getCommonMistakes()
        ]);
        setStats(dashRes);
        setStudents(studRes);
        setSupportStudents(suppRes);
        setCommonMistakes(mistRes);
      } catch (err) {
        console.error('Failed to load teacher dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeacherData();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium text-sm">Loading Teacher Management Console...</p>
      </div>
    );
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.primary_subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Teacher Dashboard
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
              STEM Faculty Portal
            </span>
          </div>
          <p className="mt-1 text-slate-600 text-sm">
            “Monitor learning. Understand students. Improve outcomes.”
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Cohort Sync Active</span>
        </div>
      </div>

      {/* 4 Primary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.metrics.total_students}</div>
          <div className="text-xs text-slate-500">Enrolled in tutoring tracks</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Today</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.metrics.active_today}</div>
          <div className="text-xs text-emerald-700 font-semibold">65.6% daily attendance</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Average Accuracy</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.metrics.average_accuracy}%</div>
          <div className="text-xs text-slate-500">Across all problem attempts</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Questions Attempted</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats.metrics.questions_attempted.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">Autonomous Socratic steps</div>
        </div>

      </div>

      {/* Highlighted Section: Students Needing Support */}
      <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Students Needing Support</h2>
              <p className="text-xs text-slate-500">
                AI diagnostic flag: Students struggling with specific step-level misconceptions
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 self-start sm:self-auto">
            3 Priority Interventions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportStudents.map((stud) => (
            <div 
              key={stud.id}
              className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={stud.avatar} 
                      alt={stud.name} 
                      className="w-9 h-9 rounded-full bg-white border border-amber-300"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900">{stud.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{stud.subject} • {stud.topic}</div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-red-600 bg-red-100 px-2 py-0.5 rounded">
                    {stud.accuracy}%
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  <strong>Struggle:</strong> {stud.struggle_area}
                </p>
              </div>

              <button
                onClick={() => setSelectedStudent(stud)}
                className="w-full py-2 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>View Progress</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Common Mistakes Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Common Mistakes Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-base text-blue-950">Common Algebra & Science Mistakes</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Systemic Error Patterns</span>
          </div>

          <p className="text-xs text-slate-600">
            Identified automatically across student Socratic sessions to help educators adapt classroom lectures.
          </p>

          <div className="space-y-3 pt-1">
            {commonMistakes.map((mistake, idx) => (
              <div 
                key={mistake.id || idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-900 text-xs">#{idx + 1}</span>
                    <span className="font-bold text-slate-900">{mistake.category}</span>
                  </div>
                  <span className="font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                    {mistake.percentage}% of attempts
                  </span>
                </div>
                <p className="text-xs text-slate-600">{mistake.description}</p>
                {mistake.tip && (
                  <div className="text-[11px] text-blue-800 font-medium pt-1 flex items-center gap-1">
                    <span className="font-bold">Pedagogical Fix:</span> {mistake.tip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Topic Performance List */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-base text-blue-950">Curriculum Topic Health</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Avg Accuracy</span>
          </div>

          <div className="space-y-3 pt-1">
            {stats.topic_performance.map((tp: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{tp.topic}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    tp.avg_accuracy >= 80 ? 'bg-emerald-100 text-emerald-800' :
                    tp.avg_accuracy >= 65 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tp.avg_accuracy}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{tp.students_count} students enrolled</span>
                  <span className="italic">{tp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Student Cohort Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-blue-950">Student Performance Directory</h3>
            <p className="text-xs text-slate-500">Individual cognitive analytics and problem accuracy</p>
          </div>

          {/* Search filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student or subject..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Problems Solved</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                  <td className="py-3 px-4">{s.primary_subject}</td>
                  <td className="py-3 px-4">{s.grade}</td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${s.avg_accuracy >= 80 ? 'text-emerald-700' : s.avg_accuracy >= 60 ? 'text-blue-700' : 'text-red-600'}`}>
                      {s.avg_accuracy}%
                    </span>
                  </td>
                  <td className="py-3 px-4">{s.questions_done}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      s.status === 'Thriving' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      s.status === 'On Track' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => setSelectedStudent({
                        id: s.id,
                        name: s.name,
                        subject: s.primary_subject,
                        topic: 'Comprehensive Track',
                        accuracy: s.avg_accuracy,
                        struggle_area: s.avg_accuracy < 60 ? 'Requires foundational review on inverse operations' : 'Maintaining strong conceptual consistency',
                        recent_attempts: s.questions_done,
                        recommended_action: s.avg_accuracy < 60 ? 'Assign targeted scaffolded practice sets' : 'Encourage advanced application modules',
                        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${s.name}`
                      })}
                      className="text-blue-700 hover:text-blue-900 font-semibold"
                    >
                      View Diagnostics
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* "View Progress" Inspection Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-elevated p-6 space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedStudent.avatar} 
                  alt={selectedStudent.name} 
                  className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200"
                />
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-500">{selectedStudent.subject} • {selectedStudent.topic}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium block">Current Accuracy</span>
                  <span className={`text-xl font-black ${selectedStudent.accuracy < 60 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {selectedStudent.accuracy}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium block">Recent Questions Attempted</span>
                  <span className="text-xl font-black text-slate-900">{selectedStudent.recent_attempts}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 space-y-1">
                <span className="font-bold text-red-900 block">Diagnosed Struggle Area:</span>
                <p className="text-slate-700">{selectedStudent.struggle_area}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                <span className="font-bold text-blue-900 block">Recommended Teacher Action:</span>
                <p className="text-slate-700">{selectedStudent.recommended_action}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Close Diagnostics
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
