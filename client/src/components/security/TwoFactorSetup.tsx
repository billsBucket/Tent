import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Steps } from "@/components/ui/steps";

const verificationSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

interface TwoFactorSetupProps {
  onClose: () => void;
  onEnable: () => void;
}

export function TwoFactorSetup({ onClose, onEnable }: TwoFactorSetupProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      // Here we would make an API call to generate 2FA secret and QR code
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setQrCode("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA..."); // Simulated QR code
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate 2FA setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: VerificationFormValues) => {
    try {
      setIsLoading(true);
      // Here we would make an API call to verify the 2FA code
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been set up successfully.",
      });
      onEnable();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Steps
        steps={[
          "Generate QR Code",
          "Scan QR Code",
          "Verify Code"
        ]}
        currentStep={currentStep}
      />

      {currentStep === 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            To enable two-factor authentication, first generate a QR code to scan with your authenticator app.
          </p>
          <Button onClick={generateQRCode} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate QR Code
          </Button>
        </div>
      )}

      {currentStep === 1 && qrCode && (
        <div className="text-center space-y-4">
          <img src={qrCode} alt="2FA QR Code" className="mx-auto" />
          <p className="text-sm text-muted-foreground">
            Scan this QR code with your authenticator app (like Google Authenticator or Authy)
          </p>
          <Button onClick={() => setCurrentStep(2)}>
            I've scanned the QR code
          </Button>
        </div>
      )}

      {currentStep === 2 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Enable 2FA
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}