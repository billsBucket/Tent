import React from 'react';
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

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleLogout = async () => {
    // TODO: Implement logout logic
    navigation.navigate('Auth');
  };

  const MenuItem = ({ icon, label, route, color = colors.primary }) => (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: colors.card }]}
      onPress={() => route && navigation.navigate(route)}
    >
      <View style={styles.menuItemLeft}>
        <Icon name={icon} size={24} color={color} />
        <Text style={[styles.menuItemText, { color: colors.text }]}>{label}</Text>
      </View>
      <Icon name="chevron-right" size={20} color={colors.placeholder} />
    </TouchableOpacity>
  );

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Account Settings */}
        <View style={styles.section}>
          <MenuItem 
            icon="shield" 
            label="Security" 
            route="Security"
            color="#2196F3"
          />
          <MenuItem 
            icon="lock" 
            label="Privacy" 
            route="Privacy"
            color="#4CAF50"
          />
          <MenuItem 
            icon="credit-card" 
            label="Payment Methods" 
            route="PaymentMethods"
            color="#9C27B0"
          />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <MenuItem 
            icon="bell" 
            label="Notification Settings" 
            route="NotificationSettings"
            color="#FF9800"
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <MenuItem 
            icon="help-circle" 
            label="Help & Support" 
            route="Help"
            color="#00BCD4"
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.destructive }]}
          onPress={handleLogout}
        >
          <Icon name="log-out" size={20} color="#FFF" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
