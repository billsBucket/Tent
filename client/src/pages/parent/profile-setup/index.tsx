import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import IdVerificationStep from "./steps/id-verification";
import FaceVerificationStep from "./steps/face-verification";
import AddressVerificationStep from "./steps/address-verification";
import ChildrenInfoStep from "./steps/children-info";
import ConsentStep from "./steps/consent";

type SetupStep = "id" | "face" | "address" | "children" | "consent";

const steps: SetupStep[] = ["id", "face", "address", "children", "consent"];

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

  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleStepComplete = (stepId: SetupStep, data: any) => {
    setProfileData(prev => ({ ...prev, [stepId]: data }));

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex]);
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
    <MobileLayout>
      <div className="fixed top-0 left-0 right-0 z-10">
        <Progress value={progress} className="h-1" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen pt-4"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </MobileLayout>
  );
}