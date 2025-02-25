import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Upload } from "lucide-react";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import PlacesAutocomplete from "@/components/maps/PlacesAutocomplete";

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

export default function ParentProfileSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
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

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">Add your family details and verification documents</p>
        </div>

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
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
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

            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Government ID</h2>
                <FormField
                  control={form.control}
                  name="governmentId.type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Driver's License, Passport" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="governmentId.number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="governmentId.expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              disabled={updateProfileMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Profile and Continue to Verification
            </Button>
          </form>
        </Form>
      </motion.div>
    </MobileLayout>
  );
}