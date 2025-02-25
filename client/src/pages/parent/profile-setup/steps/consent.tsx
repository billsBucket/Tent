import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, UserCheck, Lock } from "lucide-react";

interface ConsentStepProps {
  onComplete: (data: { consent: boolean }) => void;
}

export default function ConsentStep({ onComplete }: ConsentStepProps) {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (agreed) {
      onComplete({ consent: true });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Terms & Consent</h2>
        <p className="text-muted-foreground">
          Please review and accept our terms of service
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Shield className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-medium">Safety & Security</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize the safety of your children through thorough background checks and ongoing monitoring of all babysitters.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <UserCheck className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-medium">Verified Babysitters</h3>
                <p className="text-sm text-muted-foreground">
                  All babysitters undergo extensive verification including ID checks, interviews, and reference checks.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Lock className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-medium">Privacy Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Your personal information and children's details are protected with industry-standard security measures.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
              <label
                htmlFor="consent"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I understand and agree to the terms of service, privacy policy, and consent to the verification process for using the babysitting service.
              </label>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!agreed}
          >
            Complete Profile Setup
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
