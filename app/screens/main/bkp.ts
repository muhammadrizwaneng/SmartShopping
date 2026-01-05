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
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { colors, typography, spacing } from '../../theme';
import { Button, Input } from '../../components';
import { faEnvelope, faEye, faEyeSlash, faLock, faPerson, faCamera } from '@fortawesome/free-solid-svg-icons';
import CountryPicker from 'react-native-country-picker-modal';
import ImageCropPicker from 'react-native-image-crop-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiConfig from '../../config/api-config';
import { CallServiceFor } from '../../services/call_services_for';

const getEmojiFlag = (countryCode: string) => {
  const flag = countryCode
    .toUpperCase()
    .replace(/./g, (char: string) => String.fromCodePoint(char.charCodeAt(0) + 127397));
  return flag;
};

const getEmojiFlagByCca2 = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char: string) => 0x1f1e6 - 65 + char.charCodeAt(0));
  const flag = String.fromCodePoint(...codePoints);
  console.log('Flag emoji:', flag);
  return flag;
};

const SignupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState<any>('');
  const [confirmPassword, setConfirmPassword] = useState<any>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState({
    code: 'US',
    callingCode: '1',
    flag: getEmojiFlag('US'),
  });
  const [profileImage, setProfileImage] = useState<any>(null);

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



    const payload = {
      'name': name,
      'email': email,
      'password': password,
      'confirmPassword': confirmPassword,
      'phoneNumber': phoneNumber,
      'profileImage': profileImage,
      'country': country,
      'role': 'user',
    };
    console.log('payload:', payload);

    try {
      setIsLoading(true);
      const response = await CallServiceFor(ApiConfig.SIGNUP, 'post', payload);

      console.log(response);
      if (response.status == 200 || response.status == 201) {
        Alert.alert('Success', 'Signup Successful!');
        const userResponse = response.data;
        // The API returns access_token on signup too as per doc
        if (userResponse.access_token) {
          await AsyncStorage.setItem('token', userResponse.access_token);
          await AsyncStorage.setItem('userData', JSON.stringify({
            user: userResponse,
            token: userResponse.access_token,
            isLoggedIn: true,
          }));
        }
        navigation.navigate('signupStep2', { user: userResponse });
      } else {
        Alert.alert('Error', response.data?.message || 'Signup failed');
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error', error.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = (country: any) => {
    if (country.callingCode[0]) {
      setCountry({
        code: country.cca2,
        callingCode: country.callingCode[0],
        flag: getEmojiFlagByCca2(country.cca2),
      });
    } else {
      setCountry({
        code: 'US',
        callingCode: '1',
        flag: getEmojiFlag('US'),
      });
    }
  };

  const handleTextChange = (text: string) => {
    let filteredText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(filteredText);
  };

  const handleImagePick = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,   // ✅ MUST ADD THIS
    })
      .then((image: any) => {
        console.log('Selected image:', image);

        const base64Img = `data:${image.mime};base64,${image.data}`;

        setProfileImage(base64Img); // ✅ send base64 to backend
      })
      .catch((error) => {
        console.error('Image selection error:', error);
      });
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('LandingScreen')} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Create {'\n'}Account</Text>

        <View style={styles.uploadImageContainer}>
          <TouchableOpacity onPress={handleImagePick} style={styles.uploadButton}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.uploadImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <FontAwesomeIcon icon={faCamera} size={24} color={colors.gray} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Input
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              leftIcon={<FontAwesomeIcon icon={faPerson} size={20} color={colors.gray} />}
            />

            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<FontAwesomeIcon icon={faEnvelope} size={20} color={colors.gray} />}
            />

            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} size={20} color={colors.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size={20} color={colors.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} size={20} color={colors.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={colors.textLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} size={20} color={colors.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.countryPickMainView}>
              <TouchableOpacity
                onPress={() => setShowCountryPicker(true)}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.countryPicker}>
                  <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    visible={showCountryPicker}
                    onSelect={handleCountrySelect}
                    countryCode={country.code as any}
                    onClose={() => setShowCountryPicker(false)}
                  />
                </View>
              </TouchableOpacity>
              <TouchableWithoutFeedback>
                <View style={styles.phoneNumberContainer}>
                  <View style={styles.separator} />
                  <TextInput
                    style={styles.phoneInput}
                    placeholderTextColor={colors.textLight}
                    placeholder="Phone No"
                    value={phoneNumber}
                    onChangeText={(text) => {
                      handleTextChange(text);
                    }}
                    maxLength={11}
                    pointerEvents="box-only"
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>

            <Button
              title={isLoading ? 'Creating Account...' : 'Done'}
              onPress={handleSignup}
              disabled={isLoading}
              variant="primary"
              size="lg"
              style={styles.signupButton}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

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
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
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
    letterSpacing: -0.5,
    lineHeight: 54,
    marginBottom: spacing.xl,
  },
  uploadImageContainer: {
    width: 90,
    height: 90,
    marginBottom: spacing.xl,
    alignSelf: 'center',
  },
  uploadButton: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
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
  signupButton: {
    marginTop: spacing.xl,
  },
  countryPickMainView: {
    flexDirection: 'row',
    backgroundColor: colors.lightGray,
    borderRadius: spacing.borderRadius.xl,
    alignItems: 'center',
    height: 52,
    marginBottom: spacing.md,
  },
  countryPicker: {
    marginLeft: spacing.sm,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  separator: {
    width: 2,
    height: 18,
    marginHorizontal: spacing.sm,
    backgroundColor: colors.border,
  },
  phoneInput: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    paddingVertical: spacing.sm,
  },
});

export default SignupScreen;
