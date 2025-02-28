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
    // Auto focus first input
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Validate code automatically when complete
    if (code.length === OTP_LENGTH) {
      validateCode(code);
    }
  }, [code]);

  const validateCode = async (verificationCode) => {
    try {
      // TODO: Implement actual verification logic
      if (verificationCode === '123456') {
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
    setError('');

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
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>
        Verify your number
      </Text>
      <Text style={[styles.subtitle, { color: colors.placeholder }]}>
        Enter the 6-digit code sent to {phoneNumber}
      </Text>

      <View style={styles.codeContainer}>
        {[...Array(OTP_LENGTH)].map((_, index) => (
          <TextInput
            key={index}
            ref={ref => inputRefs.current[index] = ref}
            style={[
              styles.codeInput,
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
        style={styles.tryAgainButton}
        onPress={handleResendCode}
      >
        <Text style={[styles.tryAgainText, { color: colors.placeholder }]}>
          Didn't receive code? Try again
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: Platform.OS === 'ios' ? 100 : 60,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  codeInput: {
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
    marginBottom: 24,
    textAlign: 'center',
  },
  tryAgainButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
  },
  tryAgainText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});