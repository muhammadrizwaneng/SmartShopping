import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ApiConfig from '../../config/api-config';
import { CallServiceFor } from '../../services/call_services_for';
import { colors, typography, spacing } from '../../theme';
import { Button } from '../../components';


export default function CategoriesScreen() {
  const navigation = useNavigation<any>();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategoriesData = async () => {
      try {
        const res = await CallServiceFor(ApiConfig.FETCH_CATEGORIES_WITH_PRODUCT_COUNTS, 'get', {});
        if (!isMounted) {return;}

        const sorted = res.data.sort(
          (a: any, b: any) => b.product_count - a.product_count
        );

        setCategories(sorted);
      } catch (error) {
        console.log('Error fetching categories:', error);
      } finally {
        if (isMounted) {setLoading(false);}
      }
    };

    fetchCategoriesData();
    return () => { isMounted = false; };
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => navigation.navigate('categoryDetail', { categoryId: item.category_id })}
      style={styles.categoryCard}
    >
      <View style={styles.categoryContent}>
        <Text style={styles.categoryName}>{item.category_name}</Text>
        <Text style={styles.productCount}>
          {item.product_count} {item.product_count === 1 ? 'product' : 'products'}
        </Text>
      </View>
      <FontAwesomeIcon icon={faChevronRight} size={16} color={colors.textLight} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Categories</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Clothing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Electronics</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories available</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(item) => item.category_id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['12xl'],
    fontWeight: 'bold' as const,
    color: colors.textPrimary,
    letterSpacing: -0.28,
  },
  tabsContainer: {
    flexDirection: 'row' as const,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center' as const,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600' as const,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between' as const,
  },
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    width: '48%' as any,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    ...spacing.shadow.sm,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  productCount: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: spacing.xl * 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: spacing.xl * 2,
  },
  emptyText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center' as const,
  },
};
