import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Phone, ChevronRight } from "lucide-react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [step, setStep] = useState<"start" | "login" | "register">("start");

  const loginForm = useForm({
    resolver: zodResolver(insertUserSchema.pick({ username: true, password: true })),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      userType: "parent",
      username: "",
      password: "",
      phoneNumber: "",
      fullName: "",
      email: "",
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

  const onLoginSubmit = loginForm.handleSubmit((data) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  });

  const onRegisterSubmit = registerForm.handleSubmit((data) => {
    registerMutation.mutate(data);
  });

  if (user) return null;

  const renderStep = () => {
    switch (step) {
      case "start":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-6"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-10 w-10 text-primary" />
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Welcome to BabySitterGo - Tent</h1>
              <p className="text-muted-foreground">
                Sign in or create an account to get started
              </p>
            </div>

            <div className="w-full space-y-4 mt-8">
              <Button 
                variant="outline"
                className="w-full h-14 text-lg bg-white text-black hover:bg-gray-100"
                onClick={() => setStep("login")}
              >
                Sign In
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                className="w-full h-14 text-lg bg-white text-black hover:bg-gray-100"
                onClick={() => setStep("register")}
              >
                Create Account
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case "login":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col min-h-[60vh] p-6 space-y-6"
          >
            <Button
              variant="ghost"
              className="w-fit -ml-2"
              onClick={() => setStep("start")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground">
                Sign in to your account
              </p>
            </div>

            <Form {...loginForm}>
              <form onSubmit={onLoginSubmit} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg mt-6 bg-white text-black hover:bg-gray-100" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <Button 
                variant="link" 
                className="text-sm"
                onClick={() => setStep("register")}
              >
                Don't have an account? Create one
              </Button>
            </div>
          </motion.div>
        );

      case "register":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col min-h-[60vh] p-6 space-y-6"
          >
            <Button
              variant="ghost"
              className="w-fit -ml-2"
              onClick={() => setStep("start")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Create account</h1>
              <p className="text-muted-foreground">
                Join BabySitterGo - Tent to get started
              </p>
            </div>

            <Form {...registerForm}>
              <form onSubmit={onRegisterSubmit} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I am a</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="babysitter">Babysitter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="phone-input-container">
                          <PhoneInput
                            country={'us'}
                            value={field.value}
                            onChange={phone => field.onChange(phone)}
                            enableSearch={true}
                            inputClass="!w-full !h-10 !rounded-md !px-3 !py-2 !bg-background !border !border-input"
                            buttonClass="!border !border-input !rounded-l-md !bg-background"
                            dropdownClass="!bg-background !border !border-input"
                            searchClass="!bg-background !text-foreground"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose a username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create a password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg mt-6 bg-white text-black hover:bg-gray-100"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <Button 
                variant="link" 
                className="text-sm"
                onClick={() => setStep("login")}
              >
                Already have an account? Sign in
              </Button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <MobileLayout className="bg-background">
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </MobileLayout>
  );
}