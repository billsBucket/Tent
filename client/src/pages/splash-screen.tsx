import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";

export default function SplashScreen() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <MobileLayout className="flex items-center justify-center bg-black">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.img 
          src="/attached_assets/1.png"
          alt="Tent Logo"
          className="w-24 h-24 mx-auto"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </MobileLayout>
  );
}