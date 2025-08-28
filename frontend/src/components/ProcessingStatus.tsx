import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code, Sparkles, Zap, GitBranch, CheckCircle, Loader2, TrendingUp } from "lucide-react";

interface ProcessingStatusProps {
  onComplete: () => void;
  messages: string[];
  progress: number;
}

export const ProcessingStatus = ({ onComplete, messages, progress }: ProcessingStatusProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);

  const phases = [
    { name: "Analyzing Repository", icon: GitBranch, color: "from-blue-500 to-blue-600" },
    { name: "Detecting UI Components", icon: Code, color: "from-purple-500 to-purple-600" },
    { name: "Generating Improvements", icon: Sparkles, color: "from-orange-500 to-orange-600" },
    { name: "Optimizing Code", icon: Zap, color: "from-green-500 to-green-600" },
    { name: "Finalizing Changes", icon: CheckCircle, color: "from-emerald-500 to-emerald-600" }
  ];

  useEffect(() => {
    // Determine current phase based on progress
    const phaseIndex = Math.floor((progress / 100) * phases.length);
    setCurrentPhase(Math.min(phaseIndex, phases.length - 1));
    
    // Calculate phase-specific progress
    const phaseProgressPercent = ((progress % 20) / 20) * 100;
    setPhaseProgress(phaseProgressPercent);

    if (progress >= 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Global background is now handled by CSS */}
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {/* Main Card with glass effect */}
          <Card className="glass-card">
            <CardContent className="p-12 text-center space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A2B] to-[#FF9C57] rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-[#FF7A2B] animate-spin" />
                    </div>
                  </div>
                  <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-[#FF7A2B]/20 to-[#FF9C57]/20 rounded-full blur-xl animate-pulse"></div>
                </div>
                <h2 className="text-4xl font-bold text-headline-dark tracking-tight">
                  AI Analysis in Progress
                </h2>
                <p className="text-body-dark text-lg">
                  Our AI agents are analyzing your repository and generating improvements
                </p>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-6 text-left">
                {/* Current Phase Card */}
                <Card className="glass-card">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${phases[currentPhase].color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      {React.createElement(phases[currentPhase].icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-headline-dark">
                        {phases[currentPhase].name}
                      </h3>
                      <p className="text-body-dark text-sm">
                        Phase {currentPhase + 1} of {phases.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Overall Progress Card */}
                <Card className="glass-card">
                  <CardContent className="p-6 space-y-2">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-[#FF7A2B] to-[#FF9C57] flex items-center justify-center shadow-lg flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-headline-dark">Overall Progress</h3>
                          <p className="text-body-dark text-sm">Complete analysis progress</p>
                        </div>
                      </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-body-dark">Progress</span>
                      <span className="text-headline-dark font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative">
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#FF7A2B] to-[#FF9C57] rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div 
                        className="absolute top-0 h-3 bg-gradient-to-r from-[#FF7A2B]/30 to-[#FF9C57]/30 rounded-full blur-sm transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Phase Progress Card */}
                <Card className="glass-card">
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-[#FF9C57] to-[#FFC79A] flex items-center justify-center shadow-lg flex-shrink-0">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-headline-dark">Current Phase</h3>
                        <p className="text-body-dark text-sm">Phase-specific progress</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-body-dark">Phase Progress</span>
                      <span className="text-headline-dark font-semibold">{Math.round(phaseProgress)}%</span>
                    </div>
                    <div className="relative">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#FFC79A] to-[#FF9C57] rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${phaseProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fun Fact Card */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-[#FFC79A] to-[#FF7A2B] flex items-center justify-center shadow-lg flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-headline-dark">Did You Know?</h3>
                        <p className="text-body-dark text-sm">Interesting facts about our AI analysis</p>
                      </div>
                    </div>
                    <p className="text-body-dark text-sm text-left">
                      Our AI analyzes over 50 different aspects of your frontend,
                      from accessibility patterns to performance optimizations.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#FF7A2B]/30 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};