import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight } from "lucide-react";
import IdVerificationStep from "./steps/id-verification";
import FaceVerificationStep from "./steps/face-verification";
import AddressVerificationStep from "./steps/address-verification";
import ChildrenInfoStep from "./steps/children-info";
import ConsentStep from "./steps/consent";

type SetupStep = "id" | "face" | "address" | "children" | "consent";

const steps: { id: SetupStep; label: string }[] = [
  { id: "id", label: "ID Verification" },
  { id: "face", label: "Face Verification" },
  { id: "address", label: "Address" },
  { id: "children", label: "Children" },
  { id: "consent", label: "Agreement" }
];

export default function ParentProfileSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<SetupStep>("id");
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
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id);
    } else {
      // Submit complete profile
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
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</p>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            {steps.map((step, index) => (
              <span
                key={step.id}
                className={currentStepIndex >= index ? "text-primary" : ""}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>

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
