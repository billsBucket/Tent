import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Shield, Sparkles, Clock } from "lucide-react";

interface ServiceType {
  id: string;
  name: string;
  description: string;
  baseRate: number;
  icon: React.ReactNode;
}

const serviceTypes: ServiceType[] = [
  {
    id: "standard",
    name: "Standard",
    description: "Experienced, verified babysitters",
    baseRate: 15,
    icon: <Shield className="h-5 w-5" />,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Top-rated sitters with special qualifications",
    baseRate: 25,
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: "overnight",
    name: "Overnight",
    description: "Extended care with sleeping accommodation",
    baseRate: 20,
    icon: <Clock className="h-5 w-5" />,
  },
];

interface ServiceTypeSelectorProps {
  onSelect: (service: ServiceType) => void;
}

export default function ServiceTypeSelector({ onSelect }: ServiceTypeSelectorProps) {
  const [selectedService, setSelectedService] = useState<string>("standard");

  const handleSelect = (service: ServiceType) => {
    setSelectedService(service.id);
    onSelect(service);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium mb-2">Select Service Type</h3>
      {serviceTypes.map((service) => (
        <motion.div
          key={service.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className={`cursor-pointer ${
              selectedService === service.id
                ? "border-primary"
                : "border-border"
            }`}
            onClick={() => handleSelect(service)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${service.baseRate}/hr</p>
                  {selectedService === service.id && (
                    <Check className="h-4 w-4 text-primary ml-auto mt-1" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
