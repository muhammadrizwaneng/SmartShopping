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
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/color';
import { faEnvelope, faEye, faEyeSlash, faLock, faPerson } from '@fortawesome/free-solid-svg-icons';
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
      "name": name,
      "email": email,
      "password": password,
      "confirmPassword": confirmPassword,
      "phoneNumber": phoneNumber,
      "profileImage": profileImage,
      "country": country,
      "role": "user",
    }
    console.log('payload:', payload);

    try {
      setIsLoading(true);
      const response = await CallServiceFor(ApiConfig.SIGNUP, 'post', payload);

      console.log(response);
      if (response.status == 200 || response.status == 201) {
        Alert.alert("Success", "Signup Successful!");
        const userResponse = response.data
        // The API returns access_token on signup too as per doc
        if (userResponse.access_token) {
          await AsyncStorage.setItem('token', userResponse.access_token);
          await AsyncStorage.setItem('userData', JSON.stringify({
            user: userResponse,
            token: userResponse.access_token,
            isLoggedIn: true
          }));
        }
        navigation.navigate('signupStep2', { user: userResponse });
      } else {
        Alert.alert("Error", response.data?.message || "Signup failed");
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.response?.data?.message || "Signup failed");
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
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/images/mask_group_4.png')} style={styles.image} />
      </View>
      <View style={styles.rightImageContainer}>
        <Image source={require('../../assets/images/mask_group_5.png')} style={styles.rightImage} />
      </View>
      <Text style={styles.title}>Create {'\n'}Account</Text>

      <View style={styles.uploadImageContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image source={profileImage ? { uri: profileImage } : require('../../assets/images/Upload_Photo.png')} style={styles.uploadImage} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
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
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size={20} color={colors.gray} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faLock} size={20} color={colors.gray} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={colors.gray}
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
                  placeholderTextColor="#999999"
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

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={isLoading}>
            <Text style={styles.signupButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LandingScreen')}>
            <Text style={styles.loginLink}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    width: 227,
    height: 227,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  rightImageContainer: {
    width: 93,
    height: 209,
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: 100,
  },
  rightImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    color: '#000',
    fontSize: 50,
    fontFamily: 'Raleway-Bold',
    marginTop: 130,
    marginLeft: 50,
    marginBottom: 63,
  },
  uploadImageContainer: {
    width: 90,
    height: 90,
    marginLeft: 50,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 30,
  },
  uploadImage: {
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    // paddingBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    ...spacing.shadow.md,
  },
  input: {
    flex: 1,
    height: 52,
  },
  eyeIcon: {
    padding: spacing.sm,
  },
  signupButton: {
    backgroundColor: '#004CFF',
    borderRadius: 30,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    ...spacing.shadow.md,
  },
  signupButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
  },
  countryPickMainView: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderColor: '#F8F8F8',
    borderRadius: 20,
    alignItems: 'center',
    height: 52,
  },
  countryPicker: {
    marginLeft: 10,
    marginTop: 5,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    marginLeft: -8,
    marginTop: 5,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: 2,
    height: 18,
    marginHorizontal: 8,
    backgroundColor: '#000',
  },
  phoneInput: {
    width: '87%',
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    paddingVertical: 10,
    paddingTop: Platform.OS === 'android' ? 16 : 10,
    textAlignVertical: 'center',
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
    color: colors.black,
    fontSize: typography.fontSize.base,
    alignSelf: 'center',
  },
});

export default SignupScreen;
