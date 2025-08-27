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
          <h2 className="text-4xl lg:text-5xl font-bold text-headline-dark">
            Connect Your Repository
          </h2>
          <p className="text-xl text-body-dark max-w-2xl mx-auto">
            Enter your GitHub repository URL to begin AI-powered frontend analysis and improvements.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Repository Input Form */}
            <Card className="glass-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2 animate-scale-in">
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-[#FF7A2B] to-[#FF9C57] flex items-center justify-center shadow-lg">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-headline-dark">Repository Details</h3>
                  <p className="text-body-dark text-sm">Provide your GitHub repository URL for analysis</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="repo-url" className="text-sm font-medium mb-2 block text-headline-dark">
                      GitHub Repository URL
                    </label>
                    <Input
                      id="repo-url"
                      type="url"
                      placeholder="https://github.com/username/repository"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="text-base bg-white/5 border-white/10 text-headline-dark placeholder:text-body-dark"
                    />
                    <p className="text-xs text-body-dark mt-2">
                      Make sure your repository is public or you have necessary permissions
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full group btn-primary"
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

                

                <Button
                  className="w-full btn-ghost"
                  onClick={onGitHubAuth}
                >
                  <Github className="mr-2 w-4 h-4" />
                  Connect with GitHub OAuth
                </Button>
              </CardContent>
            </Card>

            
          </div>

          {/* Right Column */}
          <div className="space-y-6 animate-slide-in">
            {/* What FrontFrEND Analyzes Card */}
            <Card className="glass-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-[#FF9C57] to-[#FFC79A] flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-headline-dark">What FrontFrEND Analyzes</h3>
                  <p className="text-body-dark text-sm">Comprehensive analysis of your frontend code</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF7A2B]/20 to-[#FF9C57]/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <Globe className="w-4 h-4 text-[#FF7A2B]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-headline-dark">UI/UX Improvements</h4>
                      <p className="text-sm text-body-dark">
                        Enhanced layouts, better color schemes, and improved user experience patterns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF9C57]/20 to-[#FFC79A]/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <Zap className="w-4 h-4 text-[#FF9C57]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-headline-dark">Performance Optimization</h4>
                      <p className="text-sm text-body-dark">
                        Faster loading times, optimized assets, and improved Core Web Vitals
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FFC79A]/20 to-[#FF7A2B]/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <Lock className="w-4 h-4 text-[#FFC79A]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-headline-dark">Accessibility Fixes</h4>
                      <p className="text-sm text-body-dark">
                        WCAG compliance, screen reader support, and inclusive design patterns
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};