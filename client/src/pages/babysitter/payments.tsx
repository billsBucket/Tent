import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Plus, Building } from "lucide-react";

export default function BabysitterPayments() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/babysitter/settings")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 font-semibold">Payment Methods</h1>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Bank Account</p>
                  <p className="text-sm text-muted-foreground">****1234 · Primary</p>
                </div>
              </div>
              <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180" />
            </div>

            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Debit Card</p>
                  <p className="text-sm text-muted-foreground">****5678 · Backup</p>
                </div>
              </div>
              <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" variant="outline">
          <Plus className="h-5 w-5 mr-2" />
          Add Payment Method
        </Button>
      </motion.div>
    </MobileLayout>
  );
}