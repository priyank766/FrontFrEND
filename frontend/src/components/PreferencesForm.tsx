import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Palette, Accessibility, Zap, Smartphone, Settings } from "lucide-react";

interface PreferencesFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  onBack: () => void;
  repoUrl: string;
}

export interface UserPreferences {
  improvements: string[];
  theme: string;
  priority: string;
  additionalDetails: string;
}

const improvementOptions = [
  {
    id: "ui-cleanup",
    label: "UI Cleanups",
    description: "Improve visual hierarchy, spacing, and modern design patterns",
    icon: Palette,
  },
  {
    id: "responsive",
    label: "Responsive Fixes",
    description: "Optimize layouts for mobile and tablet devices",
    icon: Smartphone,
  },
  {
    id: "accessibility",
    label: "Accessibility",
    description: "Add WCAG compliance and screen reader support",
    icon: Accessibility,
  },
  {
    id: "performance",
    label: "Performance",
    description: "Optimize loading times and Core Web Vitals",
    icon: Zap,
  },
];

const themeOptions = [
  { id: "light", label: "Light", description: "Clean and minimal light theme" },
  { id: "dark", label: "Dark", description: "Modern dark theme with good contrast" },
  { id: "neutral", label: "Auto", description: "Adapts to system preference" },
];

export const PreferencesForm = ({ onSubmit, onBack, repoUrl }: PreferencesFormProps) => {
  const [improvements, setImprovements] = useState<string[]>(["ui-cleanup"]);
  const [theme, setTheme] = useState("neutral");
  const [priority, setPriority] = useState("balanced");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleImprovementChange = (improvementId: string, checked: boolean) => {
    if (checked) {
      setImprovements([...improvements, improvementId]);
    } else {
      setImprovements(improvements.filter(id => id !== improvementId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ improvements, theme, priority, additionalDetails });
  };

  const repoName = repoUrl.split("/").pop() || "repository";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Global background is now handled by CSS */}
      
      {/* Back Button - Top Left */}
      <div className="absolute top-8 left-8 z-20">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="btn-ghost group"
        >
          <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Repository
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold text-headline-dark tracking-tight">
              Customize Your Improvements
            </h2>
            <p className="text-xl text-body-dark">
              Configure AI analysis settings for <span className="font-mono font-semibold text-[#FF7A2B]">{repoName}</span>
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2 h-full">
              {/* Improvement Types */}
              <Card className="glass-card animate-scale-in hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-[#FF7A2B] to-[#FF9C57] flex items-center justify-center shadow-lg">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-headline-dark">Improvement Areas</h3>
                    <p className="text-body-dark text-sm">Select the types of improvements you want AI to focus on</p>
                  </div>
                  
                  <div className="space-y-4">
                    {improvementOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <Label
                          key={option.id}
                          htmlFor={option.id}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/5"
                        >
                          <Checkbox
                            id={option.id}
                            checked={improvements.includes(option.id)}
                            onCheckedChange={(checked) =>
                              handleImprovementChange(option.id, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4 text-[#FF7A2B]" />
                              <span className="text-sm font-medium text-headline-dark">
                                {option.label}
                              </span>
                            </div>
                            <p className="text-xs text-body-dark">
                              {option.description}
                            </p>
                          </div>
                        </Label>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Details */}
              <Card className="glass-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-[#FF9C57] to-[#FFC79A] flex items-center justify-center shadow-lg">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-headline-dark">Additional Details</h3>
                    <p className="text-body-dark text-sm">Provide any specific details or instructions for the AI</p>
                  </div>
                  
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="details" className="text-headline-dark">Your Details</Label>
                    <Textarea
                      placeholder="e.g., 'Ensure the navigation bar is sticky on scroll', 'Prioritize dark mode styling', 'Focus on optimizing image loading'"
                      id="details"
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      className="bg-white/5 border-white/10 text-headline-dark placeholder:text-body-dark"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Theme & Priority Settings */}
            <div className="space-y-6 animate-slide-in lg:col-span-3 h-full">
              {/* Theme Preference */}
              <Card className="glass-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-[#FFC79A] to-[#FF7A2B] flex items-center justify-center shadow-lg">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-headline-dark">Theme Preference</h3>
                    <p className="text-body-dark text-sm">Choose the color scheme for your improved frontend</p>
                  </div>
                  
                  <RadioGroup value={theme} onValueChange={setTheme} className="space-y-3">
                    {themeOptions.map((option) => (
                      <Label
                        key={option.id}
                        htmlFor={`theme-${option.id}`}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/5"
                      >
                        <RadioGroupItem value={option.id} id={`theme-${option.id}`} />
                        <div className="flex-1">
                          <span className="font-medium text-headline-dark">
                            {option.label}
                          </span>
                          <p className="text-xs text-body-dark">
                            {option.description}
                          </p>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Priority Setting */}
              <Card className="glass-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-[#FF7A2B] to-[#FF9C57] flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-headline-dark">Improvement Priority</h3>
                    <p className="text-body-dark text-sm">Set the focus level for AI analysis</p>
                  </div>
                  
                  <RadioGroup value={priority} onValueChange={setPriority} className="space-y-3">
                    <Label
                      htmlFor="priority-conservative"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/5"
                    >
                      <RadioGroupItem value="conservative" id="priority-conservative" />
                      <div className="flex-1">
                        <span className="font-medium text-headline-dark">
                          Conservative
                        </span>
                        <p className="text-xs text-body-dark">
                          Minimal changes, preserve existing design
                        </p>
                      </div>
                    </Label>
                    <Label
                      htmlFor="priority-balanced"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/5"
                    >
                      <RadioGroupItem value="balanced" id="priority-balanced" />
                      <div className="flex-1">
                        <span className="font-medium text-headline-dark">
                          Balanced
                        </span>
                        <p className="text-xs text-body-dark">
                          Good mix of improvements without major overhauls
                        </p>
                      </div>
                    </Label>
                    <Label
                      htmlFor="priority-aggressive"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/5"
                    >
                      <RadioGroupItem value="aggressive" id="priority-aggressive" />
                      <div className="flex-1">
                        <span className="font-medium text-headline-dark">
                          Aggressive
                        </span>
                        <p className="text-xs text-body-dark">
                          Maximum improvements, modern redesign
                        </p>
                      </div>
                    </Label>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={improvements.length === 0}
              className="btn-primary group"
            >
              Start AI Analysis
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};
