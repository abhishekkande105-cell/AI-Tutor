import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  RotateCcw,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { fireStudentCelebration } from '../components/Confetti';

interface PracticePageProps {
  initialTopicId?: number;
  onOpenTutorForHelp: (topicId: number, prompt: string) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({ initialTopicId, onOpenTutorForHelp }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Medium');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await api.getPracticeQuestions(initialTopicId, selectedDifficulty);
      setQuestions(res);
      setCurrentIndex(0);
      setUserAnswer('');
      setSubmissionResult(null);
      setRevealedHintIndex(-1);
    } catch (e) {
      console.error('Failed to load practice questions', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [initialTopicId, selectedDifficulty]);

  const currentQ = questions[currentIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQ || !userAnswer.trim()) return;

    try {
      const res = await api.submitPracticeAnswer(currentQ.id, userAnswer);
      setSubmissionResult(res);
      if (res.is_correct) {
        fireStudentCelebration();
      }
    } catch (err) {
      console.error('Submit error', err);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setSubmissionResult(null);
      setRevealedHintIndex(-1);
    } else {
      // Loop or restart
      setCurrentIndex(0);
      setUserAnswer('');
      setSubmissionResult(null);
      setRevealedHintIndex(-1);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Practice with Your Tutor
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
              Interactive Lab
            </span>
          </div>
          <p className="mt-1 text-slate-600 text-sm">
            Solve problems independently. Ask for hints or open the full Socratic Tutor whenever you need guidance.
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200">
          <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Retrieving curated problem sets...</p>
        </div>
      ) : !currentQ ? (
        <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-slate-200">
          <p className="text-slate-600 text-sm font-medium">No questions found for this difficulty. Try another tier!</p>
          <button 
            onClick={() => setSelectedDifficulty('Medium')}
            className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold"
          >
            Reset to Medium
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          
          {/* Card Top Strip */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-blue-900">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="text-slate-600 font-medium">{currentQ.subject_name} • {currentQ.topic_name}</span>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
              {currentQ.difficulty}
            </span>
          </div>

          {/* Question Prompt */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problem Statement</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {currentQ.prompt}
              </h2>
              <p className="text-xs text-slate-500 pt-1">
                <strong>Target Concept:</strong> {currentQ.target_concept}
              </p>
            </div>

            {/* Answer Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Your Solution / Final Answer</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="e.g. x = 5 or 4 m/s²"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    Check Answer
                  </button>
                </div>
              </div>
            </form>

            {/* Submission Feedback Banner */}
            {submissionResult && (
              <div 
                className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                  submissionResult.is_correct
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm flex items-center gap-2">
                    {submissionResult.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    )}
                    {submissionResult.feedback}
                  </span>
                  {submissionResult.is_correct && (
                    <button
                      onClick={handleNext}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
                    >
                      <span>Next Problem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs leading-relaxed opacity-90">{submissionResult.explanation}</p>
              </div>
            )}

            {/* Hint System */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Stuck? Use a progressive hint ladder</span>
                </span>
                <span className="text-[11px] text-slate-400">Never reveals the solution</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentQ.hints.map((hintText: string, hIdx: number) => {
                  const isRevealed = revealedHintIndex >= hIdx;
                  return (
                    <button
                      key={hIdx}
                      type="button"
                      onClick={() => setRevealedHintIndex(hIdx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isRevealed
                          ? 'bg-purple-100 text-purple-900 font-bold border border-purple-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isRevealed ? `Hint ${hIdx + 1} Revealed` : `Reveal Hint ${hIdx + 1}`}
                    </button>
                  );
                })}
              </div>

              {revealedHintIndex >= 0 && currentQ.hints[revealedHintIndex] && (
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 leading-relaxed font-medium animate-fadeIn">
                  <strong>💡 Hint {revealedHintIndex + 1} of 3:</strong> {currentQ.hints[revealedHintIndex]}
                </div>
              )}
            </div>

            {/* Need deeper help? Jump to Socratic Tutor */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Want step-by-step dialogue? Launch the Socratic tutor for this problem.
              </div>
              <button
                onClick={() => onOpenTutorForHelp(currentQ.topic_id, `Can you guide me on: ${currentQ.prompt}?`)}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Socratic Tutor</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
