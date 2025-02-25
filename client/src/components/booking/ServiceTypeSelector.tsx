import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Shield, Sparkles, Clock, Heart, GraduationCap } from "lucide-react";

interface ServiceType {
  id: string;
  name: string;
  description: string;
  baseRate: number;
  icon: React.ReactNode;
  features: string[];
  requirements: string[];
}

const serviceTypes: ServiceType[] = [
  {
    id: "standard",
    name: "Standard Care",
    description: "Experienced, verified babysitters for regular childcare needs",
    baseRate: 15,
    icon: <Shield className="h-5 w-5" />,
    features: [
      "Basic childcare and supervision",
      "Age-appropriate activities",
      "Meal preparation",
      "Light cleanup"
    ],
    requirements: [
      "Background checked",
      "First aid certified",
      "1+ year experience"
    ]
  },
  {
    id: "educational",
    name: "Educational Care",
    description: "Qualified educators who combine learning with care",
    baseRate: 25,
    icon: <GraduationCap className="h-5 w-5" />,
    features: [
      "Structured learning activities",
      "Homework help",
      "Educational games",
      "Progress reports"
    ],
    requirements: [
      "Teaching certification",
      "Background checked",
      "3+ years experience"
    ]
  },
  {
    id: "special_needs",
    name: "Special Needs Care",
    description: "Specialized care for children with additional needs",
    baseRate: 30,
    icon: <Heart className="h-5 w-5" />,
    features: [
      "Personalized care plans",
      "Medical awareness",
      "Therapeutic activities",
      "Detailed reporting"
    ],
    requirements: [
      "Special needs certification",
      "Medical training",
      "5+ years experience"
    ]
  },
  {
    id: "overnight",
    name: "Overnight Care",
    description: "Extended care with sleeping accommodation",
    baseRate: 20,
    icon: <Clock className="h-5 w-5" />,
    features: [
      "Bedtime routines",
      "Overnight supervision",
      "Morning preparation",
      "Extended availability"
    ],
    requirements: [
      "Background checked",
      "First aid certified",
      "2+ years experience"
    ]
  }
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
            <CardContent className="p-4 space-y-4">
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

              {selectedService === service.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3 pt-3 border-t"
                >
                  <div>
                    <h5 className="text-sm font-medium mb-2">Includes:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-3 w-3 mr-2 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Babysitter Requirements:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {service.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <Shield className="h-3 w-3 mr-2 text-primary" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}