import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { 
  ArrowLeft,
  Search,
  MessageSquare,
  Clock,
  Send
} from "lucide-react";

type Chat = {
  id: number;
  parentName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
};

export function BabysitterMessages() {
  const [, setLocation] = useLocation();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");

  // Simulated chats data - would come from API
  const chats: Chat[] = [
    {
      id: 1,
      parentName: "Sarah Johnson",
      lastMessage: "What time will you arrive?",
      timestamp: new Date().toISOString(),
      unread: 2
    },
    {
      id: 2,
      parentName: "Michael Brown",
      lastMessage: "Thanks for taking care of Tim!",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      unread: 0
    }
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-screen flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (selectedChat) {
                setSelectedChat(null);
              } else {
                setLocation("/babysitter/dashboard");
              }
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 font-semibold">
            {selectedChat ? selectedChat.parentName : "Messages"}
          </h1>
        </div>

        {selectedChat ? (
          // Chat View
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {/* Messages would go here */}
              <div className="text-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 inline-block mr-1" />
                {format(new Date(), "MMM d, h:mm a")}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!message.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Chats List
          <div className="flex-1">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2 p-4">
              {chats.map((chat) => (
                <Card
                  key={chat.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedChat(chat)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.parentName}`} />
                        <AvatarFallback>{chat.parentName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{chat.parentName}</h3>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(chat.timestamp), "h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {chat.lastMessage}
                        </p>
                      </div>
                      {chat.unread > 0 && (
                        <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground">
                            {chat.unread}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </MobileLayout>
  );
}

export default BabysitterMessages;