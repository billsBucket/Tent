import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import VerificationScreen from './src/screens/VerificationScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TrackingScreen from './src/screens/booking/TrackingScreen';
import RecommendationsScreen from './src/screens/RecommendationsScreen';

// Import theme components
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ThemeToggle } from './src/components/ThemeToggle';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

function AppNavigator() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={Platform.OS === 'ios' ? 'transparent' : colors.background}
      />
      <Stack.Navigator 
        screenOptions={{
          headerShown: true,
          headerRight: () => <ThemeToggle />,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: Platform.OS === 'ios',
          contentStyle: {
            backgroundColor: colors.background,
          },
          ...Platform.select({
            ios: {
              headerBackTitle: 'Back',
              headerLargeTitle: true,
              headerTransparent: false,
              animation: 'slide_from_right',
            },
            android: {
              headerElevation: 4,
              animation: 'fade_from_bottom',
            },
          }),
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ 
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{
            title: 'Sign In',
            ...Platform.select({
              ios: {
                headerLargeTitle: true,
              },
            }),
          }}
        />
        <Stack.Screen 
          name="Verification" 
          component={VerificationScreen}
          options={{
            title: 'Verify',
            ...Platform.select({
              ios: {
                headerLargeTitle: false,
              },
            }),
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{
            title: 'Create Account',
            ...Platform.select({
              ios: {
                headerLargeTitle: true,
              },
            }),
          }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            title: 'Home',
            headerLeft: null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            title: 'Notifications',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{
            title: 'Messages',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="BookingTracking"
          component={TrackingScreen}
          options={{
            title: 'Track Booking',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Recommendations"
          component={RecommendationsScreen}
          options={{
            title: 'AI Recommendations',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}