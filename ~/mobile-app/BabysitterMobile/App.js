import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import VerificationScreen from './src/screens/VerificationScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// Import theme components
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ThemeToggle } from './src/components/ThemeToggle';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

function AppNavigator() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Stack.Navigator 
        screenOptions={{
          headerShown: true, // Header is now shown
          headerRight: () => <ThemeToggle />,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}