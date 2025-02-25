import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FaceVerificationStepProps {
  onComplete: (data: { verified: boolean }) => void;
}

export default function FaceVerificationStep({ onComplete }: FaceVerificationStepProps) {
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg");

    setVerifying(true);
    try {
      const response = await apiRequest("POST", "/api/verify/face", {
        imageData,
      });
      const data = await response.json();

      if (data.verified) {
        toast({
          title: "Face Verified",
          description: "Your identity has been successfully verified.",
        });
        stopCamera();
        onComplete({ verified: true });
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Please try again with a clearer photo",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify face. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Face Verification</h2>
        <p className="text-muted-foreground">
          Take a clear selfie to verify your identity
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
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
              disabled={verifying}
            >
              {verifying ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Take Photo
              <Camera className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
