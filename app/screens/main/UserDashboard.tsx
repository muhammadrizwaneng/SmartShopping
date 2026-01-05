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
import { useNavigation } from '@react-navigation/native';

const UserDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const recentlyViewed = useSelector((state: any) => state.products.recentlyViewed || []);

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
        <Text style={styles.headerGreeting}>Hello, {userInfo?.name}</Text>
        <View style={styles.section}>
          <View style={{ padding: 10 }}>
            <Text style={styles.sectionTitle}>Announcement</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <Text style={styles.sectionText}>Lorem ipsum dolor sit amet, consectetur adipiscing {'\n'} elit. Maecenas hendrerit luctus libero ac vulputate.</Text>
              <View style={{ width: 30, height: 30 }}>
                <Image source={require('../../assets/images/arrow-back.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.recentlyViewText}>Recently viewed</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HomeMain')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentlyViewed.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Image
              source={require('../../assets/images/no-activity.png')}
              style={styles.emptyActivityImage}
              defaultSource={require('../../assets/images/Top_Menu.png')}
            />
            <Text style={styles.noActivityTitle}>No activity</Text>
            <Text style={styles.noActivitySubtitle}>You haven't viewed any products yet. Start exploring our collection!</Text>
            <TouchableOpacity
              style={styles.shopNowButton}
              onPress={() => navigation.navigate('HomeMain')}
            >
              <Text style={styles.shopNowButtonText}>Go to Shop</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentlyViewedList}>
            {recentlyViewed.map((product: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.recentProductCard}
                onPress={() => navigation.navigate('ProductDetails', { product: product._id })}
              >
                <Image source={{ uri: product.main_image_url }} style={styles.recentProductImage} />
                <Text numberOfLines={1} style={styles.recentProductName}>{product.name}</Text>
                <Text style={styles.recentProductPrice}>
                  ${Number(product.price || product.base_price || (product.variants && product.variants[0]?.price) || 0).toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Arrangements</Text>
          <Text style={styles.sectionText}>
            Please pour contact with us to create a webpage site.
          </Text>
          <TouchableOpacity style={styles.recommendedButton}>
            <Text style={styles.recommendedText}>[Recommended]</Text>
            <Text style={styles.linkText}>Last Issue on website</Text>
          </TouchableOpacity>
        </View>

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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stories</Text>
          <Text style={styles.placeholderText}>
            Stories content will appear here...
          </Text>
        </View> */}

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
    marginTop: 50,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconheader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Raleway-Medium',
    color: '#fff',
  },
  section: {
    backgroundColor: '#F8F8F8',
    height: 75,
    width: '100%',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Raleway-Bold',
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'nunito-sans.regular',
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
    width: '100%',
    height: '100%',
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
  greetingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#004CFF',
    borderRadius: 40,
  },
  IconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  barcodeImageContainer: {
    width: 35,
    height: 35,
  },
  barcodeImage: {
    width: '100%',
    height: '100%',
  },
  headerGreeting: {
    fontSize: 28,
    fontFamily: 'Raleway-Bold',
    marginBottom: 16,
  },
  recentlyViewText: {
    fontSize: 21,
    fontFamily: 'Raleway-Bold',
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#004CFF',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginTop: 10,
  },
  emptyActivityImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.6,
  },
  noActivityTitle: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    color: '#374151',
    marginBottom: 8,
  },
  noActivitySubtitle: {
    fontSize: 14,
    fontFamily: 'Raleway-Medium',
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  shopNowButton: {
    backgroundColor: '#004CFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shopNowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
  },
  recentlyViewedList: {
    marginTop: 10,
  },
  recentProductCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  recentProductImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentProductName: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  recentProductPrice: {
    fontSize: 14,
    fontFamily: 'Raleway-Medium',
    color: '#004CFF',
  },
});

export default UserDashboardScreen;
