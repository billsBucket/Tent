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
import { Plus, Trash2, Save, Upload, Check, ChevronRight } from "lucide-react";
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
};

const steps: Step[] = [
  {
    id: 1,
    title: "ID Verification",
    description: "Upload your government-issued ID for verification"
  },
  {
    id: 2,
    title: "Face Verification",
    description: "Complete a quick face verification check"
  },
  {
    id: 3,
    title: "Home Address",
    description: "Add your home address for local matching"
  },
  {
    id: 4,
    title: "Children Information",
    description: "Add details about your children"
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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Upload Your ID</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please upload a clear photo of your government-issued ID
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="id-upload"
                  onChange={handleIdUpload}
                />

                <Button
                  className="w-full"
                  onClick={() => document.getElementById("id-upload")?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Select ID Photo"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Face Verification Component Here */}
            <p>Face Verification Step (To be implemented)</p>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Home Address</h2>
                <PlacesAutocomplete
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Enter your home address"
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="hidden" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Children</h2>
                      <Button type="button" variant="outline" size="sm" onClick={addChild}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Child
                      </Button>
                    </div>

                    {Array.from({ length: childrenCount }).map((_, index) => (
                      <div key={index} className="space-y-4 pt-4 border-t first:border-t-0 first:pt-0">
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

                        <FormField
                          control={form.control}
                          name={`children.${index}.allergies`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Allergies (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`children.${index}.specialNeeds`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Special Needs (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
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
      <div className="space-y-6 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Step {currentStep} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{steps[currentStep - 1].title}</h1>
          <p className="text-muted-foreground mt-1">{steps[currentStep - 1].description}</p>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center space-x-4 ${
                step.id === currentStep
                  ? "text-primary"
                  : step.id < currentStep
                  ? "text-muted-foreground"
                  : "text-muted-foreground opacity-50"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                step.id === currentStep
                  ? "border-primary bg-primary/10"
                  : step.id < currentStep
                  ? "border-muted bg-muted"
                  : "border-muted"
              }`}>
                {step.id < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className="flex-1">{step.title}</span>
              {step.id < currentStep && (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
        {currentStep === 4 && (
          <Button type="submit" className="w-full" onClick={onSubmit}>Save Profile</Button>
        )}
      </div>
    </MobileLayout>
  );
}