import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faStore,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { colors, typography, spacing } from '../../theme';
import { Button, Input } from '../../components';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/userSlice';

// React Hook Form + Yup
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    console.log('Login Data:', data);
    try {
      setIsLoading(true);
      const payload = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };
      const response = await dispatch(loginUser(payload) as any).unwrap();
      console.log('Login Success:', response);
      if (response && (response.status === 200 || response.access_token)) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    } catch (e) {
      console.log('Login Error:', e);
      Alert.alert('Error', 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log('Cancel button pressed');  // <-- added console log
            navigation.navigate('LandingScreen');
          }}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Good to see you back!</Text>
          <FontAwesomeIcon icon={faHeart} size={16} color={colors.textPrimary} style={styles.heartIcon} />
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<FontAwesomeIcon icon={faEnvelope} size={20} color={colors.gray} />}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View style={styles.passwordContainer}>
                <FontAwesomeIcon icon={faLock} size={20} color={colors.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.textLight}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size={20} color={colors.gray} />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title={isLoading ? 'Signing In...' : 'Next'}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            variant="primary"
            size="lg"
            style={styles.loginButton}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};


export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  cancelButton: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  cancelText: {
    fontFamily: typography.fontFamily.light,
    fontSize: typography.fontSize['2xl'],
    color: colors.textSecondary,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['14xl'],
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -0.52,
    marginBottom: spacing.sm,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontFamily: typography.fontFamily.light,
    fontSize: typography.fontSize['6xl'],
    color: colors.textPrimary,
    marginRight: spacing.xs,
  },
  heartIcon: {
    marginTop: 2,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: spacing.borderRadius.xl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    ...spacing.shadow.sm,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: 52,
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  eyeIcon: {
    padding: spacing.sm,
  },
  errorText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs / 2,
    marginBottom: spacing.sm,
    alignSelf: 'flex-end',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.sans,
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
});
