import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FaceVerificationStepProps {
  onComplete: (data: { verified: boolean }) => void;
}

export default function FaceVerificationStep({ onComplete }: FaceVerificationStepProps) {
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [faceDetected, setFaceDetected] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
      setStream(mediaStream);
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      startFaceDetection();
    } catch (err) {
      setHasPermission(false);
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

  const startFaceDetection = () => {
    // For now, we'll simulate face detection
    // In production, use a face detection library
    setTimeout(() => setFaceDetected(true), 2000);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !faceDetected) return;

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

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <Camera className="h-12 w-12" />
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {stream && !faceDetected && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  <p>Detecting face...</p>
                </div>
              </div>
            )}
            {stream && faceDetected && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 border-4 border-green-500 rounded-lg"
              />
            )}
          </div>

          {hasPermission === false && (
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">Camera access denied. Please check your browser settings.</p>
            </div>
          )}

          {!stream ? (
            <Button className="w-full" onClick={startCamera}>
              Start Camera
              <Camera className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={capturePhoto}
              disabled={verifying || !faceDetected}
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : !faceDetected ? (
                "Waiting for face detection..."
              ) : (
                <>
                  Take Photo
                  <Camera className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}