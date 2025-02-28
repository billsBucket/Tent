import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [isOnline, setIsOnline] = useState(false);
  
  // Mock data - in real app this would come from API
  const todaysEarnings = 120;
  const weeklyEarnings = 840;
  const totalHours = 16;
  const unreadNotifications = 2;

  const StatCard = ({ icon, value, label, color }) => (
    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <Icon name={icon} size={24} color={color} />
      <Text style={[styles.statValue, { color: color }]}>${value}</Text>
      <Text style={[styles.statLabel, { color: colors.text }]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={[styles.welcomeText, { color: colors.text }]}>Hello, John</Text>
            <Text style={[styles.subtitle, { color: colors.placeholder }]}>Babysitter</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="bell" size={24} color={colors.text} />
            {unreadNotifications > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="settings" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Online Toggle */}
        <View style={[styles.onlineCard, { backgroundColor: colors.card }]}>
          <View>
            <Text style={[styles.onlineTitle, { color: colors.text }]}>Go Online</Text>
            <Text style={[styles.onlineSubtitle, { color: colors.placeholder }]}>
              {isOnline ? "You're available for bookings" : "You're currently offline"}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: isOnline ? colors.primary : colors.border }
            ]}
            onPress={() => setIsOnline(!isOnline)}
          >
            <View style={[
              styles.toggleCircle,
              { transform: [{ translateX: isOnline ? 20 : 0 }] }
            ]} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard icon="dollar-sign" value={todaysEarnings} label="Today's Earnings" color="#4CAF50" />
          <StatCard icon="clock" value={totalHours} label="Hours" color="#2196F3" />
          <StatCard icon="calendar" value={weeklyEarnings} label="This Week" color="#9C27B0" />
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {[
              { icon: 'user', label: 'Profile', route: 'Profile' },
              { icon: 'message-square', label: 'Messages', route: 'Messages' },
              { icon: 'dollar-sign', label: 'Earnings', route: 'Earnings' },
              { icon: 'calendar', label: 'Schedule', route: 'Schedule' },
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={() => navigation.navigate(action.route)}
              >
                <Icon name={action.icon} size={24} color={colors.primary} />
                <Text style={[styles.actionLabel, { color: colors.text }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    justifyContent: 'space-between',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  onlineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  onlineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  onlineSubtitle: {
    fontSize: 14,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 4,
  },
  toggleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFF',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: (width - 48) / 3,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickActions: {
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
