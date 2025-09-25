import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

import { faMobileAlt, faTshirt, faHome, faBasketballBall } from '@fortawesome/free-solid-svg-icons';
// import {productAPI} from '../../services/api';
import { colors } from '../../theme/color';
import { faBarcode, faBell, faCameraAlt, faChartLine, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import AppState from '../../models/reducers';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import CategoryCard from '../../components/CategoryCard';
import DealCard from '../../components/DealCard';
import ProductCard from '../../components/ProductCard';

const HomeScreen = () => {
    
   const user = useSelector((state: AppState) => state.user);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigation = useNavigation();

const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    rating: 4.5,
    reviewCount: 128,
    category: 'electronics',
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    rating: 4.3,
    reviewCount: 89,
    category: 'electronics',
  },
  {
    id: '3',
    name: 'Organic Coffee Beans',
    price: 24.99,
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    rating: 4.7,
    reviewCount: 256,
    category: 'food',
  },
];

const mockDeals = [
  {
    id: '1',
    name: 'Gaming Laptop',
    price: 899.99,
    originalPrice: 1299.99,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    discount: 31,
    timeLeft: '2h 15m',
  },
  {
    id: '2',
    name: 'Smartphone',
    price: 599.99,
    originalPrice: 799.99,
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    discount: 25,
    timeLeft: '5h 30m',
  },
];

const mockCategories = [
  {
    id: '1',
    name: 'Electronics',
    icon: faMobileAlt, // 📱 Phone
    color: [colors.primary, colors.primaryLight],
    productCount: 1250,
  },
  {
    id: '2',
    name: 'Fashion',
    icon: faTshirt, // 👕 Shirt
    color: [colors.secondary, colors.secondaryLight],
    productCount: 890,
  },
  {
    id: '3',
    name: 'Home',
    icon: faHome, // 🏠 Home
    color: [colors.accent, colors.accentLight],
    productCount: 567,
  },
  {
    id: '4',
    name: 'Sports',
    icon: faBasketballBall, // 🏀 Sports/Fitness
    color: [colors.info, '#60A5FA'],
    productCount: 423,
  },
];

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
         setRecommendedProducts(mockProducts);
      setDeals(mockDeals);
      setCategories(mockCategories);

    //   const [productsData, dealsData, categoriesData] = await Promise.all([
    //     productAPI.getRecommended(),
    //     productAPI.getDeals(),
    //     productAPI.getCategories(),
    //   ]);
      
    //   setRecommendedProducts(productsData);
    //   setDeals(dealsData);
    //   setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load home data:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadHomeData();
    setIsRefreshing(false);
  };

  const renderProductItem = ({item}: any) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetails', {product: item})}
    />
  );

  const renderDealItem = ({item}: any) => (
    <DealCard
      deal={item}
      onPress={() => navigation.navigate('ProductDetails', {product: item})}
    />
  );

  const renderCategoryItem = ({item}: any) => (
    <CategoryCard
      category={item}
      onPress={() => navigation.navigate('Search', {category: item.id})}
    />
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }>
      
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name}! 👋</Text>
            <Text style={styles.subtitle}>What are you shopping for today?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <FontAwesomeIcon icon={faBell} size={14} color={colors.white} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <Animatable.View animation="fadeInUp" delay={200} style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}>
            <FontAwesomeIcon icon={faSearch} size={20} color={colors.gray}/>
          <Text style={styles.searchPlaceholder}>Search products...</Text>
        </TouchableOpacity>
        
        <View style={styles.searchActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('BarcodeScanner')}>
            <FontAwesomeIcon icon={faBarcode} size={20} color={colors.primary}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('CameraSearch')}>
            <FontAwesomeIcon icon={faCameraAlt} size={20} color={colors.primary}/>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      {/* Categories */}
      <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </Animatable.View>

      {/* Deals & Discounts */}
      <Animatable.View animation="fadeInUp" delay={600} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Hot Deals</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={deals}
          renderItem={renderDealItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </Animatable.View>

      {/* AI Recommendations */}
      <Animatable.View animation="fadeInUp" delay={800} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🤖 AI Recommendations</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recommendedProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </Animatable.View>

      {/* AI Insights */}
      <Animatable.View animation="fadeInUp" delay={1000} style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Smart Insights</Text>
        <View style={styles.insightCard}>
            <FontAwesomeIcon icon={faChartLine} size={20} color={colors.success}/>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Price Drop Alert</Text>
            <Text style={styles.insightText}>
              3 items in your wishlist have dropped in price by an average of 15%
            </Text>
          </View>
        </View>
        
        <View style={styles.insightCard}>
            <FontAwesomeIcon icon={faTimes} size={20} color={colors.warning}/>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Best Time to Buy</Text>
            <Text style={styles.insightText}>
              Electronics typically have better deals on weekends
            </Text>
          </View>
        </View>
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    marginTop: -spacing.lg,
    marginBottom: spacing.lg,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    ...spacing.shadow.md,
  },
  searchPlaceholder: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.gray,
  },
  searchActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginLeft: spacing.sm,
    ...spacing.shadow.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  horizontalList: {
    paddingLeft: spacing.screenPadding,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
    ...spacing.shadow.sm,
  },
  insightContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  insightTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  insightText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

export default HomeScreen;