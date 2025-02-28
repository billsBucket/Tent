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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [step, setStep] = useState<"login" | "register">("login");

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
      case "login":
        return (
          <MobileLayout>
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

              <div className="mb-8">
                <h1 className="text-2xl font-semibold">Welcome back</h1>
                <p className="text-muted-foreground mt-1">Sign in to your account</p>
              </div>

              <Form {...loginForm}>
                <form onSubmit={onLoginSubmit} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter username"
                            {...field}
                            className="h-12 px-4 rounded-lg"
                          />
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
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter password"
                            {...field}
                            className="h-12 px-4 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign In
                  </Button>

                  <div className="text-center mt-4">
                    <Button
                      variant="link"
                      className="text-sm text-muted-foreground"
                      onClick={() => setStep("register")}
                    >
                      Don't have an account? Create one
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          </MobileLayout>
        );
      case "register":
        return (
          <MobileLayout>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col min-h-[60vh] p-6 space-y-6"
            >
              <Button
                variant="ghost"
                className="w-fit -ml-2"
                onClick={() => setStep("login")}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Create account</h1>
                <p className="text-muted-foreground">
                  Join BabySitterGo to get started
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
                          <Input placeholder="Enter your full name" {...field} className="h-12 px-4 rounded-lg"/>
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
                          <Input placeholder="Choose a username" {...field} className="h-12 px-4 rounded-lg"/>
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
                          <Input type="password" placeholder="Create a password" {...field} className="h-12 px-4 rounded-lg"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg mt-6"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Account
                  </Button>
                </form>
              </Form>

              <div className="text-center mt-4">
                <Button
                  variant="link"
                  className="text-sm text-muted-foreground"
                  onClick={() => setStep("login")}
                >
                  Already have an account? Sign in
                </Button>
              </div>
            </motion.div>
          </MobileLayout>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderStep()}
    </AnimatePresence>
  );
}