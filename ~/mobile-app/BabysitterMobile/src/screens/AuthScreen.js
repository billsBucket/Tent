import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function AuthScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length > 0) {
      if (cleaned.length <= 3) {
        formatted = `(${cleaned}`;
      } else if (cleaned.length <= 6) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      } else {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      }
    }

    return formatted;
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const handleContinue = () => {
    navigation.navigate('Verification', { phoneNumber });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
          <View style={[styles.icon, { backgroundColor: colors.placeholder }]} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {isNewUser ? 'Create Account' : 'Welcome Back'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Enter your phone number to {isNewUser ? 'get started' : 'continue'}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.background,
            }]}
            placeholder="(555) 000-0000"
            placeholderTextColor={colors.placeholder}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            maxLength={14}
          />

          <TouchableOpacity
            style={[
              styles.button,
              !phoneNumber && styles.buttonDisabled,
              { backgroundColor: colors.primary }
            ]}
            onPress={handleContinue}
            disabled={!phoneNumber}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setIsNewUser(!isNewUser)}
          >
            <Text style={[styles.linkText, { color: colors.placeholder }]}>
              {isNewUser
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    opacity: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  linkButton: {
    padding: 16,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
});