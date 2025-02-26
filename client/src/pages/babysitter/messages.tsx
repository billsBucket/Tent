import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { 
  ArrowLeft,
  Search,
  MessageSquare,
  Clock,
  Send,
  Check,
  CheckCheck
} from "lucide-react";

type Message = {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
};

type Chat = {
  id: number;
  parentName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: Message[];
};

export function BabysitterMessages() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);

  // Get chats from API
  const { data: chats = [], refetch: refetchChats } = useQuery<Chat[]>({
    queryKey: ["/api/chats"],
    queryFn: () => Promise.resolve([
      {
        id: 1,
        parentName: "Sarah Johnson",
        lastMessage: "What time will you arrive?",
        timestamp: new Date().toISOString(),
        unread: 2,
        messages: [
          {
            id: 1,
            senderId: 2, // parent
            content: "Hi, are you available tomorrow at 2 PM?",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: "read"
          },
          {
            id: 2,
            senderId: 1, // babysitter
            content: "Yes, I am! Should I bring any specific activities?",
            timestamp: new Date(Date.now() - 3000000).toISOString(),
            status: "read"
          },
          {
            id: 3,
            senderId: 2,
            content: "What time will you arrive?",
            timestamp: new Date().toISOString(),
            status: "delivered"
          }
        ]
      }
    ])
  });

  useEffect(() => {
    if (!user) return;

    // Connect to Socket.IO
    const newSocket = io(window.location.origin, {
      path: '/api/socket',
      auth: {
        userId: user.id,
        role: 'babysitter'
      }
    });

    newSocket.on('receive_message', (message: Message) => {
      if (selectedChat?.id === message.senderId) {
        setSelectedChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message],
          lastMessage: message.content,
          timestamp: message.timestamp
        } : null);
      }
      refetchChats();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, selectedChat?.id]);

  const handleSend = () => {
    if (!message.trim() || !selectedChat || !socket) return;

    const newMessage: Partial<Message> = {
      senderId: user!.id,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      status: "sent"
    };

    // Emit the message through socket
    socket.emit('send_message', {
      recipientId: selectedChat.id,
      content: newMessage.content,
      timestamp: newMessage.timestamp
    });

    // Update local state
    setSelectedChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage as Message],
      lastMessage: newMessage.content,
      timestamp: newMessage.timestamp
    } : null);

    setMessage("");
  };

  const getMessageStatus = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-4 w-4" />;
      case "delivered":
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
      case "read":
        return <CheckCheck className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
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
              {selectedChat.messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${msg.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                    <p>{msg.content}</p>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <span className="text-xs opacity-70">
                        {format(new Date(msg.timestamp), "h:mm a")}
                      </span>
                      {msg.senderId === user?.id && getMessageStatus(msg.status)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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