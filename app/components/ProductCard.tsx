import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { faHeart, faStar, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { colors } from '../theme/color';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux';
import AuthModal from './AuthModal';
import { useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  main_image_url: string;
  rating: number;
  reviewCount: number;
  discount_percent?: number;
  has_variants?: boolean;
  variants?: any[];
}

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  style?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, style }) => {
  const dispatch = useDispatch();
  const scaleValue = new Animated.Value(1);
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setIsAuthModalVisible(true);
      return;
    }
    dispatch(
      addToCart({
        id: product._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.main_image_url,
      })
    );
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const discount = product.has_variants ? product.variants?.[0]?.discount_percent : product.discount_percent;

  return (
    <Animatable.View animation="fadeInUp" duration={600}>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product?.main_image_url }}
              style={styles.image}
              resizeMode="cover"
            />
            {discount > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discount}%</Text>
              </View>
            )}
            <TouchableOpacity style={styles.favoriteButton}>
              <FontAwesomeIcon icon={faHeart} size={14} color={colors.gray} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Text>

            <View style={styles.ratingContainer}>
              <FontAwesomeIcon icon={faStar} size={12} color={colors.rating} />
              <Text style={styles.ratingText}>{product.rating || '4.5'}</Text>
              <Text style={styles.reviewCount}>({product.reviewCount || '24'})</Text>
            </View>

            <View style={styles.footer}>
              <View>
                <Text style={styles.price}>
                  ${(product.price || (product.has_variants && product.variants && product.variants[0]?.price) || 0).toFixed(2)}
                </Text>
                {product.originalPrice && (
                  <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
                )}
              </View>
              <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                <FontAwesomeIcon icon={faPlus} size={12} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
      <AuthModal
        isVisible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onSuccess={handleAddToCart}
      />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    marginRight: spacing.md,
    width: 165,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...spacing.shadow.sm,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    backgroundColor: colors.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.discount,
    borderRadius: spacing.borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    zIndex: 1,
  },
  discountText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.white,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: spacing.borderRadius.full,
    padding: spacing.xs,
    zIndex: 1,
  },
  content: {
    padding: spacing.md,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    height: 36,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ratingText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium as any,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 10,
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard;
