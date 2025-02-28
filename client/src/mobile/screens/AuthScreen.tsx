import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PhoneInput from 'react-native-phone-number-input';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useAuth } from '../hooks/useAuth';

type Step = 'phone' | 'verify' | 'register';

export default function AuthScreen() {
  const navigation = useNavigation();
  const { loginMutation } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [isNewUser, setIsNewUser] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneSubmit = () => {
    // TODO: Implement phone verification
    setStep('verify');
  };

  const handleVerifySubmit = (code: string) => {
    if (!isNewUser) {
      loginMutation.mutate({
        phoneNumber,
        otp: code,
      });
    } else {
      setStep('register');
    }
  };

  const renderPhoneStep = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {/* TODO: Add Icon Component */}
        </View>
        <Text style={styles.title}>
          {isNewUser ? 'Create Account' : 'Welcome back'}
        </Text>
        <Text style={styles.subtitle}>
          Enter your phone number to {isNewUser ? 'get started' : 'continue'}
        </Text>

        <View style={styles.inputContainer}>
          <PhoneInput
            defaultCode="US"
            layout="first"
            onChangeFormattedText={setPhoneNumber}
            containerStyle={styles.phoneInput}
            textContainerStyle={styles.phoneInputText}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handlePhoneSubmit}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setIsNewUser(!isNewUser)}
          >
            <Text style={styles.linkText}>
              {isNewUser
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderVerifyStep = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setStep('phone')}
        >
          <Text>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {phoneNumber}
        </Text>

        <View style={styles.inputContainer}>
          <OTPInputView
            style={styles.otpInput}
            pinCount={6}
            onCodeFilled={handleVerifySubmit}
            autoFocusOnLoad
            codeInputFieldStyle={styles.otpField}
            codeInputHighlightStyle={styles.otpFieldFocused}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {/* TODO: Resend code */}}
          >
            <Text style={styles.buttonText}>Verify & Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setStep('phone')}
          >
            <Text style={styles.linkText}>
              Didn't receive code? Try again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 'phone':
        return renderPhoneStep();
      case 'verify':
        return renderVerifyStep();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderStep()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f4f4f5',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  phoneInput: {
    width: '100%',
    marginBottom: 16,
  },
  phoneInputText: {
    backgroundColor: '#f4f4f5',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
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
  otpInput: {
    width: '100%',
    height: 50,
    marginBottom: 16,
  },
  otpField: {
    backgroundColor: '#f4f4f5',
    borderRadius: 8,
    color: '#000',
  },
  otpFieldFocused: {
    borderColor: '#000',
    borderWidth: 2,
  },
});
