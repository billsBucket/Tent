import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  DollarSign,
  Clock,
  Calendar,
  ArrowDownToLine,
} from "lucide-react";

export default function BabysitterEarnings() {
  const [, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState("this-week");

  // Simulated data
  const currentWeekEarnings = 840;
  const lastWeekEarnings = 760;
  const totalHours = 32;
  const completedBookings = 12;

  const transactions = [
    {
      id: 1,
      date: new Date(),
      amount: 120,
      status: "completed",
      description: "Babysitting for Smith family",
    },
    {
      id: 2,
      date: subDays(new Date(), 1),
      amount: 85,
      status: "completed",
      description: "Babysitting for Johnson family",
    },
    {
      id: 3,
      date: subDays(new Date(), 2),
      amount: 150,
      status: "completed",
      description: "Babysitting for Williams family",
    },
  ];

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 pb-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-background border-b sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/babysitter/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">Earnings</h1>
          </div>
        </div>

        {/* Period Selector */}
        <div className="px-4">
          <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Earnings Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {format(startOfWeek(new Date()), "MMM d")} - {format(endOfWeek(new Date()), "MMM d")}
              </p>
              <h2 className="text-4xl font-bold text-green-600 my-2">${currentWeekEarnings}</h2>
              <div className="flex justify-center items-center space-x-1 text-sm text-green-600">
                <ArrowDownToLine className="h-4 w-4" />
                <span>+10.5% from last week</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-1 text-green-500" />
                <div className="text-lg font-semibold">${lastWeekEarnings}</div>
                <p className="text-xs text-muted-foreground">Last Week</p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                <div className="text-lg font-semibold">{totalHours}h</div>
                <p className="text-xs text-muted-foreground">Hours</p>
              </div>
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-1 text-purple-500" />
                <div className="text-lg font-semibold">{completedBookings}</div>
                <p className="text-xs text-muted-foreground">Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graph Placeholder */}
        <Card>
          <CardContent className="p-4">
            <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Earnings Graph</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Recent Transactions</h3>
              <Button variant="ghost" size="sm">
                See All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(transaction.date, "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+${transaction.amount}</p>
                  <Badge variant="outline" className="text-green-500 bg-green-50">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-medium">Weekly Breakdown</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p>Base Earnings</p>
                <p className="font-medium">${currentWeekEarnings * 0.8}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Tips</p>
                <p className="font-medium">${currentWeekEarnings * 0.15}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Bonuses</p>
                <p className="font-medium">${currentWeekEarnings * 0.05}</p>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between font-semibold">
                <p>Total</p>
                <p className="text-green-600">${currentWeekEarnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}