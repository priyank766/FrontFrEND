import { Button } from "@/components/ui/button";
import { Github, Sparkles, Zap, Code, GitPullRequest } from "lucide-react";
import heroImage from "@/assets/hero-image-vibrant.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img 
        src={heroImage} 
        alt="Vibrant abstract background" 
        className="absolute inset-0 w-full h-full object-cover opacity-90" 
      />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px] animate-float" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Hero Content */}
        <div className="text-center lg:text-left space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              FrontFr
              <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                END
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-2xl">
              AI-powered frontend improvements for your GitHub repositories
            </p>
          </div>
          
          <p className="text-lg text-blue-200/80 max-w-xl leading-relaxed">
            Transform your frontend code with intelligent AI analysis, automated improvements, 
            and seamless GitHub integration. Get better UX, performance, and accessibility in minutes.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap gap-4 text-sm text-blue-200/90">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Repo Analysis
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Suggestions
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Live Preview
            </div>
            <div className="flex items-center gap-2">
              <GitPullRequest className="w-4 h-4" />
              Automated PR
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={onGetStarted}
              className="group relative overflow-hidden"
            >
              <Github className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Try with your GitHub Repo
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full" />
            </Button>
            
            
          </div>
        </div>
        
        {/* Empty div to maintain layout */}
        <div></div>
      </div>
    </section>
  );
};