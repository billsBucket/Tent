import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

const MOCK_CHATS = [
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
];

export default function MessagesScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState(MOCK_CHATS);
  const userId = 1; // Mock user ID (babysitter)

  const handleSend = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      senderId: userId,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      status: "sent"
    };

    setSelectedChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: newMessage.content,
      timestamp: newMessage.timestamp
    }));

    setMessage("");
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case "sent":
        return "check";
      case "delivered":
        return "check-circle";
      case "read":
        return "check-circle";
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return colors.placeholder;
      case "delivered":
        return colors.primary;
      case "read":
        return "#4CAF50";
      default:
        return colors.placeholder;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (selectedChat) {
              setSelectedChat(null);
            } else {
              navigation.goBack();
            }
          }}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {selectedChat ? selectedChat.parentName : "Messages"}
        </Text>
      </View>

      {selectedChat ? (
        // Chat View
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.chatContainer}
        >
          <ScrollView style={styles.messagesContainer}>
            {selectedChat.messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  msg.senderId === userId ? styles.sentMessage : styles.receivedMessage
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    {
                      backgroundColor: msg.senderId === userId ? colors.primary : colors.card,
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color: msg.senderId === userId ? '#fff' : colors.text
                      }
                    ]}
                  >
                    {msg.content}
                  </Text>
                  <View style={styles.messageFooter}>
                    <Text
                      style={[
                        styles.messageTime,
                        {
                          color: msg.senderId === userId ? 'rgba(255,255,255,0.7)' : colors.placeholder
                        }
                      ]}
                    >
                      {format(new Date(msg.timestamp), "h:mm a")}
                    </Text>
                    {msg.senderId === userId && (
                      <Icon
                        name={getMessageStatus(msg.status)}
                        size={14}
                        color={getStatusColor(msg.status)}
                        style={styles.statusIcon}
                      />
                    )}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.placeholder}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: colors.primary },
                !message.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        // Chats List
        <ScrollView style={styles.chatsContainer}>
          {chats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={[styles.chatCard, { backgroundColor: colors.card }]}
              onPress={() => setSelectedChat(chat)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{chat.parentName[0]}</Text>
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={[styles.chatName, { color: colors.text }]}>
                    {chat.parentName}
                  </Text>
                  <Text style={[styles.chatTime, { color: colors.placeholder }]}>
                    {format(new Date(chat.timestamp), "h:mm a")}
                  </Text>
                </View>
                <Text
                  style={[styles.lastMessage, { color: colors.placeholder }]}
                  numberOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
              </View>
              {chat.unread > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.unreadText}>{chat.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatsContainer: {
    flex: 1,
    padding: 16,
  },
  chatCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#757575',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatTime: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 14,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
  },
  messageText: {
    fontSize: 16,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  statusIcon: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
