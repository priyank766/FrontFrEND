import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, Palette, Code } from "lucide-react";

export const ProjectDetails = () => {
  return (
    <section id="project-details" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="glass-card">
          <CardContent className="p-12">
            <h2 className="text-4xl font-bold text-center mb-12 text-headline-dark">About FrontFrEND</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <p className="text-lg text-body-dark">
                  FrontFrEND is an AI-powered tool designed to help developers improve their frontend code. It analyzes your GitHub repository, suggests improvements, and can even generate a new design system for your project.
                </p>
                <p className="text-lg text-body-dark">
                  Our goal is to make frontend development faster, easier, and more efficient by leveraging the power of artificial intelligence.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF7A2B]/20 to-[#FF9C57]/20 flex items-center justify-center flex-shrink-0">
                    <Code className="w-6 h-6 text-[#FF7A2B]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-headline-dark">Automated Code Analysis</h4>
                    <p className="text-sm text-body-dark">In-depth analysis of your HTML, CSS, and JavaScript.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF9C57]/20 to-[#FFC79A]/20 flex items-center justify-center flex-shrink-0">
                    <Palette className="w-6 h-6 text-[#FF9C57]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-headline-dark">UI/UX Improvements</h4>
                    <p className="text-sm text-body-dark">Suggestions for better layouts, colors, and user experience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFC79A]/20 to-[#FF7A2B]/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-[#FFC79A]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-headline-dark">Performance Audits</h4>
                    <p className="text-sm text-body-dark">Identify and fix performance bottlenecks in your frontend.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
