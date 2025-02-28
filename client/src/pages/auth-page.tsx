import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Loader2, SmartphoneIcon } from "lucide-react";
import { z } from "zod";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter the complete verification code"),
});

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [isNewUser, setIsNewUser] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (user) {
      if (!user.profileData?.children && user.userType === "parent") {
        setLocation("/parent/profile-setup");
      } else {
        const redirectPath = user.userType === "parent" ? "/parent/home" : "/babysitter/dashboard";
        setLocation(redirectPath);
      }
    }
  }, [user, setLocation]);

  const onPhoneSubmit = phoneForm.handleSubmit(async (data) => {
    setPhoneNumber(data.phoneNumber);
    // TODO: Implement sending OTP
    setStep("verify");
  });

  const onVerifySubmit = otpForm.handleSubmit(async (data) => {
    loginMutation.mutate({
      phoneNumber,
      otp: data.otp,
    });
  });

  const renderStep = () => {
    switch (step) {
      case "phone":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-background p-4"
          >
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                onClick={() => setLocation("/")}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
            </div>

            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <SmartphoneIcon className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold">
                {isNewUser ? "Create Account" : "Welcome back"}
              </h1>
              <p className="text-muted-foreground mt-2">
                Enter your phone number to {isNewUser ? "get started" : "continue"}
              </p>
            </div>

            <Form {...phoneForm}>
              <form onSubmit={onPhoneSubmit} className="space-y-6">
                <FormField
                  control={phoneForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="phone-input-container w-full max-w-[400px] mx-auto">
                          <PhoneInput
                            country={'us'}
                            value={field.value}
                            onChange={phone => field.onChange(phone)}
                            containerClass="w-full"
                            inputClass="!w-full !h-12 !text-lg !pl-[72px]"
                            buttonClass="!h-12 !w-[60px]"
                            placeholder="(555) 000-0000"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full max-w-[400px] mx-auto space-y-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium rounded-full"
                    disabled={phoneForm.formState.isSubmitting}
                  >
                    {phoneForm.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Continue
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setIsNewUser(!isNewUser)}
                      className="text-sm text-muted-foreground"
                    >
                      {isNewUser
                        ? "Already have an account? Sign in"
                        : "Don't have an account? Create one"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </motion.div>
        );

      case "verify":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-background p-4"
          >
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                onClick={() => setStep("phone")}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-2xl font-semibold">Verify your number</h1>
              <p className="text-muted-foreground mt-2">
                Enter the 6-digit code sent to {phoneNumber}
              </p>
            </div>

            <Form {...otpForm}>
              <form onSubmit={onVerifySubmit} className="space-y-6">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          className="gap-2 flex justify-center"
                        >
                          <InputOTPGroup>
                            {Array.from({ length: 6 }).map((_, index) => (
                              <InputOTPSlot key={index} index={index} />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 w-full max-w-[400px] mx-auto">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium rounded-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Verify & Continue
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-sm text-muted-foreground"
                    onClick={() => setStep("phone")}
                  >
                    Didn't receive code? Try again
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderStep()}
    </AnimatePresence>
  );
}