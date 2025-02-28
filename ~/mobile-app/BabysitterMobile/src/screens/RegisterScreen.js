import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [userType, setUserType] = useState('parent');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = () => {
    // TODO: Implement registration logic
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Tell us a bit about yourself
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'parent' && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType('parent')}
            >
              <Text style={[
                styles.userTypeText,
                userType === 'parent' && styles.userTypeTextActive,
              ]}>Parent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'babysitter' && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType('babysitter')}
            >
              <Text style={[
                styles.userTypeText,
                userType === 'babysitter' && styles.userTypeTextActive,
              ]}>Babysitter</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email (Optional)"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Create Account</Text>
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
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  userTypeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    alignItems: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  userTypeText: {
    color: '#71717a',
    fontSize: 16,
  },
  userTypeTextActive: {
    color: '#fff',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
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
});
