import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';

const OTP_LENGTH = 6;

export default function VerificationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { phoneNumber } = route.params;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    // Auto focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Check code length and validate when complete
    if (code.length === OTP_LENGTH) {
      validateCode(code);
    }
  }, [code]);

  const validateCode = async (verificationCode) => {
    try {
      // TODO: Implement actual verification logic
      if (verificationCode === '123456') { // Mock validation
        navigation.navigate('Register');
      } else {
        setError('Please enter the complete verification code');
      }
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleCodeChange = (text, index) => {
    const newCode = code.split('');
    newCode[index] = text;
    const updatedCode = newCode.join('');
    setCode(updatedCode);
    setError(''); // Clear error when user types

    // Auto-focus next input
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendCode = () => {
    // TODO: Implement resend code logic
    setCode('');
    setError('');
    inputRefs.current[0]?.focus();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color={colors.text} />
        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Verify your number
        </Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Enter the 6-digit code sent to {phoneNumber}
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.otpContainer}>
            {[...Array(OTP_LENGTH)].map((_, index) => (
              <TextInput
                key={index}
                ref={ref => inputRefs.current[index] = ref}
                style={[
                  styles.otpInput,
                  {
                    borderColor: error ? colors.destructive : colors.border,
                    color: colors.text,
                    backgroundColor: colors.background,
                  }
                ]}
                maxLength={1}
                keyboardType="number-pad"
                onChangeText={text => handleCodeChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                value={code[index] || ''}
                selectionColor={colors.primary}
              />
            ))}
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            style={styles.resendContainer}
            onPress={handleResendCode}
          >
            <Text style={[styles.resendText, { color: colors.placeholder }]}>
              Didn't receive code? Try again
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
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
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  resendContainer: {
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});