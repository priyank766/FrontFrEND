import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Eye, 
  GitPullRequest, 
  Download, 
  ExternalLink, 
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Zap,
  Accessibility,
  Smartphone
} from "lucide-react";

interface PreviewComparisonProps {
  onCreatePR: () => void;
  onBack: () => void;
  repoUrl: string;
}

const mockImprovements = [
  {
    type: "UI Enhancement",
    description: "Updated color scheme with better contrast ratios",
    impact: "High",
    icon: Eye,
  },
  {
    type: "Performance",
    description: "Optimized CSS and reduced bundle size by 23%",
    impact: "High",
    icon: Zap,
  },
  {
    type: "Accessibility",
    description: "Added ARIA labels and semantic HTML structure",
    impact: "Medium",
    icon: Accessibility,
  },
  {
    type: "Responsive Design",
    description: "Improved mobile layout and touch targets",
    impact: "Medium",
    icon: Smartphone,
  },
];

const codeChanges = {
  html: {
    before: `<div class="header">
  <h1>Welcome</h1>
  <button onclick="handleClick()">Click me</button>
</div>`,
    after: `<header class="header" role="banner">
  <h1 class="header__title">Welcome</h1>
  <button 
    class="btn btn--primary" 
    onclick="handleClick()"
    aria-label="Get started with our service"
  >
    Click me
  </button>
</header>`,
  },
  css: {
    before: `.header {
  background: #333;
  color: white;
  padding: 20px;
}
button {
  background: blue;
  color: white;
  border: none;
  padding: 10px;
}`,
    after: `.header {
  background: var(--color-primary);
  color: var(--color-on-primary);
  padding: clamp(1rem, 4vw, 2rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn {
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  min-height: 44px; /* Touch target */
}

.btn--primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

.btn--primary:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-elevated);
}`,
  },
};

export const PreviewComparison = ({ onCreatePR, onBack, repoUrl }: PreviewComparisonProps) => {
  const [activeTab, setActiveTab] = useState("preview");
  
  const repoName = repoUrl.split("/").pop() || "repository";

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
            Preview Your Improvements
          </h2>
          <p className="text-xl text-muted-foreground">
            See the before and after comparison for <span className="font-mono font-semibold">{repoName}</span>
          </p>
        </div>

        {/* Improvements Summary */}
        <Card className="glass-card glow-subtle animate-scale-in interactive-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              AI-Generated Improvements
            </CardTitle>
            <CardDescription>
              {mockImprovements.length} improvements identified and applied
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {mockImprovements.map((improvement, index) => {
                const IconComponent = improvement.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{improvement.type}</span>
                        <Badge variant={improvement.impact === "High" ? "default" : "secondary"}>
                          {improvement.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {improvement.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Preview Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-in">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Live Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="w-4 h-4 mr-2" />
              Code Changes
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Before */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Before (Original)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-300 rounded mb-4 mx-auto"></div>
                      <p className="text-sm">Original Frontend Preview</p>
                      <p className="text-xs">Basic styling, limited responsiveness</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* After */}
              <Card className="glass-card glow-accent interactive-glow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    After (AI Improved)
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video glass-morphism rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 gradient-primary rounded-lg mb-4 mx-auto animate-glow"></div>
                      <p className="text-sm font-medium">Enhanced Frontend Preview</p>
                      <p className="text-xs text-muted-foreground">Modern design, optimized performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="group">
                <ExternalLink className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                Open in StackBlitz
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <Tabs defaultValue="html">
              <TabsList>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="space-y-4">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-600">Before</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-red-50 p-4 rounded-lg overflow-x-auto border-l-4 border-red-400">
                        <code>{codeChanges.html.before}</code>
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-600">After</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-green-50 p-4 rounded-lg overflow-x-auto border-l-4 border-green-400">
                        <code>{codeChanges.html.after}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="css" className="space-y-4">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-600">Before</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-red-50 p-4 rounded-lg overflow-x-auto border-l-4 border-red-400">
                        <code>{codeChanges.css.before}</code>
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-600">After</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-green-50 p-4 rounded-lg overflow-x-auto border-l-4 border-green-400">
                        <code>{codeChanges.css.after}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Performance Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">92</div>
                  <p className="text-sm text-muted-foreground">+23 improvement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">96</div>
                  <p className="text-sm text-muted-foreground">+31 improvement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">100</div>
                  <p className="text-sm text-muted-foreground">+15 improvement</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between animate-fade-in">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="group"
          >
            <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Preferences
          </Button>
          
          <div className="flex gap-4">
            <Button variant="secondary" className="group">
              <Download className="mr-2 w-4 h-4 transition-transform group-hover:scale-110" />
              Download Code
            </Button>
            
            <Button 
              variant="hero" 
              size="lg"
              onClick={onCreatePR}
              className="group"
            >
              <GitPullRequest className="mr-2 w-4 h-4 transition-transform group-hover:scale-110" />
              Create Pull Request
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};