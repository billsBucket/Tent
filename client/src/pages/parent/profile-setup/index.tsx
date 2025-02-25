import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, CheckCircle } from "lucide-react";
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
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm p-4 space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</p>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex justify-between overflow-x-auto py-2 gap-2">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;

            return (
              <Badge
                key={step.id}
                variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                className={`whitespace-nowrap ${
                  isCurrent ? "ring-2 ring-primary" : ""
                } ${
                  isCompleted ? "bg-primary/20" : ""
                }`}
              >
                <span className="mr-1">{step.icon}</span>
                {step.label}
                {isCompleted && <CheckCircle className="w-4 h-4 ml-1" />}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="flex-1 pt-36 pb-4 px-4">
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