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

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [userType, setUserType] = useState('parent');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = () => {
    // TODO: Implement registration
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Complete Your Profile
        </Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Tell us a bit about yourself
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'parent' && [
                  styles.userTypeButtonActive,
                  { backgroundColor: colors.primary, borderColor: colors.primary }
                ],
                { borderColor: colors.border }
              ]}
              onPress={() => setUserType('parent')}
            >
              <Text style={[
                styles.userTypeText,
                { color: userType === 'parent' ? '#fff' : colors.placeholder }
              ]}>Parent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'babysitter' && [
                  styles.userTypeButtonActive,
                  { backgroundColor: colors.primary, borderColor: colors.primary }
                ],
                { borderColor: colors.border }
              ]}
              onPress={() => setUserType('babysitter')}
            >
              <Text style={[
                styles.userTypeText,
                { color: userType === 'babysitter' ? '#fff' : colors.placeholder }
              ]}>Babysitter</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, {
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.background,
            }]}
            placeholder="Full Name"
            placeholderTextColor={colors.placeholder}
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={[styles.input, {
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.background,
            }]}
            placeholder="Email (Optional)"
            placeholderTextColor={colors.placeholder}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[
              styles.button,
              !fullName && styles.buttonDisabled,
              { backgroundColor: colors.primary }
            ]}
            onPress={handleRegister}
            disabled={!fullName}
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
  },
  content: {
    flex: 1,
    padding: 16,
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
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userTypeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    borderWidth: 1,
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
});
