import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { colors } from '../theme/color';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  style?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({product, onPress, style}) => {

//   const getProductPrices = (product) => {
//   if (product.has_variants && product.variants?.length > 0) {
//     // Return all variant prices
//     return product.variants.map(variant => ({
//       name: variant.name,
//       price: variant.price,
//       discountPrice: variant.discountprice,
//       discountPercent: variant.discount_percent ?? null,
//     }));
//   } else {
//     // Return root product price
//     return [{
//       name: product.name,
//       price: product.price,
//       discountPrice: product.discount_price ?? product.price,
//       discountPercent: product.discount_percent ?? null,
//     }];
//   }
// };

//       const discountPercentage = getProductPrices(product)
      console.log("=-=-discountPercentage",product)
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
            source={{ uri: product?.main_image_url }}
            style={styles.image}
            resizeMode="cover"
            />
        {((product?.has_variants && product?.variants[0]?.discount_percent != null)|| (product?.discount_percent)) && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{((product?.has_variants &&product?.variants[0]?.discount_percent) || (product?.discount_percent) )}%</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteButton}>
            <FontAwesomeIcon icon={faHeart} size={18} color={colors.gray} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.ratingContainer}>
            <FontAwesomeIcon icon={faStar}  size={14} color={colors.rating} />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
        
        <View style={styles.priceContainer}>
          {/* <Text style={styles.price}>${((product?.has_variants &&product?.variants[0]?.price) || (product?.price) )}</Text> */}
          {/* {!product?.has_variants && product?.price ? (
            <Text style={styles.price}>${product?.price}</Text>
          ) : product?.has_variants && product?.discount_price != null && (
            <Text style={styles.price}>${product?.discount_price}</Text>
          ) } */}
          {((!product?.has_variants && product?.discount_price != null)) ? (
            <>
              <Text style={styles.price}>${!product?.has_variants &&product?.discount_price}</Text>
              <Text style={styles.originalPrice}>${((!product?.has_variants &&product?.price) )}</Text>
            </>
          ) : !product?.has_variants && (
            <Text style={styles.price}>${((!product?.has_variants &&product?.price) )}</Text>
          )}
          {((product?.has_variants && product?.variants[0]?.discountprice != null)) ? (
            <>
              <Text style={styles.price}>${product?.has_variants &&product?.variants[0]?.discountprice}</Text>
              <Text style={styles.originalPrice}>${((product?.has_variants &&product?.variants[0]?.price) )}</Text>
            </>
          ) : product?.has_variants && (
            <Text style={styles.price}>${((product?.has_variants &&product?.variants[0]?.price) )}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    marginRight: spacing.md,
    width: 160,
    ...spacing.shadow.sm,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: spacing.borderRadius.lg,
    borderTopRightRadius: spacing.borderRadius.lg,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.error,
    borderRadius: spacing.borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.full,
    padding: spacing.sm,
    ...spacing.shadow.sm,
  },
  content: {
    padding: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rating: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  reviewCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    marginLeft: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
});

export default ProductCard;