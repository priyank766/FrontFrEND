import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { RepoInput } from "@/components/RepoInput";
import { PreferencesForm, UserPreferences } from "@/components/PreferencesForm";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { PreviewComparison } from "@/components/PreviewComparison";
import { PRSuccess } from "@/components/PRSuccess";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { ProjectDetails } from "@/components/ProjectDetails";
import { Footer } from "@/components/Footer";

type AppStep = "hero" | "repo-input" | "preferences" | "processing" | "preview" | "success";

import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>("hero");
  const [repoUrl, setRepoUrl] = useState("");
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [codeChanges, setCodeChanges] = useState(null);

  const handleGetStarted = () => {
    setCurrentStep("repo-input");
  };

  const handleRepoSubmit = (url: string) => {
    setRepoUrl(url);
    setCurrentStep("preferences");
  };

  const handleGitHubAuth = () => {
    // Simulate GitHub OAuth flow
    console.log("GitHub OAuth initiated");
    // In a real app, this would redirect to GitHub OAuth
  };

  const { toast } = useToast();

  const [processingMessages, setProcessingMessages] = useState<string[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handlePreferencesSubmit = async (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setCurrentStep("processing");
    setProcessingMessages([]); // Clear previous messages
    setProcessingProgress(0); // Reset progress

    try {
      const startResponse = await fetch("http://127.0.0.1:5001/api/workflow/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repo_url: repoUrl, user_preferences: preferences }),
      });

      if (!startResponse.ok) {
        throw new Error(`HTTP error! status: ${startResponse.status}`);
      }

      // Start polling for status
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch("http://127.0.0.1:5001/api/workflow/status");
          if (!statusResponse.ok) {
            throw new Error(`HTTP error! status: ${statusResponse.status}`);
          }
          const statusData = await statusResponse.json();
          console.log("Workflow status:", statusData);

          setProcessingMessages(statusData.messages || []);
          // Update progress based on status or messages if available
          if (statusData.status === "processing") {
            // You might want more granular progress updates from backend
            // For now, a simple increment or based on message count
            setProcessingProgress(prev => Math.min(prev + 5, 95)); 
          } else if (statusData.status === "completed") {
            setProcessingProgress(100);
            clearInterval(pollInterval);
            toast({
              title: "Analysis Complete",
              description: "Your repository has been analyzed.",
            });
            await handleProcessingComplete();
          } else if (statusData.status === "error") {
            clearInterval(pollInterval);
            toast({
              title: "Analysis Failed",
              description: statusData.message || "An unknown error occurred during analysis.",
              variant: "destructive",
            });
            setCurrentStep("preferences");
          }
        } catch (error) {
          console.error("Error polling workflow status:", error);
          clearInterval(pollInterval);
          toast({
            title: "Analysis Failed",
            description: "Failed to get workflow status. Please try again.",
            variant: "destructive",
          });
          setCurrentStep("preferences");
        }
      }, 2000); // Poll every 2 seconds

    } catch (error) {
      console.error("Error starting workflow:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error starting the analysis. Please try again.",
        variant: "destructive",
      });
      setCurrentStep("preferences"); // Go back to preferences on error
    }
  };

  const handleProcessingComplete = async () => {
    try {
      console.log("Fetching workflow results...");
      const response = await fetch("http://127.0.0.1:5001/api/workflow/results");
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const results = await response.json();
      console.log("Workflow results received:", results);
      setCodeChanges(results);
      setCurrentStep("preview");
      console.log("Transitioned to preview step");
    } catch (error) {
      console.error("Error fetching workflow results:", error);
      toast({
        title: "Error Fetching Results",
        description: "There was an error fetching the results. Please try again.",
        variant: "destructive",
      });
      // Stay on processing step if there's an error
      setCurrentStep("processing");
    }
  };

  const handleCreatePR = () => {
    setCurrentStep("success");
  };

  const handleStartNew = () => {
    setCurrentStep("hero");
    setRepoUrl("");
    setUserPreferences(null);
  };

  const handleBackToRepo = () => {
    setCurrentStep("repo-input");
  };

  const handleBackToPreferences = () => {
    setCurrentStep("preferences");
  };

  return (
    <>
      <div className="min-h-screen relative">
        <BackgroundEffects />
        
        {currentStep === "hero" && (
          <HeroSection onGetStarted={handleGetStarted} />
        )}
        
        {currentStep === "repo-input" && (
          <RepoInput 
            onSubmit={handleRepoSubmit}
            onGitHubAuth={handleGitHubAuth}
            onBack={() => setCurrentStep("hero")}
          />
        )}
        
        {currentStep === "preferences" && (
          <PreferencesForm
            repoUrl={repoUrl}
            onSubmit={handlePreferencesSubmit}
            onBack={handleBackToRepo}
          />
        )}
        
        {currentStep === "processing" && (
          <ProcessingStatus 
            onComplete={handleProcessingComplete}
            messages={processingMessages}
            progress={processingProgress}
          />
        )}
        
        {currentStep === "preview" && (
          <PreviewComparison
            repoUrl={repoUrl}
            onCreatePR={handleCreatePR}
            onBack={handleBackToPreferences}
            codeChanges={codeChanges}
          />
        )}
        
        {currentStep === "success" && (
          <PRSuccess
            repoUrl={repoUrl}
            onStartNew={handleStartNew}
          />
        )}
      </div>
      {currentStep === "hero" && (
        <>
          <ProjectDetails />
          <Footer />
        </>
      )}
    </>
  );
};

export default Index;
