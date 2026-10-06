import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  BrainCircuit, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  Clock, 
  XCircle,
  HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  onStartLearning: () => void;
  onExploreTeacher: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartLearning, onExploreTeacher }) => {
  const [activeTab, setActiveTab] = useState<'traditional' | 'socratic'>('socratic');

  return (
    <div className="bg-[#f8fafc] text-slate-800">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200">
        {/* Soft background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/70 to-transparent pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                <span>The Anti-Answer Machine • Socratic AI Tutor</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 tracking-tight leading-[1.15]">
                Your personal AI teacher — <br />
                <span className="text-blue-700">not an answer machine.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                Learn through guidance, hints and practice instead of simply receiving the final answer. Master the concept and solve it yourself.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onStartLearning}
                  className="px-7 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 group"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-300 shadow-xs transition-colors"
                >
                  See How It Works
                </button>

                <button
                  onClick={onExploreTeacher}
                  className="px-5 py-3.5 text-blue-800 hover:text-blue-950 font-medium text-sm flex items-center gap-1.5 underline-offset-4 hover:underline"
                >
                  <span>Teacher & Faculty Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>School & College Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Educators & Teachers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Academic Institutions</span>
                </div>
              </div>

            </div>

            {/* Right Column: Teacher Preview Classroom Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
                
                {/* Classroom Card Header */}
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl">
                      👩‍🏫
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-tight">SocraticAI Tutor</div>
                      <div className="text-[11px] text-blue-200">Your Personal Learning Guide</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Live Session
                  </span>
                </div>

                {/* Simulated Conversation Feed */}
                <div className="p-5 space-y-4 text-xs bg-slate-50/50">
                  
                  {/* Student query */}
                  <div className="flex justify-end">
                    <div className="bg-blue-900 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs max-w-[85%] shadow-xs">
                      <p className="font-semibold text-[11px] opacity-80 mb-0.5">Student</p>
                      Can you solve 2x + 5 = 15?
                    </div>
                  </div>

                  {/* Socratic Teacher Response */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm shrink-0">
                      👩‍🏫
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-xs max-w-[90%] shadow-xs space-y-2">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Socratic Guide</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Absolutely! Let's work through it together. 😊
                      </p>
                      <p className="text-slate-800 font-medium">
                        First, look at the left side of the equation. What operation could we use to remove the <strong>+5</strong>?
                      </p>
                    </div>
                  </div>

                  {/* Student Response */}
                  <div className="flex justify-end">
                    <div className="bg-blue-900 text-white px-4 py-2 rounded-2xl rounded-tr-xs max-w-[80%] shadow-xs">
                      Subtract 5.
                    </div>
                  </div>

                  {/* Teacher Feedback & Next Step */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm shrink-0">
                      👩‍🏫
                    </div>
                    <div className="bg-emerald-50/80 border border-emerald-200 px-4 py-3 rounded-2xl rounded-tl-xs max-w-[90%] shadow-xs space-y-1.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>✓ That's the right approach!</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Whatever we do to one side, we must do to the other side too. What do you get after subtracting 5?
                      </p>
                    </div>
                  </div>

                </div>

                {/* Footer preview action */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Tiered Hint System Available
                  </span>
                  <button 
                    onClick={onStartLearning}
                    className="text-blue-700 font-bold hover:text-blue-950 flex items-center gap-1"
                  >
                    Try it live <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* The Socratic Contrast: Traditional Chatbot vs SocraticAI */}
      <section id="how-it-works" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-blue-950 tracking-tight">
              Why "Answer Machines" Fail Students
            </h2>
            <p className="mt-3 text-slate-600 text-base leading-relaxed">
              When AI bots immediately spit out the final answer, students bypass the cognitive struggle where actual learning and neural wiring occur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Generic Chatbot Card */}
            <div className="border border-red-200 bg-red-50/20 rounded-2xl p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Generic AI Chatbot
                </span>
                <span className="text-xs font-semibold text-slate-500">Zero Retention</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Passive Answer Spitter</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Immediately solves the math problem, writes the essay, or outputs the code. The student copies the answer and remains unable to solve it on an exam.
              </p>
              <div className="bg-white rounded-xl p-4 border border-red-200 font-mono text-xs text-slate-700 space-y-1">
                <div className="text-red-500 font-bold font-sans">Chatbot:</div>
                <div className="text-slate-500 italic">"Here is the answer: x = 5. Step 1: subtract 5. Step 2: divide by 2."</div>
                <div className="text-red-600 font-sans text-[11px] pt-1">❌ Student did 0% of the cognitive work.</div>
              </div>
            </div>

            {/* SocraticAI Card */}
            <div className="border-2 border-blue-600 bg-blue-50/30 rounded-2xl p-6 relative shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-900 text-white">
                  <Award className="w-4 h-4 text-blue-200" />
                  SocraticAI Digital Teacher
                </span>
                <span className="text-xs font-bold text-blue-700">100% Concept Mastery</span>
              </div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">Active Cognitive Guide</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Asks patient Socratic questions, diagnoses misunderstandings, provides scaffolded 3-tier hints, and praises genuine self-discovery.
              </p>
              <div className="bg-white rounded-xl p-4 border border-blue-200 font-mono text-xs text-slate-700 space-y-1">
                <div className="text-blue-900 font-bold font-sans">SocraticAI:</div>
                <div className="text-slate-700">"What operation could remove the +5 from the left side?"</div>
                <div className="text-emerald-700 font-sans text-[11px] font-bold pt-1">✓ Student identifies the rule and solves it independently.</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Core Educational Pillars */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-blue-950">
              Built on Proven Pedagogical Principles
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Engineered to replicate the finest classroom 1-on-1 tutoring methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Socratic Inquiry</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Asks guiding questions one step at a time, leading students to uncover mathematical logic without frustration.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">3-Tier Hint Ladder</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never leaps to the answer. Tier 1 gives a conceptual nudge, Tier 2 suggests strategy, and Tier 3 gives actionable cues.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Teacher Feedback</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Replaces harsh "Wrong" with constructive analysis: "Good attempt! Let's inspect how you handled the +5."
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Faculty Insights</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teachers see systemic misconception analytics, students needing support, and topic-level mastery rates.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience a digital teacher that truly teaches?
          </h2>
          <p className="text-blue-200 text-base max-w-xl mx-auto">
            Try the interactive Socratic session now. Step through algebra, physics, or chemistry with patient guidance.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={onStartLearning}
              className="px-8 py-3.5 rounded-xl bg-white text-blue-950 font-bold hover:bg-blue-50 shadow-lg transition-all"
            >
              Start Learning Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
