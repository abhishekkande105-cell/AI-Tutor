import React from 'react';
import { CheckCircle2, Lightbulb, Search, Sparkles, Award } from 'lucide-react';
import { FeedbackType } from '../types';

interface FeedbackBadgeProps {
  type: FeedbackType;
}

export const FeedbackBadge: React.FC<FeedbackBadgeProps> = ({ type }) => {
  if (type === 'NORMAL') return null;

  switch (type) {
    case 'CORRECT':
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>✓ That's the right approach</span>
        </div>
      );
    case 'GUIDANCE':
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm animate-fadeIn">
          <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
          <span>💡 Good idea — take the next step</span>
        </div>
      );
    case 'CHECK_STEP':
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm animate-fadeIn">
          <Search className="w-3.5 h-3.5 text-amber-600" />
          <span>🔎 Let's check that step again</span>
        </div>
      );
    case 'SOLVED':
      return (
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-sm animate-bounce">
          <Award className="w-4 h-4 text-amber-600" />
          <span>🌟 Great job! You solved it yourself</span>
        </div>
      );
    case 'ENCOURAGEMENT':
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>✓ Excellent thinking!</span>
        </div>
      );
    case 'HINT':
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 shadow-sm">
          <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
          <span>Teacher Hint</span>
        </div>
      );
    default:
      return null;
  }
};
