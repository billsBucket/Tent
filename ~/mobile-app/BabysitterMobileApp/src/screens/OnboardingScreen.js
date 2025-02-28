import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: "Secure Bookings",
    description: "Book trusted babysitters with confidence through our secure platform",
    icon: "shield",
  },
  {
    title: "Verified Sitters",
    description: "All babysitters are verified with government ID and face validation",
    icon: "user-check",
  },
  {
    title: "Family First",
    description: "Create detailed profiles for your family's specific needs",
    icon: "heart",
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnim = new Animated.Value(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        slideAnim.setValue(0);
        setCurrentSlide(curr => curr + 1);
      });
    } else {
      navigation.navigate('Auth');
    }
  };

  const skipOnboarding = () => navigation.navigate('Auth');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {/* Logo will be added here */}
        </View>
        <TouchableOpacity 
          onPress={skipOnboarding}
          style={styles.skipButton}
        >
          <Text style={[styles.skipText, { color: colors.text }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={[
          styles.slideContainer,
          {
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <View style={styles.slide}>
          <Icon 
            name={slides[currentSlide].icon} 
            size={80} 
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: colors.text }]}>
            {slides[currentSlide].title}
          </Text>
          <Text style={[styles.description, { color: colors.placeholder }]}>
            {slides[currentSlide].description}
          </Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === currentSlide ? colors.primary : colors.border,
                }
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={nextSlide}
        >
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
          <Icon name="chevron-right" size={20} color="#FFF" style={styles.buttonIcon} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoContainer: {
    width: 100,
    height: 40,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});