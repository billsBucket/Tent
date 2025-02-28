import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  Calendar as CalendarIcon,
  Clock,
  Repeat,
  Sparkles,
} from "lucide-react";

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  dayOfWeek: number; // 0-6 for Sunday-Saturday
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

interface SmartAvailabilityCalendarProps {
  onAvailabilityChange?: (availability: DayAvailability[]) => void;
  suggestedSlots?: TimeSlot[];
}

export function SmartAvailabilityCalendar({ 
  onAvailabilityChange,
  suggestedSlots 
}: SmartAvailabilityCalendarProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [repeatPattern, setRepeatPattern] = useState<"none" | "weekly" | "biweekly" | "monthly">("none");

  // Time slots that the AI suggests based on historical booking patterns
  const [aiSuggestions, setAiSuggestions] = useState<TimeSlot[]>([
    { start: "09:00", end: "17:00" }, // Example suggestion
  ]);

  useEffect(() => {
    // Initialize availability for each day of the week
    if (availability.length === 0) {
      const initialAvailability: DayAvailability[] = Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i,
        isAvailable: false,
        timeSlots: []
      }));
      setAvailability(initialAvailability);
    }
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // When a date is selected, show AI suggestions for optimal time slots
      if (isAIEnabled) {
        requestAISuggestions(date);
      }
    }
  };

  const requestAISuggestions = async (date: Date) => {
    try {
      // Here we would make an API call to get AI suggestions
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      const simulatedSuggestions: TimeSlot[] = [
        { start: "09:00", end: "12:00" },
        { start: "14:00", end: "18:00" }
      ];
      setAiSuggestions(simulatedSuggestions);
      
      toast({
        title: "AI Suggestions Ready",
        description: "We've analyzed your booking patterns and suggested optimal time slots.",
      });
    } catch (error) {
      toast({
        title: "Couldn't get AI suggestions",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const applyAISuggestions = () => {
    if (!selectedDate) return;
    
    const dayOfWeek = selectedDate.getDay();
    const updatedAvailability = [...availability];
    const dayAvailability = updatedAvailability[dayOfWeek];
    
    dayAvailability.isAvailable = true;
    dayAvailability.timeSlots = aiSuggestions;
    
    setAvailability(updatedAvailability);
    onAvailabilityChange?.(updatedAvailability);

    toast({
      title: "AI Suggestions Applied",
      description: "Your availability has been updated with AI recommendations.",
    });
  };

  const handleRepeatChange = (value: "none" | "weekly" | "biweekly" | "monthly") => {
    setRepeatPattern(value);
    if (value !== "none" && selectedDate) {
      // Apply the current day's availability to future dates based on the pattern
      toast({
        title: "Availability Pattern Set",
        description: `Your availability will repeat ${value}`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Smart Availability Calendar</h3>
            <p className="text-sm text-muted-foreground">
              Set your availability with AI-powered suggestions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-primary" />
            <Switch
              checked={isAIEnabled}
              onCheckedChange={setIsAIEnabled}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="border rounded-lg p-4"
          />

          {selectedDate && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Repeat className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Repeat Pattern</span>
                </div>
                <Select value={repeatPattern} onValueChange={handleRepeatChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Don't repeat</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isAIEnabled && aiSuggestions.length > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="font-medium">AI Suggestions</span>
                    </div>
                    <div className="space-y-2">
                      {aiSuggestions.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {slot.start} - {slot.end}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-primary">
                            Recommended
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full mt-2"
                      size="sm"
                      onClick={applyAISuggestions}
                    >
                      Apply AI Suggestions
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
