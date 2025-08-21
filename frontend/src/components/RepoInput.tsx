import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, ArrowRight, Globe, Lock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { ArrowLeft } from "lucide-react";
interface RepoInputProps {
  onSubmit: (repoUrl: string) => void;
  onGitHubAuth: () => void;
  onBack: () => void;
}

export const RepoInput = ({ onSubmit, onGitHubAuth, onBack }: RepoInputProps) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoUrl.trim()) {
      toast({
        title: "Repository URL Required",
        description: "Please enter a valid GitHub repository URL.",
        variant: "destructive",
      });
      return;
    }

    if (!repoUrl.includes("github.com")) {
      toast({
        title: "Invalid Repository",
        description: "Please enter a valid GitHub repository URL.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSubmit(repoUrl);
    }, 1000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4 relative"> {/* Added relative */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="absolute top-4 left-4 lg:top-6 lg:left-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
            Connect Your Repository
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your GitHub repository URL to begin AI-powered frontend analysis and improvements.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Repository Input Form */}
        <Card className="glass-card glow-subtle animate-scale-in interactive-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-6 h-6 text-primary" />
                Repository Details
              </CardTitle>
              <CardDescription>
                Provide your GitHub repository URL for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="repo-url" className="text-sm font-medium mb-2 block">
                    GitHub Repository URL
                  </label>
                  <Input
                    id="repo-url"
                    type="url"
                    placeholder="https://github.com/username/repository"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="text-base"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Make sure your repository is public or you have necessary permissions
                  </p>
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Analyzing Repository...
                    </>
                  ) : (
                    <>
                      Analyze Repository
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full"
                onClick={onGitHubAuth}
              >
                <Github className="mr-2 w-4 h-4" />
                Connect with GitHub OAuth
              </Button>
            </CardContent>
          </Card>

          {/* Features & Benefits */}
          <div className="space-y-6 animate-slide-in">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">What FrontFrEND Analyzes</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">UI/UX Improvements</h4>
                    <p className="text-sm text-muted-foreground">
                      Enhanced layouts, better color schemes, and improved user experience patterns
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mt-1">
                    <Zap className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium">Performance Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Faster loading times, optimized assets, and improved Core Web Vitals
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-light/10 flex items-center justify-center mt-1">
                    <Lock className="w-4 h-4 text-primary-light" />
                  </div>
                  <div>
                    <h4 className="font-medium">Accessibility Fixes</h4>
                    <p className="text-sm text-muted-foreground">
                      WCAG compliance, screen reader support, and inclusive design patterns
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-muted/50 border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Your repository data is processed securely and never stored permanently</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};