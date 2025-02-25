import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Shield
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type VerificationStep = "intro" | "id" | "face" | "complete";

export default function VerificationFlow() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<VerificationStep>("intro");
  const [idDetails, setIdDetails] = useState({
    type: "",
    number: "",
    expiryDate: "",
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const verificationMutation = useMutation({
    mutationFn: async (data: {
      type: "government_id" | "face";
      metadata?: typeof idDetails;
      imageData?: string;
    }) => {
      const res = await apiRequest("POST", "/api/verifications", data);
      return res.json();
    },
    onSuccess: () => {
      if (currentStep === "id") {
        setCurrentStep("face");
      } else if (currentStep === "face") {
        setCurrentStep("complete");
      }
    },
    onError: (error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast({
        title: "Camera access failed",
        description: "Please allow camera access to continue with verification",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg");

    verificationMutation.mutate({
      type: "face",
      imageData,
    });
    stopCamera();
  };

  const submitIdVerification = () => {
    verificationMutation.mutate({
      type: "government_id",
      metadata: idDetails,
    });
  };

  const getRedirectPath = () => {
    if (!user) return "/auth";
    return user.userType === "parent" ? "/parent/home" : "/babysitter/dashboard";
  };

  const renderStep = () => {
    switch (currentStep) {
      case "intro":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <Shield className="h-16 w-16 mx-auto text-primary" />
              <h1 className="text-2xl font-bold">Verify Your Identity</h1>
              <p className="text-muted-foreground">
                To ensure the safety of our community, we need to verify your identity
              </p>
            </div>

            <Card className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Government ID</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a valid government-issued ID
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Face Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a selfie to verify your identity
                  </p>
                </div>
              </div>
            </Card>

            <Button className="w-full" onClick={() => setCurrentStep("id")}>
              Start Verification
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        );

      case "id":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Government ID</h2>
              <p className="text-muted-foreground">
                Enter your government ID details
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ID Type</Label>
                <Input
                  placeholder="e.g. Driver's License, Passport"
                  value={idDetails.type}
                  onChange={(e) =>
                    setIdDetails({ ...idDetails, type: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>ID Number</Label>
                <Input
                  placeholder="Enter ID number"
                  value={idDetails.number}
                  onChange={(e) =>
                    setIdDetails({ ...idDetails, number: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={idDetails.expiryDate}
                  onChange={(e) =>
                    setIdDetails({ ...idDetails, expiryDate: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              className="w-full"
              onClick={submitIdVerification}
              disabled={verificationMutation.isPending}
            >
              Submit ID Details
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        );

      case "face":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Face Verification</h2>
              <p className="text-muted-foreground">
                Take a clear selfie to verify your identity
              </p>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {!stream ? (
              <Button className="w-full" onClick={startCamera}>
                Start Camera
                <Camera className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={capturePhoto}
                disabled={verificationMutation.isPending}
              >
                Take Photo
                <Camera className="h-4 w-4 ml-2" />
              </Button>
            )}
          </motion.div>
        );

      case "complete":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold">Verification Submitted</h2>
              <p className="text-muted-foreground">
                Your verification is being processed. We'll notify you once it's complete.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() => setLocation(getRedirectPath())}
            >
              Continue to Dashboard
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <MobileLayout>
      {renderStep()}
    </MobileLayout>
  );
}
