import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const OTP_LENGTH = 6;

export default function VerificationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;
  const [code, setCode] = useState('');
  const inputRefs = useRef([]);

  const handleCodeChange = (text, index) => {
    const newCode = code.split('');
    newCode[index] = text;
    const updatedCode = newCode.join('');
    setCode(updatedCode);

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

  const handleVerify = () => {
    if (code.length === OTP_LENGTH) {
      // TODO: Implement verification logic
      navigation.navigate('Register');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {phoneNumber}
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.otpContainer}>
            {[...Array(OTP_LENGTH)].map((_, index) => (
              <TextInput
                key={index}
                ref={ref => inputRefs.current[index] = ref}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                onChangeText={text => handleCodeChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                value={code[index] || ''}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, code.length !== OTP_LENGTH && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={code.length !== OTP_LENGTH}
          >
            <Text style={styles.buttonText}>Verify & Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#71717a',
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
    color: '#71717a',
    fontSize: 14,
  },
});