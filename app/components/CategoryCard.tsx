import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { colors } from '../theme/color';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface Category {
  category_id: string;
  category_name: string;
  product_count: number;
}

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[colors.primary, colors.gradientEnd || colors.primaryDark]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.glassEffect}>
          <Text style={styles.name} numberOfLines={1}>{category.category_name}</Text>
          <Text style={styles.productCount}>{category.product_count} items</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.md,
    width: 120,
    height: 120,
    borderRadius: spacing.borderRadius.xl,
    overflow: 'hidden',
    ...spacing.shadow.md,
  },
  gradient: {
    flex: 1,
    padding: 1, // Border effect
  },
  glassEffect: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.xl,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.white,
    textAlign: 'center',
  },
  productCount: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
});