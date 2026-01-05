import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ApiConfig from '../../config/api-config';
import { CallServiceFor } from '../../services/call_services_for';
import { colors, typography, spacing } from '../../theme';
import ProductCard from '../../components/ProductCard';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  discount_price: number | null;
  discount_percent: number | null;
  main_image_url: string;
  has_variants?: boolean;
  variants?: Array<{
    name: string;
    price: number;
    discount_price?: number;
    discount_percent?: number;
  }>;
  category_name: string | null;
  rating?: number;
  reviewCount?: number;
}

export default function CategoryPageScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { categoryId } = route.params;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    let mount = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Using string directly for dynamic path segment if not in ApiConfig,
        // but it's better to use CallServiceFor for Base URL consistency.
        const res = await CallServiceFor(`products/get-products-by-category/${categoryId}`, 'get', {});

        if (!mount) {return;}

        setProducts(res.data);

        if (res.data.length && res.data[0].category_name) {
          setCategoryName(res.data[0].category_name);
        } else {
          const nameFromUrl = categoryId
            .split('-')
            .map((w: string) => w[0]?.toUpperCase() + w.slice(1))
            .join(' ');
          setCategoryName(nameFromUrl);
        }
      } catch (err) {
        console.error('Fetch products by category error:', err);
      } finally {
        if (mount) {setLoading(false);}
      }
    };

    fetchData();

    return () => {
      mount = false;
    };
  }, [categoryId]);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={{
        _id: item._id,
        name: item.name,
        price: item.price || 0,
        originalPrice: item.discount_price ? undefined : (item.price || 0),
        main_image_url: item.main_image_url,
        rating: item.rating || 0,
        reviewCount: item.reviewCount || 0,
        discount_percent: item.discount_percent || undefined,
        has_variants: item.has_variants,
        variants: item.variants,
      }}
      onPress={() => navigation.navigate('ProductDetails', { product: item._id })}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={16} color={colors.primary} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <Text style={styles.headerSubtitle}>{products.length} products found</Text>
        </View>
      </View>

      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    ...spacing.shadow.sm,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  columnWrapper: {
    justifyContent: 'space-between' as const,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center' as const,
  },
  backButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.lightGray,
    gap: spacing.sm,
  },
  backButtonText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: '500' as const,
  },
});
