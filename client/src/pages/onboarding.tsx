import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Shield, Heart, UserCheck, ChevronRight, X } from "lucide-react";

const slides = [
  {
    title: "Secure Bookings",
    description: "Book trusted babysitters with confidence through our secure platform",
    icon: Shield,
  },
  {
    title: "Verified Sitters",
    description: "All babysitters are verified with government ID and face validation",
    icon: UserCheck,
  },
  {
    title: "Family First",
    description: "Create detailed profiles for your family's specific needs",
    icon: Heart,
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    } else {
      setLocation("/auth");
    }
  };

  const skipOnboarding = () => setLocation("/auth");

  return (
    <MobileLayout className="flex flex-col">
      <div className="flex justify-end mb-4">
        <Button variant="ghost" size="sm" onClick={skipOnboarding}>
          <X className="h-4 w-4 mr-2" />
          Skip
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 flex flex-col items-center justify-center text-center px-4"
        >
          {slides.map((slide, index) => (
            currentSlide === index && (
              <div key={index} className="space-y-6">
                <slide.icon className="h-16 w-16 mx-auto mb-6" />
                <h2 className="text-2xl font-bold">{slide.title}</h2>
                <p className="text-muted-foreground">{slide.description}</p>
              </div>
            )
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 space-y-4">
        <div className="flex justify-center space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Button className="w-full" onClick={nextSlide}>
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </MobileLayout>
  );
}
