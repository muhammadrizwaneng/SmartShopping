import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
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
  faPencil 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation(); 

  const handleMenuItem = (text) => {
    console.log(`Selected: ${text}`);
    if (text === 'My Orders') {
      navigation.navigate("ProductOrderScreen");
    } else if (text === 'Your Profile') {
      navigation.navigate("ProfileDetailScreen");
    } else if (text === 'Settings') {
      navigation.navigate("SettingsScreen");
    }
    // Add more cases as needed
  };

  return (
    <View style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/images/three.jpg')}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editButton}>
          <FontAwesomeIcon icon={faPencil} size={14} color="white" />
        </TouchableOpacity>
        <Text style={styles.profileName}>Angie Brekke</Text>
      </View>

      <View style={styles.menu}>
        <MenuItem icon={faUser} text="Your Profile" onPress={handleMenuItem} />
        <MenuItem icon={faCreditCard} text="Payment Methods" onPress={handleMenuItem} />
        <MenuItem icon={faShoppingBag} text="My Orders" onPress={handleMenuItem} />
        <MenuItem icon={faCog} text="Settings" onPress={handleMenuItem} />
        <MenuItem icon={faInfoCircle} text="Help Center" onPress={handleMenuItem} />
        <MenuItem icon={faLock} text="Privacy Policy" onPress={handleMenuItem} />
        <MenuItem icon={faUsers} text="Invite Friends" onPress={handleMenuItem} />
        <MenuItem icon={faSignOutAlt} text="Log Out" onPress={handleMenuItem} />
      </View>
    </View>
  );
};

const MenuItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={() => onPress(text)}>
    <FontAwesomeIcon icon={icon} size={20} color="black" style={styles.menuIcon} />
    <Text style={styles.menuText}>{text}</Text>
    <FontAwesomeIcon icon={faChevronRight} size={16} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileContainer: { alignItems: 'center', marginVertical: 30, position: 'relative' },
  profileImage: { width: 90, height: 90, borderRadius: 45 },
  editButton: { position: 'absolute', right: 140, bottom: 25, backgroundColor: '#000', padding: 6, borderRadius: 15 },
  profileName: { marginTop: 10, fontSize: 20, fontWeight: 'bold', color: '#333' },
  menu: { marginTop: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuIcon: { width: 30, marginRight: 10 },
  menuText: { flex: 1, fontSize: 16, color: '#333' },
});

export default ProfileScreen;
