import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';

const MOCK_NOTIFICATIONS = [
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
];

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return "calendar";
      case "payment":
        return "dollar-sign";
      default:
        return "bell";
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case "booking":
        return colors.primary;
      case "payment":
        return "#4CAF50";
      default:
        return "#FFC107";
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
          <Text style={[styles.headerSubtitle, { color: colors.placeholder }]}>
            Stay updated on your bookings
          </Text>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.content}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              { backgroundColor: colors.card },
              notification.read && styles.readNotification
            ]}
            onPress={() => markAsRead(notification.id)}
          >
            <View style={styles.notificationContent}>
              <View style={styles.iconContainer}>
                <Icon
                  name={getIcon(notification.type)}
                  size={24}
                  color={getIconColor(notification.type)}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.text }]}>
                  {notification.title}
                </Text>
                <Text style={[styles.message, { color: colors.placeholder }]}>
                  {notification.message}
                </Text>
                <Text style={[styles.timestamp, { color: colors.placeholder }]}>
                  {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                </Text>
              </View>
              {!notification.read && (
                <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  headerSubtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
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
  readNotification: {
    opacity: 0.7,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 8,
  },
});
