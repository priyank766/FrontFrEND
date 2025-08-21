import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Code, Sparkles, Zap, GitBranch, CheckCircle } from "lucide-react";

interface ProcessingStatusProps {
  onComplete: () => void;
}

const processingSteps = [
  {
    id: "clone",
    label: "Cloning repository...",
    description: "Securely downloading your repository files",
    icon: GitBranch,
    duration: 2000,
  },
  {
    id: "analyze",
    label: "Analyzing frontend files...",
    description: "Scanning HTML, CSS, and JavaScript for improvements",
    icon: Code,
    duration: 3000,
  },
  {
    id: "ai",
    label: "Running AI agents...",
    description: "Applying machine learning models for optimization",
    icon: Sparkles,
    duration: 4000,
  },
  {
    id: "generate",
    label: "Generating improved frontend...",
    description: "Creating enhanced versions of your components",
    icon: Zap,
    duration: 2500,
  },
  {
    id: "complete",
    label: "Analysis complete!",
    description: "Ready to preview your improvements",
    icon: CheckCircle,
    duration: 500,
  },
];

export const ProcessingStatus = ({ onComplete }: ProcessingStatusProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStep >= processingSteps.length) {
      onComplete();
      return;
    }

    const step = processingSteps[currentStep];
    const progressIncrement = 100 / processingSteps.length;
    const startProgress = currentStep * progressIncrement;
    const endProgress = (currentStep + 1) * progressIncrement;

    // Animate progress for current step
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= endProgress) {
          clearInterval(progressInterval);
          // Move to next step after a delay
          setTimeout(() => {
            setCurrentStep(prev => prev + 1);
          }, 200);
          return endProgress;
        }
        return newProgress;
      });
    }, step.duration / (endProgress - startProgress));

    return () => clearInterval(progressInterval);
  }, [currentStep, onComplete]);

  const currentStepData = processingSteps[currentStep] || processingSteps[processingSteps.length - 1];
  const IconComponent = currentStepData.icon;

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-12">
        {/* Header */}
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
            AI Analysis in Progress
          </h2>
          <p className="text-xl text-muted-foreground">
            Our AI agents are analyzing your repository and generating improvements
          </p>
        </div>

        {/* Processing Card */}
        <Card className="glass-card glow-subtle animate-scale-in interactive-glow">
          <CardContent className="p-8 space-y-8">
            {/* Current Step Indicator */}
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center animate-glow">
                <IconComponent className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-semibold">{currentStepData.label}</h3>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {Math.min(currentStep + 1, processingSteps.length)} of {processingSteps.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
              {processingSteps.slice(0, -1).map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center space-y-2 transition-all duration-300 ${
                      isCompleted 
                        ? "text-primary" 
                        : isCurrent 
                          ? "text-primary animate-pulse" 
                          : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-primary border-primary text-white"
                          : isCurrent
                            ? "border-primary bg-primary/10"
                            : "border-muted"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <StepIcon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs text-center leading-tight">
                      {step.label.replace("...", "")}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Fun Fact */}
        <Card className="bg-muted/50 border-dashed animate-float">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Did you know?</strong> Our AI analyzes over 50 different aspects of your frontend, 
              from accessibility patterns to performance optimizations.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};