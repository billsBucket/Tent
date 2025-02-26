import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import IdVerificationStep from "./steps/id-verification";
import FaceVerificationStep from "./steps/face-verification";
import AddressVerificationStep from "./steps/address-verification";
import ChildrenInfoStep from "./steps/children-info";
import ConsentStep from "./steps/consent";

type SetupStep = "id" | "face" | "address" | "children" | "consent";

const steps: { id: SetupStep; label: string; icon: React.ReactNode }[] = [
  { id: "id", label: "ID Verification", icon: "📄" },
  { id: "face", label: "Face Verification", icon: "🤳" },
  { id: "address", label: "Address", icon: "📍" },
  { id: "children", label: "Children", icon: "👶" },
  { id: "consent", label: "Agreement", icon: "✅" }
];

export default function ParentProfileSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<SetupStep>("id");
  const [completedSteps, setCompletedSteps] = useState<SetupStep[]>([]);
  const [profileData, setProfileData] = useState({
    idVerification: null,
    faceVerification: null,
    address: null,
    children: [],
    consent: false
  });

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleStepComplete = (stepId: SetupStep, data: any) => {
    setProfileData(prev => ({ ...prev, [stepId]: data }));
    setCompletedSteps(prev => [...prev, stepId]);

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id);
    } else {
      handleSubmitProfile();
    }
  };

  const handleSubmitProfile = async () => {
    try {
      // TODO: Implement profile submission
      toast({
        title: "Profile Complete",
        description: "Your profile has been successfully set up.",
      });
      setLocation("/parent/home");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete profile setup. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "id":
        return <IdVerificationStep onComplete={(data) => handleStepComplete("id", data)} />;
      case "face":
        return <FaceVerificationStep onComplete={(data) => handleStepComplete("face", data)} />;
      case "address":
        return <AddressVerificationStep onComplete={(data) => handleStepComplete("address", data)} />;
      case "children":
        return <ChildrenInfoStep onComplete={(data) => handleStepComplete("children", data)} />;
      case "consent":
        return <ConsentStep onComplete={(data) => handleStepComplete("consent", data)} />;
    }
  };

  return (
    <MobileLayout className="flex flex-col min-h-screen bg-background">
      {/* Fixed header with progress */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm p-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Profile Setup</h1>
          <p className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</p>
        </div>

        <Progress value={progress} className="h-2 mb-4" />

        {/* Step indicators */}
        <div className="flex flex-col space-y-2">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;

            return (
              <div 
                key={step.id}
                className={`flex items-center p-2 rounded-lg transition-colors ${
                  isCurrent ? "bg-primary/10" : 
                  isCompleted ? "bg-primary/5" : 
                  "bg-background"
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    isCurrent ? "bg-primary text-primary-foreground" :
                    isCompleted ? "bg-primary/20 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`flex-1 ${isCurrent ? "font-medium" : ""}`}>
                  {step.icon} {step.label}
                </span>
                {isCompleted && (
                  <Badge variant="secondary" className="ml-2">
                    Complete
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 pt-[280px] pb-4 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
}