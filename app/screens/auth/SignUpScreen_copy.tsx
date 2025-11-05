import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import { colors } from '../../theme/color';
import { faEnvelope, faEye, faEyeSlash, faLock, faPerson } from '@fortawesome/free-solid-svg-icons';

const SignupScreen = ({navigation}: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.gradient}>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animatable.View animation="fadeInDown" style={styles.header}>
            <FontAwesomeIcon icon={faPerson} size={60} color={colors.white}/>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us for smart shopping experience</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={300} style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faPerson} size={20} color={colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.gray}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faEnvelope} size={20} color={colors.gray} />

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
                <FontAwesomeIcon icon={faLock} size={20} color={colors.gray} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}>
                <FontAwesomeIcon 
                   icon={showPassword ? faEye : faEyeSlash} 
                   size={20} 
                   color={colors.gray} 
                 />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} size={20} color={colors.gray}/>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={colors.gray}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}>
                <FontAwesomeIcon 
                   icon={showConfirmPassword ? faEye : faEyeSlash} 
                   size={20} 
                   color={colors.gray} 
                 />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              disabled={isLoading}>
              <Text style={styles.signupButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    minHeight: 200,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    marginTop: spacing.sm,
    opacity: 0.9,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    ...spacing.shadow.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  eyeIcon: {
    padding: spacing.sm,
  },
  signupButton: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    ...spacing.shadow.md,
  },
  signupButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
  },
  loginLink: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;