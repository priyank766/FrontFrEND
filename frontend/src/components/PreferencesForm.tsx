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
  const [improvements, setImprovements] = useState<string[]>([]);
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
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
            Customize Your Improvements
          </h2>
          <p className="text-xl text-muted-foreground">
            Configure AI analysis settings for <span className="font-mono font-semibold">{repoName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Improvement Types */}
            <Card className="glass-card glow-subtle animate-scale-in interactive-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-primary" />
                  Improvement Areas
                </CardTitle>
                <CardDescription>
                  Select the types of improvements you want AI to focus on
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {improvementOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Label
                      key={option.id}
                      htmlFor={option.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
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
                          <IconComponent className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">
                            {option.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </Label>
                  );
                })}
              </CardContent>
            </Card>

            {/* Theme & Priority Settings */}
            <div className="space-y-6 animate-slide-in">
              {/* Theme Preference */}
              <Card className="glass-card glow-subtle interactive-glow">
                <CardHeader>
                  <CardTitle>Theme Preference</CardTitle>
                  <CardDescription>
                    Choose the color scheme for your improved frontend
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={theme} onValueChange={setTheme} className="space-y-3">
                    {themeOptions.map((option) => (
                      <Label
                        key={option.id}
                        htmlFor={`theme-${option.id}`}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <RadioGroupItem value={option.id} id={`theme-${option.id}`} />
                        <div className="flex-1">
                          <span className="font-medium">
                            {option.label}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Priority Setting */}
              <Card className="glass-card glow-subtle interactive-glow">
                <CardHeader>
                  <CardTitle>Improvement Priority</CardTitle>
                  <CardDescription>
                    Set the focus level for AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={priority} onValueChange={setPriority} className="space-y-3">
                    <Label
                      htmlFor="priority-conservative"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value="conservative" id="priority-conservative" />
                      <div className="flex-1">
                        <span className="font-medium">
                          Conservative
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Minimal changes, preserve existing design
                        </p>
                      </div>
                    </Label>
                    <Label
                      htmlFor="priority-balanced"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value="balanced" id="priority-balanced" />
                      <div className="flex-1">
                        <span className="font-medium">
                          Balanced
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Good mix of improvements without major overhauls
                        </p>
                      </div>
                    </Label>
                    <Label
                      htmlFor="priority-aggressive"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value="aggressive" id="priority-aggressive" />
                      <div className="flex-1">
                        <span className="font-medium">
                          Aggressive
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Maximum improvements, modern redesign
                        </p>
                      </div>
                    </Label>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Additional Details */}
              <Card className="glass-card glow-subtle interactive-glow">
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                  <CardDescription>
                    Provide any specific details or instructions for the AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="details">Your Details</Label>
                    <Textarea
                      placeholder="e.g., 'Ensure the navigation bar is sticky on scroll', 'Prioritize dark mode styling', 'Focus on optimizing image loading'"
                      id="details"
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="group"
            >
              <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Repository
            </Button>
            
            <Button 
              type="submit" 
              variant="hero" 
              size="lg"
              disabled={improvements.length === 0}
              className="group"
            >
              Start AI Analysis
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};