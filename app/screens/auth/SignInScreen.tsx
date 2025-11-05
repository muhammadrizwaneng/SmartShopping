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
  Image,
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
    >
        <Image source={require('../../assets/images/Mask_group.png')} />

          <View style={{height:135,width:88,alignSelf:'flex-end',marginTop:-150}}>
            <Image source={require('../../assets/images/mask_group_2.png')} style={{width:'100%',height:'100%'}}/>
          </View>
          <View style={{height:450,width:350,alignSelf:'flex-end',position:'absolute',bottom:0,right:-70}}>
            <Image source={require('../../assets/images/mask_group_3.png')} style={{width:'100%',height:'100%'}}/>
          </View>
          <View style={{paddingHorizontal:20,marginTop:52}}>
            <Text style={styles.subtitle}>
              Login
            </Text>
            <View style={{flexDirection:'row',alignItems:'center',gap:5,    marginTop:19,
    marginBottom:24}}>
              <Text style={styles.subtitle1}>Good to see you back!</Text>
              <Image source={require('../../assets/images/heart.png')} style={{width:17,height:17}}/>
            </View>
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
                {isLoading ? 'Signing In...' : 'Next'}
              </Text>
            </TouchableOpacity>

            {/* Signup */}
            <View style={styles.signupContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('LandingScreen')}>
                <Text style={styles.signupLink}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>

    </KeyboardAvoidingView>
  );
};


export default LoginScreen;
const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor:'#fff'},
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    color: colors.white,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle1:{
    fontFamily:'nunito-sans.light',
    fontSize: 19,
    color: '#000',
  },
  subtitle: {
    fontSize: 52,
    color: '#000',
    // marginTop: spacing.sm,
    // opacity: 0.9,
    // textAlign: 'center',
  },
  formContainer: {flex: 1, justifyContent: 'center', paddingBottom: 50},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    ...spacing.shadow.md,
  },
  inputIcon: {marginRight: spacing.sm},
  input: {
    flex: 1,
    height: 52,
    // fontSize: typography.fontSize.base,
    // color: colors.textPrimary,
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
    backgroundColor: '#004CFF',
    borderRadius: 20,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...spacing.shadow.md,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 22,
    fontFamily:'nunito-sans.light',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {color: colors.white, fontSize: typography.fontSize.base},
  signupLink: {
    color: colors.black,
    fontSize: 15,
    fontFamily:'nunito-sans.light',
  },
});
