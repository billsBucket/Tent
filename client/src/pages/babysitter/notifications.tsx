import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { io } from "socket.io-client";
import { useAuth } from "@/hooks/use-auth";
import { 
  ArrowLeft,
  Bell,
  Calendar,
  DollarSign,
  AlertCircle
} from "lucide-react";

type Notification = {
  id: number;
  type: "booking" | "payment" | "system";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export function BabysitterNotifications() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { data: initialNotifications } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    queryFn: () => Promise.resolve([
      {
        id: 1,
        type: "booking",
        title: "New Booking Request",
        message: "You have a new booking request for tomorrow at 2 PM",
        createdAt: new Date().toISOString(),
        read: false
      },
      {
        id: 2,
        type: "payment",
        title: "Payment Received",
        message: "You received a payment of $120 for your last booking",
        createdAt: new Date().toISOString(),
        read: true
      }
    ])
  });

  useEffect(() => {
    if (initialNotifications) {
      setNotifications(initialNotifications);
    }
  }, [initialNotifications]);

  useEffect(() => {
    if (!user) return;

    // Connect to Socket.IO for real-time notifications
    const socket = io(window.location.origin, {
      path: '/api/socket',
      auth: {
        userId: user.id,
        role: 'babysitter'
      }
    });

    socket.on('notification', (newNotification: Notification) => {
      setNotifications(prev => [
        {
          ...newNotification,
          id: Date.now(),
          read: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-6 w-6 text-primary" />;
      case "payment":
        return <DollarSign className="h-6 w-6 text-green-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
    }
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/babysitter/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="ml-4">
            <h1 className="font-semibold">Notifications</h1>
            <p className="text-sm text-muted-foreground">Stay updated on your bookings</p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2 p-4">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => markAsRead(notification.id)}
            >
              <Card className={notification.read ? "opacity-75" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-primary rounded-full" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </MobileLayout>
  );
}

export default BabysitterNotifications;