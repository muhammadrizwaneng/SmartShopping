import React, {useState, useEffect} from 'react';
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
import { faMobileAlt, faTshirt, faHome, faBasketballBall } from '@fortawesome/free-solid-svg-icons';
import { faBarcode, faBell, faCameraAlt, faChartLine, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
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
    
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  // Get data from Redux store
  const { products, loading: productsLoading, error: productsError } = useSelector((state: any) => state.products);
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state: any) => state.categories);
  const user = useSelector((state: any) => state.auth.userInfo);

  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const loading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch, isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    setRefreshing(false);
  };

  const renderProductItem = ({item}: any) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetails', {product: item?._id})}
    />
  );

  const renderDealItem = ({item}: any) => (
    <DealCard
      deal={item}
      onPress={() => navigation.navigate('ProductDetails', {product: item?._id})}
      // onPress={() => navigation.navigate('CreateProduct')}
    />
  );

  const renderCategoryItem = ({item}: any) => (
    <CategoryCard
      category={item}
      onPress={() => navigation.navigate('CategoryPageScreen', {categoryId: item.category_id})}
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={false} 
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }>
      
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.username || 'User'}! <Text>👋</Text></Text>
            {/* <Text style={styles.subtitle}>What are you shopping for today?</Text> */}
          </View>

              {/* {user?.userInfo?.profilePicture ? ( 
          <Image
              source={{ uri: "https://turtt-uat.s3.us-west-2.amazonaws.com/686b6bfaac2c81510f25f6b5/1756367759697-image-1756367744332.jpg" }} // Use profile picture URL
              style={styles.avatar}
            />
          ) : ( */}
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>EN</Text> {/* Example: initials */}
            </View>
           {/* )} */}
          {/* <TouchableOpacity style={styles.notificationButton}>
            <FontAwesomeIcon icon={faBell} size={14} color={colors.white} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity> */}
        </View>
      </LinearGradient>
      <View style={{backgroundColor:"#818CF8"}}>
        <Animatable.View animation="fadeInUp" delay={200} style={styles.searchContainer}>
            {/* This single TouchableOpacity now acts as the merged search bar/action container */}
            <TouchableOpacity
                style={styles.mergedSearchBar}
                onPress={() => navigation.navigate('Search')}>

                {/* Placeholder Text */}
                <Text style={styles.searchPlaceholder}>Search products...</Text>

                {/* Action Icons */}
                <View style={styles.mergedSearchActions}>
                    <TouchableOpacity
                        style={styles.actionButtonInvisible} // Apply transparent style
                        onPress={() => navigation.navigate('BarcodeScanner')}>
                        <FontAwesomeIcon icon={faBarcode} size={20} color={colors.primary}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButtonInvisible} // Apply transparent style
                        onPress={() => navigation.navigate('CameraSearch')}>
                        <FontAwesomeIcon icon={faCameraAlt} size={20} color={colors.primary}/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animatable.View>
      </View>


      {/* Categories */}
      <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
        <Text style={[styles.sectionTitle,{padding:20}]}>Categories</Text>
        {loading ? (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text >Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}
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
          data={products}
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
          data={products?.slice(0, 5)} // Show first 5 products as recommendations
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </Animatable.View>

      {/* AI Insights */}
      <Animatable.View animation="fadeInUp" delay={1000} style={styles.section}>
        <Text style={[styles.sectionTitle,{padding:16}]}>💡 Smart Insights</Text>
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
    backgroundColor: colors.background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background
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
  header: {
    paddingTop: 50,
    paddingBottom: spacing.lg,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    // paddingTop: spacing.xl,
  },
  greeting: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
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
    paddingHorizontal: 20,
    marginTop: 10,
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
    // marginRight: spacing.sm,
    ...spacing.shadow.md
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
    paddingHorizontal: 20,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium as any,
  },
  horizontalList: {
    paddingLeft: 20,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: 20,
    marginBottom: spacing.sm,
    ...spacing.shadow.sm,
  },
  insightContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  insightTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  insightText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
    mergedSearchActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    mergedSearchBar: {
    flex: 1, // Takes up the full width
    flexDirection: 'row',
    justifyContent: 'space-between', // Pushes placeholder left, icons right
    alignItems: 'center',
    backgroundColor: colors.white, // The white background for the whole bar
    borderRadius: spacing.borderRadius.lg, // Large rounding
    paddingHorizontal: spacing.md, // Horizontal padding for inside the bar
    paddingVertical: spacing.md, 
    ...spacing.shadow.md // Shadow for the entire bar
  },
    actionButtonInvisible: {
    // Removed all styling that creates a separate button look (white background, shadow, padding)
    paddingHorizontal: spacing.sm, // Add a small amount of space between icons
    paddingVertical: 0,
    marginLeft: spacing.sm, // Add space between placeholder and first icon, and between icons
  },

   avatar: {
    width: 48, // Diameter of the circle
    height: 48, // Diameter of the circle
    borderRadius: 24, // Half of width/height for a perfect circle
    backgroundColor: colors.lightGray, // Fallback background if image fails
    borderWidth: 2, // Optional: white border
    borderColor: colors.white, // Optional: white border
    marginLeft: spacing.md, // Spacing from the text
  },
  // Optional: Placeholder for when there's no profile picture
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent, // Different background for placeholder
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  avatarPlaceholderText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold' as any,
  },

});

export default HomeScreen;