import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Star, Clock } from "lucide-react";
import type { User } from "@shared/schema";

export default function ParentHome() {
  const [, setLocation] = useLocation();
  const { data: babysitters, isLoading, error } = useQuery<User[]>({
    queryKey: ["/api/babysitters"],
  });

  const navigateToBabysitter = (id: number) => {
    setLocation(`/parent/babysitter/${id}`);
  };

  if (error) {
    return (
      <MobileLayout>
        <div className="text-center p-4">
          <p className="text-red-500">Failed to load babysitters. Please try again later.</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Find a Babysitter</h1>
          <p className="text-muted-foreground">Browse trusted and verified babysitters</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search babysitters..." 
            className="pl-10"
          />
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (babysitters || []).map((sitter) => (
            <motion.div
              key={sitter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className="cursor-pointer"
                onClick={() => navigateToBabysitter(sitter.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sitter.username}`} />
                      <AvatarFallback>{sitter.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">{sitter.fullName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        <span>4.8</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>${sitter.profileData?.hourlyRate ?? 15}/hr</span>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}