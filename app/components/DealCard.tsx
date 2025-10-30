import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../theme/color';

interface Deal {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  discount: number;
  timeLeft: string;
  has_variants: boolean;
  variants?: Array<{
    discountprice?: number;
    discount_percent?: number;
    price: number;
  }>;
}

interface DealCardProps {
  deal: Deal;
  onPress: () => void;
}

const DealCard: React.FC<DealCardProps> = ({deal, onPress}) => {
  // Filter variants to get only the ones with discounts
  const discountedVariants = deal?.variants?.filter(
    variant => variant.discountprice != null || variant.discount_percent != null
  );

    const isSingleProductWithDiscount = !deal.has_variants && deal.discount_percent != null;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={[colors.error, colors.accent]}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        
        <View style={styles.header}>
          {/* Display discount text for variants with discounts */}
          <View style={styles.discountBadge}>
                   {isSingleProductWithDiscount ? (
              <Text style={styles.discountText}>{deal.discount_percent}% OFF</Text>
            ) : (
              discountedVariants?.map((variant, index) => (
                <Text key={index} style={styles.discountText}>
                  {variant.discount_percent}% OFF
                </Text>
              ))
            )}
          </View>
          <View style={styles.timeContainer}>
            <FontAwesomeIcon icon={faTimes} size={12} color="white" />
            <Text style={styles.timeText}>{deal.timeLeft}</Text>
          </View>
        </View>

         <Image
            source={{ uri: deal?.main_image_url }}
            style={styles.image}
            resizeMode="contain"
         />
        
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {deal.name}
          </Text>
          <View style={styles.priceContainer}>
            {/* Render the discounted variant's price */}
            { isSingleProductWithDiscount ? (
              <>
                <Text style={styles.price}>${deal?.discount_price}</Text>
                <Text style={styles.originalPrice}>${deal?.price}</Text>
              </>
            ) : (
              discountedVariants?.length > 0 &&  (
                discountedVariants?.map((variant, index) => (
                  <View key={index}>
                    <Text style={styles.price}>${variant.discountprice}</Text>
                    <Text style={styles.originalPrice}>${variant.price}</Text>
                  </View>
                ))
              )
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.md,
    width: 200,
    borderRadius: spacing.borderRadius.lg,
    overflow: 'hidden',
    ...spacing.shadow.md,
  },
  gradient: {
    flex: 1,
    padding: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  discountBadge: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: spacing.borderRadius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  timeText: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    marginLeft: 2,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: spacing.borderRadius.md,
    marginBottom: spacing.sm,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  originalPrice: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.7,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
});

export default DealCard;
