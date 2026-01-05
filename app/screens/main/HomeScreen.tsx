import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// Components
import ProductCard from '../../components/ProductCard';

// Redux Actions
import { fetchProducts } from '../../redux/productSlice';

// Theme
import { colors, typography, spacing } from '../../theme';

const HomeScreen = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();

  // Get data from Redux store
  const { products, loading: productsLoading, error: productsError } = useSelector((state: any) => state.products);

  const loading = productsLoading;
  const error = productsError;

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
  };

  const renderProductItem = ({ item }: any) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetails', { product: item?._id })}
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
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
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
        {/* Big Sale Banner */}
        <Animatable.View animation="fadeIn" duration={800} style={styles.bannerSection}>
          <LinearGradient
            colors={[colors.primary, colors.gradientEnd]}
            style={styles.bigSaleBanner}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Big Sale</Text>
              <Text style={styles.bannerSubtitle}>Up to 50% off</Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Top Products */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Products</Text>
          </View>
          <FlatList
            data={products?.slice(0, 4)}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </Animatable.View>

        {/* New Items */}
        <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Items</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products?.slice(4, 8)}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </Animatable.View>

        {/* Most Popular */}
        <Animatable.View animation="fadeInUp" delay={600} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithIcon}>
              <FontAwesomeIcon icon={faHeart} size={16} color={colors.error} />
              <Text style={styles.sectionTitle}>Most Popular</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products?.slice(8, 12)}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </Animatable.View>

        {/* Just for You */}
        <Animatable.View animation="fadeInUp" delay={800} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Just for You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products?.slice(12, 18)}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </Animatable.View>
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
    paddingBottom: 10,
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
  bannerSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  bigSaleBanner: {
    height: 150,
    borderRadius: spacing.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...spacing.shadow.md,
  },
  bannerContent: {
    alignItems: 'center',
  },
  bannerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['14xl'],
    fontWeight: 'bold' as const,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    fontFamily: typography.fontFamily.light,
    fontSize: typography.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.lg,
  },
  bannerButton: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.xl,
  },
  bannerButtonText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  section: {
    marginTop: spacing.xl,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  seeAll: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500' as const,
  },
  horizontalList: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
  },
});

export default HomeScreen;
