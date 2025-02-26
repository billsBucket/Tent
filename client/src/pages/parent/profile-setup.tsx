import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Camera, Navigation2, Baby, Check } from "lucide-react";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import PlacesAutocomplete from "@/components/maps/PlacesAutocomplete";
import { Progress } from "@/components/ui/progress";

const childSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0).max(17),
  gender: z.string().min(1, "Gender is required"),
  allergies: z.string().optional(),
  specialNeeds: z.string().optional(),
});

const profileSchema = z.object({
  children: z.array(childSchema),
  address: z.string().min(1, "Address is required"),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  governmentId: z.object({
    type: z.string().min(1, "ID type is required"),
    number: z.string().min(1, "ID number is required"),
    expiryDate: z.string().min(1, "Expiry date is required"),
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type Step = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "pending" | "in_progress" | "completed";
};

const steps: Step[] = [
  {
    id: 1,
    title: "ID Verification",
    description: "Verify your identity with a government-issued ID",
    icon: <Upload className="h-12 w-12" />,
    status: "pending"
  },
  {
    id: 2,
    title: "Face Verification",
    description: "Take a quick selfie to verify it's you",
    icon: <Camera className="h-12 w-12" />,
    status: "pending"
  },
  {
    id: 3,
    title: "Home Address",
    description: "Help us find babysitters in your area",
    icon: <Navigation2 className="h-12 w-12" />,
    status: "pending"
  },
  {
    id: 4,
    title: "Children",
    description: "Add your children's information",
    icon: <Baby className="h-12 w-12" />,
    status: "pending"
  }
];

export default function ParentProfileSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [idImage, setIdImage] = useState<File | null>(null);
  const [childrenCount, setChildrenCount] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState("");

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      children: [{ name: "", age: 0, gender: "", allergies: "", specialNeeds: "" }],
      address: "",
      location: { latitude: 0, longitude: 0 },
      governmentId: { type: "", number: "", expiryDate: "" },
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await apiRequest("POST", "/api/parent/profile", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setLocation("/parent/verification");
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const progress = (currentStep / steps.length) * 100;

  const handleIdUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setIdImage(file);

    const formData = new FormData();
    formData.append("idImage", file);

    try {
      const response = await fetch("/api/verify/id", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.verified) {
        toast({
          title: "ID Verification Successful",
          description: "Your ID has been verified. Proceeding to face verification.",
        });
        setCurrentStep(2);
      } else {
        toast({
          title: "Verification Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload ID. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePlaceSelect = ({ address, latitude, longitude }: {
    address: string;
    latitude: number;
    longitude: number
  }) => {
    setSelectedAddress(address);
    form.setValue("address", address);
    form.setValue("location", { latitude, longitude });
  };

  const addChild = () => {
    const children = form.getValues("children");
    form.setValue("children", [
      ...children,
      { name: "", age: 0, gender: "", allergies: "", specialNeeds: "" },
    ]);
    setChildrenCount(prev => prev + 1);
  };

  const removeChild = (index: number) => {
    const children = form.getValues("children");
    form.setValue(
      "children",
      children.filter((_, i) => i !== index)
    );
    setChildrenCount(prev => prev - 1);
  };

  const onSubmit = form.handleSubmit((data) => {
    updateProfileMutation.mutate(data);
  });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-6"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              {steps[0].icon}
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">{steps[0].title}</h2>
              <p className="text-muted-foreground max-w-sm">
                {steps[0].description}
              </p>
            </div>

            <Card className="w-full">
              <CardContent className="p-6 space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="id-upload"
                  onChange={handleIdUpload}
                />
                <Button 
                  size="lg"
                  className="w-full h-16 text-lg"
                  onClick={() => document.getElementById("id-upload")?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-2"
                    >
                      <span className="loading loading-spinner"></span>
                      <span>Uploading...</span>
                    </motion.div>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 mr-2" />
                      Upload ID Photo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground text-center max-w-sm">
              We accept driver's license, passport, or government-issued ID
            </p>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-6"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              {steps[1].icon}
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">{steps[1].title}</h2>
              <p className="text-muted-foreground max-w-sm">
                {steps[1].description}
              </p>
            </div>

            <Card className="w-full">
              <CardContent className="p-6">
                <Button 
                  size="lg"
                  className="w-full h-16 text-lg"
                  onClick={() => {
                    // Face verification logic
                    setCurrentStep(3);
                  }}
                >
                  <Camera className="h-6 w-6 mr-2" />
                  Take Selfie
                </Button>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Your photo will be securely stored and used only for verification
            </p>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-6"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              {steps[2].icon}
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">{steps[2].title}</h2>
              <p className="text-muted-foreground max-w-sm">
                {steps[2].description}
              </p>
            </div>

            <Card className="w-full">
              <CardContent className="p-6 space-y-4">
                <PlacesAutocomplete
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Enter your home address"
                />
                {selectedAddress && (
                  <Button 
                    size="lg"
                    className="w-full"
                    onClick={() => setCurrentStep(4)}
                  >
                    <Check className="h-6 w-6 mr-2" />
                    Confirm Address
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-6"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              {steps[3].icon}
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">{steps[3].title}</h2>
              <p className="text-muted-foreground max-w-sm">
                {steps[3].description}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={onSubmit} className="w-full space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    {Array.from({ length: childrenCount }).map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Child {index + 1}</h3>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeChild(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`children.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`children.${index}.age`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Age</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`children.${index}.gender`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gender</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={addChild}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Child
                    </Button>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-16 text-lg"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Complete Setup"}
                </Button>
              </form>
            </Form>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Step {currentStep} of {steps.length}</span>
              <span className="text-muted-foreground">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-1" />
          </div>
        </div>

        <div className="flex-1 pt-20">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </MobileLayout>
  );
}