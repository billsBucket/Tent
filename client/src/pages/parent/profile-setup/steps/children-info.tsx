import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";

const childSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  allergies: z.string().optional(),
  specialNeeds: z.string().optional(),
});

type Child = z.infer<typeof childSchema>;

interface ChildrenInfoStepProps {
  onComplete: (data: { children: Child[] }) => void;
}

export default function ChildrenInfoStep({ onComplete }: ChildrenInfoStepProps) {
  const [children, setChildren] = useState<Child[]>([{
    name: "",
    dateOfBirth: "",
    allergies: "",
    specialNeeds: "",
  }]);

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const addChild = () => {
    setChildren([...children, {
      name: "",
      dateOfBirth: "",
      allergies: "",
      specialNeeds: "",
    }]);
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    setChildren(children.map((child, i) =>
      i === index ? { ...child, [field]: value } : child
    ));
  };

  const handleSubmit = () => {
    try {
      const validatedChildren = children.map((child, index) => {
        const result = childSchema.parse(child);
        return result;
      });
      setErrors({});
      onComplete({ children: validatedChildren });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Children Information</h2>
        <p className="text-muted-foreground">
          Add details about your children
        </p>
      </div>

      <div className="space-y-4">
        {children.map((child, index) => (
          <Card key={index}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Child {index + 1}</h3>
                {children.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeChild(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={child.name}
                    onChange={(e) => updateChild(index, "name", e.target.value)}
                    placeholder="Enter child's name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name[0]}</p>
                  )}
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={child.dateOfBirth}
                    onChange={(e) => updateChild(index, "dateOfBirth", e.target.value)}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-destructive mt-1">{errors.dateOfBirth[0]}</p>
                  )}
                </div>

                <div>
                  <Label>Allergies (Optional)</Label>
                  <Input
                    value={child.allergies}
                    onChange={(e) => updateChild(index, "allergies", e.target.value)}
                    placeholder="Enter any allergies"
                  />
                </div>

                <div>
                  <Label>Special Needs (Optional)</Label>
                  <Input
                    value={child.specialNeeds}
                    onChange={(e) => updateChild(index, "specialNeeds", e.target.value)}
                    placeholder="Enter any special needs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
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

        <Button
          className="w-full"
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
