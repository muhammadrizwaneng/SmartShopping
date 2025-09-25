import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import { colors } from '../theme/color';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface Category {
  id: string;
  name: string;
  icon: IconDefinition;
  color: string[];
  productCount: number;
}

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({category, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={category.color}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <FontAwesomeIcon icon={category.icon} size={14} color="white" />
        {/* <Icon name={category.icon} size={32} color={colors.white} /> */}
        <Text style={styles.name}>{category.name}</Text>
        <Text style={styles.productCount}>{category.productCount} items</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.md,
    width: 100,
    height: 100,
    borderRadius: spacing.borderRadius.lg,
    overflow: 'hidden',
    ...spacing.shadow.sm,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: 'medium', // Use a string value for fontWeight
    color: colors.white,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  productCount: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    opacity: 0.8,
    marginTop: 2,
  },
});