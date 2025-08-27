import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
// No longer needed
import { CodeChangesSlider } from "./CodeChangesSlider";
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
  Smartphone,
  Expand
} from "lucide-react";

interface PreviewComparisonProps {
  onCreatePR: () => void;
  onBack: () => void;
  repoUrl: string;
  codeChanges: any;
}

export const PreviewComparison = ({ onCreatePR, onBack, repoUrl, codeChanges }: PreviewComparisonProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

  // Handle ESC key to close preview
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    if (isFullScreen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullScreen]);

  const handleOpenPreview = async () => {
    setIsLoadingPreview(true);
    try {
      console.log("Fetching preview from backend...");
      const response = await fetch("http://127.0.0.1:5001/api/live_preview");
      console.log("Preview response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      console.log("Preview HTML received, length:", html.length);
      setPreviewHtml(html);
      setIsFullScreen(true);
    } catch (error) {
      console.error("Failed to load live preview:", error);
      alert("Failed to load live preview. Please check if the backend server is running.");
    } finally {
      setIsLoadingPreview(false);
    }
  };
  
  const repoName = repoUrl.split("/").pop() || "repository";

  if (!codeChanges) {
    return (
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
            Loading Results...
          </h2>
          <p className="text-xl text-muted-foreground">
            Please wait while we fetch the comparison data.
          </p>
        </div>
      </section>
    );
  }

  const { improvements, files } = codeChanges;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Global background is now handled by CSS */}
      
      {/* Content */}
      <div className="relative z-10 min-h-screen py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-headline-dark tracking-tight">
            Code Changes & Preview
          </h2>
          <p className="text-body-dark text-lg">
            Review the improvements made to your codebase
          </p>
        </div>

        {/* Live Preview Section */}
        <div className="text-center mb-8">
          <Button 
            onClick={handleOpenPreview} 
            size="lg" 
            disabled={isLoadingPreview}
            className="btn-primary group hover:scale-105 transition-transform"
          >
            {isLoadingPreview ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading Preview...
              </>
            ) : (
              <>
                <Eye className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Open Live Preview
              </>
            )}
          </Button>
        </div>

        {/* Code Changes Section */}
        <Card className="glass-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-[#FF7A2B] to-[#FF9C57] flex items-center justify-center shadow-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-headline-dark">Code Changes</h3>
              <p className="text-body-dark text-sm">Review the improvements made to your codebase</p>
            </div>
                      <div className="grid grid-cols-12 gap-4 h-96">
              {/* File Tree - Left Side */}
              <div className="col-span-3 bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="font-semibold text-sm mb-3 text-headline-dark">Files Modified</h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm transition-colors ${
                        selectedFileIndex === index 
                          ? 'bg-[#FF7A2B]/20 border border-[#FF7A2B]/30' 
                          : 'hover:bg-white/5 border border-white/5'
                      }`}
                      onClick={() => setSelectedFileIndex(index)}
                    >
                      <Code className="w-4 h-4 text-[#FF7A2B]" />
                      <span className="font-mono text-headline-dark">{file.path}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Code Comparison - Center */}
              <div className="col-span-9 bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                <div className="grid grid-cols-2 h-full">
                  {/* Before Code */}
                  <div className="border-r border-white/10">
                    <div className="bg-white/10 px-4 py-2 border-b border-white/10">
                      <h5 className="text-sm font-semibold text-headline-dark">Before</h5>
                    </div>
                    <div className="p-4 h-full overflow-auto">
                      <pre className="text-xs text-body-dark whitespace-pre-wrap">
                        {selectedFileIndex !== null ? files[selectedFileIndex]?.before : 'Select a file to view changes'}
                      </pre>
                    </div>
                  </div>
                  
                  {/* After Code */}
                  <div>
                    <div className="bg-[#FF7A2B]/10 px-4 py-2 border-b border-white/10">
                      <h5 className="text-sm font-semibold text-[#FF7A2B]">After</h5>
                    </div>
                    <div className="p-4 h-full overflow-auto">
                      <pre className="text-xs text-body-dark whitespace-pre-wrap">
                        {selectedFileIndex !== null ? files[selectedFileIndex]?.after : 'Select a file to view changes'}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>
      
      {isFullScreen && previewHtml && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="w-full h-full max-w-6xl max-h-[95vh] bg-white rounded-xl shadow-2xl overflow-hidden relative">
            {/* Close Button */}
            <button
              className="absolute top-4 left-12 bg-accent-orange/10 hover:bg-accent-orange/20 backdrop-blur-sm rounded-full p-2 transition-colors text-white z-20"
              onClick={() => setIsFullScreen(false)}
              aria-label="Close Preview"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Preview Content */}
            <div className="h-full">
              <iframe
                srcDoc={previewHtml}
                title="Live Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};