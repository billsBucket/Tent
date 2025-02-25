import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface IdVerificationStepProps {
  onComplete: (data: any) => void;
}

export default function IdVerificationStep({ onComplete }: IdVerificationStepProps) {
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(false);
  const [idImage, setIdImage] = useState<File | null>(null);
  const [idDetails, setIdDetails] = useState({
    type: "",
    number: "",
    expiryDate: "",
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdImage(file);
    }
  };

  const handleVerify = async () => {
    if (!idImage) {
      toast({
        title: "Missing Image",
        description: "Please upload an image of your ID document",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);

    try {
      const formData = new FormData();
      formData.append("idImage", idImage);

      const response = await apiRequest("POST", "/api/verify/id", formData);
      const data = await response.json();

      if (data.verified) {
        setIdDetails({
          type: data.documentType,
          number: data.documentNumber,
          expiryDate: data.expiryDate,
        });
        
        toast({
          title: "ID Verified",
          description: "Your ID has been successfully verified.",
        });

        onComplete({
          verified: true,
          documentType: data.documentType,
          documentNumber: data.documentNumber,
          expiryDate: data.expiryDate,
        });
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Please try again with a clearer image",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify ID. Please try again.",
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
        <h2 className="text-xl font-semibold">ID Verification</h2>
        <p className="text-muted-foreground">
          Please upload a clear photo of your government-issued ID
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="id-upload"
            />
            <Label
              htmlFor="id-upload"
              className="cursor-pointer block"
            >
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground block">
                {idImage ? idImage.name : "Click to upload ID"}
              </span>
            </Label>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Accepted ID types:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              <li>Driver's License</li>
              <li>Passport</li>
              <li>State ID Card</li>
              <li>Military ID</li>
            </ul>
          </div>

          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={!idImage || verifying}
          >
            {verifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify ID
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
