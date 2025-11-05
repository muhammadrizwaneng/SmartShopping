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
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faStore,
} from '@fortawesome/free-solid-svg-icons';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {colors} from '../../theme/color';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../redux/userSlice';

// React Hook Form + Yup
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: {email: string; password: string}) => {
    console.log('Login Data:', data);
    try {
      setIsLoading(true);
      const payload = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };
      const response = await dispatch(loginUser(payload) as any).unwrap();
      console.log('Login Success:', response);
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.gradient}>
        {/* Header */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <FontAwesomeIcon icon={faStore} size={60} color={colors.white} />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue shopping smart
          </Text>
        </Animatable.View>

        {/* Form */}
        <Animatable.View
          animation="fadeInUp"
          delay={300}
          style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              icon={faEnvelope}
              size={20}
              color={colors.gray}
              style={styles.inputIcon}
            />
            <Controller
              control={control}
              name="email"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.gray}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
          </View>
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          {/* Password */}
          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              icon={faLock}
              size={20}
              color={colors.gray}
              style={styles.inputIcon}
            />
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.gray}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!showPassword}
                />
              )}
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
          {errors.password && (
            
              <Text style={styles.errorText}>{errors.password.message}</Text>
 
          )}

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Signup */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  gradient: {flex: 1, paddingHorizontal: spacing.screenPadding},
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
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
  formContainer: {flex: 1, justifyContent: 'center', paddingBottom: 50},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    ...spacing.shadow.md,
  },
  inputIcon: {marginRight: spacing.sm},
  input: {
    flex: 1,
    height: 50,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  eyeIcon: {padding: spacing.sm},
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: spacing.sm,
    // marginLeft: 5,
    backgroundColor:'#fff',
    alignSelf:'flex-end',
    padding:10,
    paddingVertical:4,
    borderRadius:10
  },
  forgotPassword: {alignSelf: 'flex-end', marginBottom: spacing.lg},
  forgotPasswordText: {color: colors.white, fontSize: typography.fontSize.sm},
  loginButton: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...spacing.shadow.md,
  },
  loginButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {color: colors.white, fontSize: typography.fontSize.base},
  signupLink: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
