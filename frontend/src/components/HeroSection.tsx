import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, Zap, Code, Palette } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Global background is now handled by CSS */}
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="text-center md:text-left space-y-8 animate-fade-in">
              <div className="space-y-6">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF7A2B] to-[#FF9C57] flex items-center justify-center shadow-lg animate-glow">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF9C57] to-[#FFC79A] flex items-center justify-center shadow-lg animate-glow" style={{ animationDelay: '0.5s' }}>
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FFC79A] to-[#FF7A2B] flex items-center justify-center shadow-lg animate-glow" style={{ animationDelay: '1s' }}>
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-bold text-headline-dark tracking-tight leading-tight">
                  Front FrEND
                </h1>
                <p className="text-2xl lg:text-3xl text-body-dark font-medium max-w-3xl mx-auto md:mx-0">
                  AI-Powered Frontend Enhancement & Design System
                </p>
                <p className="text-lg text-body-dark max-w-2xl mx-auto md:mx-0">
                  Transform your frontend code with intelligent analysis, automated improvements, and modern design systems.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="btn-primary text-lg px-8 py-4"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="btn-ghost text-lg px-8 py-4"
                  onClick={() => {
                    document.getElementById('project-details')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Column: Feature Cards */}
            <div className="space-y-6 animate-slide-in">
              <Card className="glass-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-left space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF7A2B] to-[#FF9C57] flex items-center justify-center flex-shrink-0">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-headline-dark">Code Analysis</h3>
                      <p className="text-body-dark">
                        Intelligent analysis of your frontend codebase with 50+ improvement suggestions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-left space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF9C57] to-[#FFC79A] flex items-center justify-center flex-shrink-0">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-headline-dark">Design System</h3>
                      <p className="text-body-dark">
                        Modern, cohesive design systems with beautiful color palettes and typography
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-left space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFC79A] to-[#FF7A2B] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-headline-dark">AI Enhancement</h3>
                      <p className="text-body-dark">
                        Automated code improvements and optimizations powered by advanced AI
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-orange">50+</div>
              <div className="text-body-dark text-sm">Analysis Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-orange">100%</div>
              <div className="text-body-dark text-sm">AI Powered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-orange">24/7</div>
              <div className="text-body-dark text-sm">Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-orange">∞</div>
              <div className="text-body-dark text-sm">Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#FF7A2B]/30 rounded-full animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};