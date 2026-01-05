import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faTruck, faHeart, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ApiConfig from '../../config/api-config';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { addToCart, CartItem } from '../../redux/cartSlice';
import { addToRecentlyViewed } from '../../redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import AuthModal from '../../components/AuthModal';
import { colors, typography, spacing } from '../../theme';
import { Button } from '../../components';

interface ProductImage {
  id: string;
  image_url: string;
  is_main: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  discount_percent?: number;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  main_image_url: string;
  images: ProductImage[];
  has_variants: boolean;
  variants: ProductVariant[];
  discount_percent?: number;
}

interface ProductDetailScreenProps {
  route: {
    params: {
      product: string;
    };
  };
}

const ProductDetailScreen = (props: any) => {

  const [productData, setProductData] = useState<any>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeMainImage, setActiveMainImage] = useState<string | null>(null);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const fetchProductDetails = async (product_id: string) => {
    const PRODUCT_ID = product_id;
    const URL = `${ApiConfig.BASE_URL}${ApiConfig.FETCH_PRODUCTS}/${PRODUCT_ID}`;

    try {
      const response = await axios.get(URL);
      if (response.status === 200) {
        setProductData(response.data);
        setActiveMainImage(response.data?.main_image_url);
        dispatch(addToRecentlyViewed(response.data));
        return;
      }
    } catch (error: any) {
      console.error(
        'Failed to fetch product details:',
        error.response?.data || error.message,
      );
      return null;
    }
  };

  useEffect(() => {
    if (props?.route?.params?.product != '' && props?.route?.params?.product != null) {

      fetchProductDetails(props?.route?.params?.product);
    }
  }, [isFocused]);


  if (!productData) {
    return <Text style={{ padding: 20 }}>Loading product details...</Text>;
  }

  const getDisplayPrice = () => {
    let price;
    if (productData?.has_variants && productData.variants?.length) {
      price = productData.variants[selectedVariantIndex]?.price;
    } else {
      price = productData.price;
    }
    return price;
  };

  const getDisplayStock = (): number => {
    if (productData.has_variants && productData.variants?.length > 0) {
      return productData.variants[selectedVariantIndex]?.stock || 0;
    }
    return productData.stock || 0;
  };

  const displayPrice = getDisplayPrice();
  const displayStock = getDisplayStock();
  const isInStock = displayStock > 0;

  const handleVariantSelect = (index: number) => {
    setSelectedVariantIndex(index);
  };

  const handleGalleryImageSelect = (url: string) => {
    setActiveMainImage(url);
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setPendingAction('cart');
      setIsAuthModalVisible(true);
      return;
    }

    if (!productData) {return;}

    // For products with variants, use the selected variant's details
    if (productData.has_variants && productData.variants?.length > 0) {
      const selectedVariant = productData.variants[selectedVariantIndex];
      if (!selectedVariant) {return;}

      const cartItem: Omit<CartItem, 'quantity'> = {
        id: selectedVariant.id,
        productId: productData.id,
        name: `${productData.name} - ${selectedVariant.name || 'Variant'}`,
        price: selectedVariant.price,
        image: selectedVariant.image_url || productData.main_image_url,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
      };

      dispatch(addToCart(cartItem));
      Alert.alert('Success', `${productData.name} (${selectedVariant.name || 'Variant'}) added to cart!`);
    } else {
      // For simple products without variants
      const cartItem: Omit<CartItem, 'quantity'> = {
        id: productData._id,
        productId: productData._id,
        name: productData.name,
        price: productData.price,
        image: productData.main_image_url,
      };

      dispatch(addToCart(cartItem));
      Alert.alert('Success', `${productData.name} added to cart!`);
    }
  };

  const handleAddToWishlist = () => {
    if (!isLoggedIn) {
      setPendingAction('wishlist');
      setIsAuthModalVisible(true);
      return;
    }
    Alert.alert('Wishlist', 'Product added to wishlist!');
  };

  const handleAuthSuccess = () => {
    if (pendingAction === 'cart') {
      handleAddToCart();
    } else if (pendingAction === 'wishlist') {
      handleAddToWishlist();
    }
    setPendingAction(null);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Product Image Gallery */}
      <View style={styles.imageSection}>
        <Image
          source={{ uri: activeMainImage || '' }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.galleryContainer}
        >
          {[productData?.main_image_url, ...(productData?.gallery_images || [])]
            .filter(url => url)
            .map((url, index) => {
              const isSelected = url === activeMainImage;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleGalleryImageSelect(url)}
                  style={[
                    styles.thumbnailWrapper,
                    isSelected && styles.thumbnailWrapperSelected,
                  ]}
                >
                  <Image
                    source={{ uri: url }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{productData?.name}</Text>
        
        {/* Price and Actions */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${displayPrice ? displayPrice.toFixed(2) : 'Price Varies'}</Text>
            <TouchableOpacity style={styles.wishlistButton} onPress={handleAddToWishlist}>
              <FontAwesomeIcon icon={faHeart} size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.ratingRow}>
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                size={16}
                color={i < Math.floor(productData?.rating || 0) ? colors.rating : colors.textLight}
                style={{ marginRight: 2 }}
              />
            ))}
            <Text style={styles.reviewsText}>({productData?.reviews_count || 0} reviews)</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {productData?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam arcu mauris, scelerisque eu mauris id, pretium pulvinar sapien.'}
          </Text>
        </View>

        {/* Variants */}
        {productData?.has_variants && productData?.variants?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Variations</Text>
            <View style={styles.variantsContainer}>
              {productData?.variants.map((v: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleVariantSelect(index)}
                  style={[
                    styles.variantChip,
                    index === selectedVariantIndex && styles.variantChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.variantText,
                      index === selectedVariantIndex && styles.variantTextSelected,
                    ]}
                  >
                    {v.name}
                  </Text>
                  <Text
                    style={[
                      styles.variantStock,
                      index === selectedVariantIndex && styles.variantStockSelected,
                    ]}
                  >
                    ({v.stock} left)
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Stock Status */}
        <View style={styles.stockSection}>
          <View style={[
            styles.stockChip,
            isInStock ? styles.inStock : styles.outOfStock
          ]}>
            <Text style={[
              styles.stockText,
              isInStock ? styles.inStockText : styles.outOfStockText
            ]}>
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>

        {/* Delivery Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Options</Text>
          <View style={styles.deliveryContainer}>
            <View style={styles.deliveryOption}>
              <FontAwesomeIcon icon={faTruck} size={16} color={colors.primary} />
              <Text style={styles.deliveryText}>Free Delivery</Text>
            </View>
            <View style={styles.deliveryOption}>
              <FontAwesomeIcon icon={faTruck} size={16} color={colors.primary} />
              <Text style={styles.deliveryText}>Express Delivery</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          disabled={!isInStock}
          variant="primary"
          size="lg"
          style={styles.addToCartButton}
        />
      </View>

      <AuthModal
        isVisible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onSuccess={handleAuthSuccess}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageSection: {
    height: 300,
    backgroundColor: colors.background,
  },
  mainImage: {
    width: '100%',
    height: 250,
    backgroundColor: colors.lightGray,
  },
  galleryContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.lightGray,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  thumbnailWrapperSelected: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.borderRadius['4xl'],
    borderTopRightRadius: spacing.borderRadius['4xl'],
    marginTop: -spacing.lg,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  productName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  priceSection: {
    marginBottom: spacing.xl,
  },
  priceRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.sm,
  },
  price: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['12xl'],
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
    letterSpacing: -0.26,
  },
  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  ratingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  reviewsText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  variantsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
  },
  variantChip: {
    backgroundColor: colors.lightGray,
    borderRadius: spacing.borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  variantChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  variantText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    textAlign: 'center' as const,
  },
  variantTextSelected: {
    color: colors.white,
  },
  variantStock: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center' as const,
  },
  variantStockSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  stockSection: {
    marginBottom: spacing.xl,
  },
  stockChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.md,
    alignSelf: 'flex-start',
  },
  inStock: {
    backgroundColor: colors.success,
  },
  outOfStock: {
    backgroundColor: colors.error,
  },
  stockText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    fontWeight: '600' as const,
  },
  inStockText: {
    color: colors.white,
  },
  outOfStockText: {
    color: colors.white,
  },
  deliveryContainer: {
    flexDirection: 'row' as const,
    gap: spacing.md,
  },
  deliveryOption: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
  },
  deliveryText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.white,
  },
  addToCartButton: {
    marginBottom: spacing.md,
  },
});

export default ProductDetailScreen;
