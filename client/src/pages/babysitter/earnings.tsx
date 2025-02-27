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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  DollarSign,
  Clock,
  Calendar,
  ArrowDownToLine,
  ArrowUpToLine,
  Download,
} from "lucide-react";

// Simulated data for the chart
const chartData = [
  { day: 'Mon', earnings: 120 },
  { day: 'Tue', earnings: 150 },
  { day: 'Wed', earnings: 180 },
  { day: 'Thu', earnings: 140 },
  { day: 'Fri', earnings: 200 },
  { day: 'Sat', earnings: 220 },
  { day: 'Sun', earnings: 180 },
];

export default function BabysitterEarnings() {
  const [, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState("this-week");

  // Simulated data
  const currentWeekEarnings = 840;
  const lastWeekEarnings = 760;
  const totalHours = 32;
  const completedBookings = 12;
  const earningTrend = ((currentWeekEarnings - lastWeekEarnings) / lastWeekEarnings) * 100;

  const transactions = [
    {
      id: 1,
      date: new Date(),
      amount: 120,
      status: "completed",
      description: "Babysitting for Smith family",
      hours: 4,
      rate: 30,
      bonus: 0,
    },
    {
      id: 2,
      date: subDays(new Date(), 1),
      amount: 85,
      status: "completed",
      description: "Babysitting for Johnson family",
      hours: 3,
      rate: 28,
      bonus: 1,
    },
    {
      id: 3,
      date: subDays(new Date(), 2),
      amount: 150,
      status: "completed",
      description: "Babysitting for Williams family",
      hours: 5,
      rate: 30,
      bonus: 0,
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Period Selector */}
        <div className="px-4">
          <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
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
              <div className="flex justify-center items-center space-x-1 text-sm">
                {earningTrend >= 0 ? (
                  <ArrowUpToLine className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownToLine className="h-4 w-4 text-red-600" />
                )}
                <span className={earningTrend >= 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(earningTrend).toFixed(1)}% from last week
                </span>
              </div>
            </div>

            <div className="mt-6 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-1 text-green-500" />
                <div className="text-lg font-semibold">${(currentWeekEarnings / totalHours).toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">Per Hour</p>
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
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{format(transaction.date, "MMM d, yyyy")}</span>
                    <span>•</span>
                    <span>{transaction.hours} hours</span>
                    {transaction.bonus > 0 && (
                      <>
                        <span>•</span>
                        <Badge variant="outline" className="text-green-500 bg-green-50">
                          +${transaction.bonus} bonus
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+${transaction.amount}</p>
                  <p className="text-sm text-muted-foreground">${transaction.rate}/hr</p>
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