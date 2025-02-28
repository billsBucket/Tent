import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import theme components
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ThemeToggle } from './src/components/ThemeToggle';

// Import screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import VerificationScreen from './src/screens/VerificationScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';

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
            backgroundColor: Platform.select({
              ios: colors.iosBackground,
              android: colors.background,
            }),
          },
          headerTintColor: colors.text,
          headerShadowVisible: Platform.OS === 'ios',
          contentStyle: {
            backgroundColor: Platform.select({
              ios: colors.iosBackground,
              android: colors.background,
            }),
          },
          ...Platform.select({
            ios: {
              headerBackTitle: 'Back',
              headerLargeTitle: true,
              headerTransparent: false,
              headerBlurEffect: isDark ? 'dark' : 'light',
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