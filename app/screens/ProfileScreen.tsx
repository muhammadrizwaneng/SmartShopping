import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { clearCart } from '../redux/cartSlice';
import { colors } from '../theme/color';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faCreditCard,
  faShoppingBag,
  faCog,
  faInfoCircle,
  faLock,
  faUsers,
  faSignOutAlt,
  faChevronRight,
  faPencil,
  faEnvelope,
  faPhone,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser, setUserInfo } from '../redux/userSlice';
import AuthModal from '../components/AuthModal';
import LinearGradient from 'react-native-linear-gradient';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const [isAuthModalVisible, setIsAuthModalVisible] = React.useState(false);

  useEffect(() => {
    // Load user data if needed
    const loadUserData = async () => {
      try {
        const cachedUserData = await AsyncStorage.getItem('userData');
        if (cachedUserData) {
          // If you want to update the Redux store with cached data
          // dispatch(setUserInfo(JSON.parse(cachedUserData)));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Clear token and user data
              await AsyncStorage.multiRemove(['token', 'userData']);
              dispatch({ type: 'auth/logout/fulfilled' });
              // Reset Redux state
              dispatch(clearCart());
              dispatch(logoutUser());
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleMenuItem = (text: string) => {
    switch (text) {
      case 'My Orders':
        navigation.navigate('ProductOrderScreen');
        break;
      case 'Your Profile':
        navigation.navigate('ProfileDetailScreen');
        break;
      case 'Settings':
        navigation.navigate('SettingsScreen');
        break;
      case 'Log Out':
        handleLogout();
        break;
      case 'Wishlist':
        navigation.navigate('Wishlist');
        break;
      default:
        console.log('Menu item not handled:', text);
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, styles.centered]}>
        <FontAwesomeIcon icon={faUser} size={80} color={colors.lightGray} />
        <Text style={styles.loginPromptTitle}>Join SmartShopping</Text>
        <Text style={styles.loginPromptSubtitle}>Login to manage your orders, payments, and profile settings.</Text>
        <TouchableOpacity
          style={styles.loginPromptButton}
          onPress={() => setIsAuthModalVisible(true)}
        >
          <Text style={styles.loginPromptButtonText}>Sign In / Join</Text>
        </TouchableOpacity>
        <AuthModal
          isVisible={isAuthModalVisible}
          onClose={() => setIsAuthModalVisible(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.gradientEnd]}
        style={styles.headerBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.profileContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={userInfo?.profileImage ? { uri: userInfo.profileImage } : require('../assets/images/three.jpg')}
              style={styles.profileImage}
              defaultSource={require('../assets/images/three.jpg')}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <FontAwesomeIcon icon={faPencil} size={12} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>
            {userInfo?.name || 'Guest User'}
          </Text>

          {userInfo?.email && (
            <View style={[styles.infoRow, { opacity: 0.9 }]}>
              <FontAwesomeIcon icon={faEnvelope} size={14} color={colors.white} style={styles.infoIcon} />
              <Text style={styles.infoText}>{userInfo.email}</Text>
            </View>
          )}

          {userInfo?.phone && (
            <View style={[styles.infoRow, { opacity: 0.9 }]}>
              <FontAwesomeIcon icon={faPhone} size={14} color={colors.white} style={styles.infoIcon} />
              <Text style={styles.infoText}>{userInfo.phone}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>Account</Text> */}
          <View style={styles.card}>
            <MenuItem icon={faUser} text="Your Profile" onPress={handleMenuItem} color={colors.primary} />
            <View style={styles.divider} />
            <MenuItem icon={faCreditCard} text="Payment Methods" onPress={handleMenuItem} color={colors.secondary} />
            <View style={styles.divider} />
            <MenuItem icon={faShoppingBag} text="My Orders" onPress={handleMenuItem} color={colors.accentDark} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.card}>
            <MenuItem icon={faHeart} text="Wishlist" onPress={handleMenuItem} color={colors.discount} />
            <View style={styles.divider} />
            <MenuItem icon={faUsers} text="Invite Friends" onPress={handleMenuItem} color={colors.secondaryDark} />
            <View style={styles.divider} />
            <MenuItem icon={faCog} text="Settings" onPress={handleMenuItem} color={colors.gray} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <MenuItem icon={faInfoCircle} text="Help Center" onPress={handleMenuItem} color={colors.info} />
            <View style={styles.divider} />
            <MenuItem icon={faLock} text="Privacy Policy" onPress={handleMenuItem} color={colors.success} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} size={18} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <AuthModal
        isVisible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
      />
    </View>
  );
};

const MenuItem = ({ icon, text, onPress, color }: { icon: any, text: string, onPress: (text: string) => void, color: string }) => (
  <TouchableOpacity style={styles.menuItem} onPress={() => onPress(text)}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
      <FontAwesomeIcon icon={icon} size={18} color={color} />
    </View>
    <Text style={styles.menuText}>{text}</Text>
    <FontAwesomeIcon icon={faChevronRight} size={14} color={colors.gray} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerBackground: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...spacing.shadow.md,
  },
  profileContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
    ...spacing.shadow.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.white,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 20,
    ...spacing.shadow.sm,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
    fontFamily: typography.fontFamily.bold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.white,
    fontFamily: typography.fontFamily.medium,
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginLeft: 10,
    marginBottom: 10,
    fontFamily: typography.fontFamily.bold,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 10,
    ...spacing.shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginLeft: 65,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#xFCA5A5',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
    marginLeft: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.white,
  },
  loginPromptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 20,
  },
  loginPromptSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  loginPromptButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
  },
  loginPromptButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
