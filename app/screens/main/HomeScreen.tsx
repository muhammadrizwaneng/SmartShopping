import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  ActivityIndicator
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// Unused icons removed
import { faBarcode, faBell, faCameraAlt, faChartLine, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';

// Components
import CategoryCard from '../../components/CategoryCard';
import DealCard from '../../components/DealCard';
import ProductCard from '../../components/ProductCard';

// Redux Actions
import { fetchProducts } from '../../redux/productSlice';
import { fetchCategories } from '../../redux/categorySlice';

// Theme
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/color';

const HomeScreen = () => {

  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  // Get data from Redux store
  const { products, loading: productsLoading, error: productsError } = useSelector((state: any) => state.products);
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state: any) => state.categories);
  const user = useSelector((state: any) => state.auth.userInfo);

  const [refreshing, setRefreshing] = useState(false);

  const loading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Force refresh by ignoring cache could be implemented, but for now we follow slice logic
    await Promise.all([
      dispatch(fetchProducts()),
      dispatch(fetchCategories())
    ]);
    setRefreshing(false);
  };

  const renderProductItem = ({ item }: any) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetails', { product: item?._id })}
    />
  );

  const renderDealItem = ({ item }: any) => (
    <DealCard
      deal={item}
      onPress={() => navigation.navigate('ProductDetails', { product: item?._id })}
    // onPress={() => navigation.navigate('CreateProduct')}
    />
  );

  const renderCategoryItem = ({ item }: any) => (
    <CategoryCard
      category={item}
      onPress={() => navigation.navigate('CategoryPageScreen', { categoryId: item.category_id })}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (loading && refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.refreshIndicator}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading data. Please try again.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >

        {/* Header Section */}
        <LinearGradient
          colors={[colors.primary, colors.gradientEnd]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.username || 'Shopper'} 👋</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesomeIcon icon={faBell} size={20} color={colors.white} />
                <View style={styles.badge} />
              </TouchableOpacity>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {(user?.username || 'U').substring(0, 1).toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Glass Search Bar */}
          <Animatable.View animation="fadeIn" duration={800} style={styles.searchWrapper}>
            <TouchableOpacity
              style={styles.glassSearchBar}
              onPress={() => navigation.navigate('Search')}
              activeOpacity={0.9}
            >
              <View style={styles.searchInner}>
                <FontAwesomeIcon icon={faSearch} size={18} color={colors.white} />
                <Text style={styles.searchPlaceholderText}>What are you looking for?</Text>
              </View>
              <View style={styles.searchIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('BarcodeScanner')}>
                  <FontAwesomeIcon icon={faBarcode} size={18} color={colors.white} />
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity onPress={() => navigation.navigate('CameraSearch')}>
                  <FontAwesomeIcon icon={faCameraAlt} size={18} color={colors.white} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Categories Section */}
          <Animatable.View animation="fadeInUp" delay={200} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Shop by Category</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.category_id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </Animatable.View>

          {/* Hot Deals */}
          <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.titleWithIcon}>
                <Text style={styles.emoji}>🔥</Text>
                <Text style={styles.sectionTitle}>Flash Sale</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={products}
              renderItem={renderDealItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </Animatable.View>

          {/* Smart Insights Glass Card */}
          <Animatable.View animation="fadeInUp" delay={600} style={styles.insightSection}>
            <LinearGradient
              colors={['rgba(79, 70, 229, 0.1)', 'rgba(124, 58, 237, 0.05)']}
              style={styles.insightCard}
            >
              <View style={styles.insightHeader}>
                <FontAwesomeIcon icon={faChartLine} size={20} color={colors.primary} />
                <Text style={styles.insightMainTitle}>Smart Shopping Insights</Text>
              </View>
              <Text style={styles.insightDescription}>
                Based on your behavior, electronics are 15% cheaper this week.
              </Text>
            </LinearGradient>
          </Animatable.View>

          {/* Recommendations */}
          <Animatable.View animation="fadeInUp" delay={800} style={[styles.section, { marginBottom: 40 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended For You</Text>
            </View>
            <FlatList
              data={products?.slice(0, 6)}
              renderItem={renderProductItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </Animatable.View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIndicator: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: spacing.borderRadius.md,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as any,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: typography.fontWeight.medium as any,
  },
  userName: {
    fontSize: 22,
    color: colors.white,
    fontWeight: typography.fontWeight.bold as any,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  searchWrapper: {
    paddingHorizontal: 20,
  },
  glassSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchPlaceholderText: {
    color: colors.white,
    marginLeft: 10,
    fontSize: 15,
    opacity: 0.9,
  },
  searchIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 10,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold as any,
  },
  horizontalList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  insightSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  insightCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.1)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightMainTitle: {
    fontSize: 16,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  insightDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default HomeScreen;