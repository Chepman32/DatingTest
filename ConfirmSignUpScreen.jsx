import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Auth } from '@aws-amplify/auth';

const ConfirmSignUpScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirmSignUp = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the confirmation code');
      return;
    }
    try {
      setLoading(true);
      await Auth.confirmSignUp(email, code);
      Alert.alert('Success', 'Your account has been confirmed. Please login.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Confirmation Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await Auth.resendSignUp(email);
      Alert.alert('Success', 'Confirmation code resent');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Email</Text>
      <Text style={styles.subtitle}>
        A confirmation code has been sent to {email}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Confirmation Code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleConfirmSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Confirm</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendCode}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ConfirmSignUpScreen;