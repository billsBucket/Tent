import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

export default function TrackingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { bookingId } = route.params;

  // Mock data - in a real app, this would come from your API
  const mockBabysitter = {
    id: 1,
    fullName: "Sarah Johnson",
    username: "sarah_j",
    location: {
      latitude: 37.7749,
      longitude: -122.4194
    }
  };

  const mockBooking = {
    id: bookingId,
    childrenNames: ["Emma", "Jack"],
    status: "active"
  };

  const handleCall = () => {
    // Implement call functionality
  };

  const handleMessage = () => {
    navigation.navigate('Messages', { babysitterId: mockBabysitter.id });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Track Booking
        </Text>
      </View>

      {/* Map View would go here - using a placeholder for now */}
      <View style={styles.mapContainer}>
        <Text style={[styles.placeholderText, { color: colors.placeholder }]}>
          Map Loading...
        </Text>
      </View>

      <View style={[styles.bottomPanel, { backgroundColor: colors.card }]}>
        <View style={styles.babysitterInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {mockBabysitter.fullName[0]}
            </Text>
          </View>
          <View style={styles.infoText}>
            <Text style={[styles.name, { color: colors.text }]}>
              {mockBabysitter.fullName}
            </Text>
            <Text style={[styles.status, { color: colors.placeholder }]}>
              Currently with {mockBooking.childrenNames.join(" & ")}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.border }]}
            onPress={handleMessage}
          >
            <Icon name="message-square" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.border }]}
            onPress={handleCall}
          >
            <Icon name="phone" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.emergencyButton, { backgroundColor: colors.destructive }]}
        >
          <Icon name="alert-triangle" size={24} color="#FFF" style={styles.emergencyIcon} />
          <Text style={styles.emergencyText}>Emergency SOS</Text>
        </TouchableOpacity>
      </View>
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
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
  },
  bottomPanel: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  babysitterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  emergencyIcon: {
    marginRight: 8,
  },
  emergencyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
