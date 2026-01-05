import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
// import { clearCart } from '../redux/cartSlice'; // Import if you have a cart slice

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const [isAuthModalVisible, setIsAuthModalVisible] = React.useState(false);

  const token = useSelector((state: any) => state.auth.token);

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
              dispatch(logoutUser());
              // dispatch(clearCart()); // Clear cart if you have one


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
    console.log(`Selected: ${text}`);
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
      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={userInfo?.profileImage ? { uri: userInfo.profileImage } : require('../assets/images/three.jpg')}
          style={styles.profileImage}
          defaultSource={require('../assets/images/three.jpg')}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <FontAwesomeIcon icon={faPencil} size={14} color="white" />
        </TouchableOpacity>
        <Text style={styles.profileName}>
          {userInfo?.name || 'Guest User'}
        </Text>

        {userInfo?.email && (
          <View style={styles.infoRow}>
            <FontAwesomeIcon icon={faEnvelope} size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{userInfo.email}</Text>
          </View>
        )}

        {userInfo?.phone && (
          <View style={styles.infoRow}>
            <FontAwesomeIcon icon={faPhone} size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{userInfo.phone}</Text>
          </View>
        )}
      </View>

      <View style={styles.menu}>
        <MenuItem icon={faUser} text="Your Profile" onPress={handleMenuItem} />
        <MenuItem icon={faCreditCard} text="Payment Methods" onPress={handleMenuItem} />
        <MenuItem icon={faShoppingBag} text="My Orders" onPress={handleMenuItem} />
        <MenuItem icon={faCog} text="Settings" onPress={handleMenuItem} />
        <MenuItem icon={faInfoCircle} text="Help Center" onPress={handleMenuItem} />
        <MenuItem icon={faLock} text="Privacy Policy" onPress={handleMenuItem} />
        <MenuItem icon={faUsers} text="Invite Friends" onPress={handleMenuItem} />
        <MenuItem icon={faHeart} text="Wishlist" onPress={handleMenuItem} />
        <MenuItem icon={faSignOutAlt} text="Log Out" onPress={handleMenuItem} />
      </View>
      <AuthModal
        isVisible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
      />
    </View>
  );
};

const MenuItem = ({ icon, text, onPress }: { icon: any, text: string, onPress: (text: string) => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={() => onPress(text)}>
    <FontAwesomeIcon icon={icon} size={20} color="black" style={styles.menuIcon} />
    <Text style={styles.menuText}>{text}</Text>
    <FontAwesomeIcon icon={faChevronRight} size={16} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileContainer: { alignItems: 'center', paddingTop: 100, position: 'relative' },
  profileImage: { width: 90, height: 90, borderRadius: 45 },
  editButton: { position: 'absolute', right: 140, bottom: 25, backgroundColor: '#000', padding: 6, borderRadius: 15 },
  profileName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  infoIcon: {
    width: 20,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  menu: { marginTop: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuIcon: { width: 30, marginRight: 10 },
  menuText: { flex: 1, fontSize: 16, color: '#333' },
  centered: { justifyContent: 'center', alignItems: 'center', padding: 30 },
  loginPromptTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 20 },
  loginPromptSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 10, marginBottom: 30 },
  loginPromptButton: { backgroundColor: '#4F46E5', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 12 },
  loginPromptButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default ProfileScreen;
