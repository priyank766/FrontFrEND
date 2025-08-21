import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { RepoInput } from "@/components/RepoInput";
import { PreferencesForm, UserPreferences } from "@/components/PreferencesForm";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { PreviewComparison } from "@/components/PreviewComparison";
import { PRSuccess } from "@/components/PRSuccess";
import { BackgroundEffects } from "@/components/BackgroundEffects";

type AppStep = "hero" | "repo-input" | "preferences" | "processing" | "preview" | "success";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>("hero");
  const [repoUrl, setRepoUrl] = useState("");
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

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

  const handlePreferencesSubmit = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setCurrentStep("processing");
  };

  const handleProcessingComplete = () => {
    setCurrentStep("preview");
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
        <ProcessingStatus onComplete={handleProcessingComplete} />
      )}
      
      {currentStep === "preview" && (
        <PreviewComparison
          repoUrl={repoUrl}
          onCreatePR={handleCreatePR}
          onBack={handleBackToPreferences}
        />
      )}
      
      {currentStep === "success" && (
        <PRSuccess
          repoUrl={repoUrl}
          onStartNew={handleStartNew}
        />
      )}
    </div>
  );
};

export default Index;
