import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Heart, UserCheck, ChevronRight } from "lucide-react";

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
    <div className="fixed inset-0 bg-black flex flex-col min-h-screen">
      {/* Header with Logo and Skip */}
      <div className="flex justify-between items-center px-6 py-4">
        <img 
          src="/logo-with-name.png" 
          alt="Tent Logo" 
          className="h-5" // Further reduced logo size
        />
        <Button 
          variant="outline" 
          onClick={skipOnboarding} 
          className="text-white border-white/20 hover:bg-white/10"
          size="sm"
        >
          Skip
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {slides.map((slide, index) => (
            currentSlide === index && (
              <div key={index} className="space-y-6">
                <slide.icon className="h-16 w-16 mx-auto mb-6 text-white" />
                <h2 className="text-2xl font-bold text-white">{slide.title}</h2>
                <p className="text-gray-400 max-w-sm mx-auto">{slide.description}</p>
              </div>
            )
          ))}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-6 pb-8 space-y-6">
        <div className="flex justify-center space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-gray-700"
              }`}
            />
          ))}
        </div>

        <Button 
          className="w-full bg-white text-black hover:bg-gray-100" 
          size="lg"
          onClick={nextSlide}
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}