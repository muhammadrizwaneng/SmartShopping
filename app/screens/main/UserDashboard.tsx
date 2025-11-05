import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';

const UserDashboardScreen = () => {
    const userInfo = useSelector((state: any) => state.auth.userInfo);
    
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        
        <View style={styles.IconContainer}>
            <View style={styles.header}>
                <View style={styles.shadowWrapper}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={userInfo?.profileImage ? { uri: userInfo.profileImage } : require('../../assets/images/three.jpg')}
                            style={styles.profileImage}
                            defaultSource={require('../../assets/images/three.jpg')}
                        />
                    </View>
                </View>
                <View style={styles.greetingContainer}>
                    <Text style={styles.greeting}>My Activity</Text>
                </View>
            </View>
            <View style={styles.iconheader}>
                <View style={styles.barcodeImageContainer}>
                    <Image source={require('../../assets/images/barcode.png')} style={styles.barcodeImage} />
                </View>
                <View style={styles.barcodeImageContainer}>
                    <Image source={require('../../assets/images/Top_Menu.png')} style={styles.barcodeImage} />
                </View>
                <View style={styles.barcodeImageContainer}>
                    <Image source={require('../../assets/images/Settings.png')} style={styles.barcodeImage} />
                </View>
            </View>
        </View>
        {/* Header Greeting */}

        {/* Arrangements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Arrangements</Text>
          <Text style={styles.sectionText}>
            Please pour contact with us to create a webpage site.
          </Text>
          <TouchableOpacity style={styles.recommendedButton}>
            <Text style={styles.recommendedText}>[Recommended]</Text>
            <Text style={styles.linkText}>Last Issue on website</Text>
          </TouchableOpacity>
        </View>

        {/* Recently Viewed Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently viewed</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>My Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>To Pay</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>To Recieve</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>To Review</Text>
          </TouchableOpacity>
        </View>

        {/* Stories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stories</Text>
          {/* Add your stories content here */}
          <Text style={styles.placeholderText}>
            Stories content will appear here...
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    marginTop:50,
    padding:20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
    iconheader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
  greeting: {
    fontSize: 16,
    fontFamily:'Raleway-Medium',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  recommendedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  recommendedText: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '600',
    marginRight: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 45, // optional but keeps smooth edges
    },
    profileImageContainer: {
        width: 40,
        height: 40,
         borderRadius: 45,
        overflow: 'hidden',
    },
    shadowWrapper: {
        width: 50,
        height: 50,
        borderRadius: 46,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
    },
    greetingContainer:{
        paddingHorizontal:16,
        paddingVertical:8,
        backgroundColor:'#004CFF',
        borderRadius:40
    },
    IconContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    barcodeImageContainer:{
        width:35,
        height:35
    },
    barcodeImage:{
        width:'100%',
        height:'100%'
    }
});

export default UserDashboardScreen;