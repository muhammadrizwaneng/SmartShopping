import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/cartSlice';
import { colors } from '../../theme/color';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const CartScreen = () => {
  const { items, totalItems, totalPrice } = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item?.image }} 
        style={styles.productImage} 
        resizeMode="contain"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.productName} numberOfLines={2}>{item?.name}</Text>
        <Text style={styles.productPrice}>${item?.price.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => {
              if (item?.quantity > 1) {
                dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }));
              } else {
                dispatch(removeFromCart(item._id));
              }
            }}
          >
            <FontAwesomeIcon icon={faMinus} size={14} color={colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item?.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
          >
            <FontAwesomeIcon icon={faPlus} size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => dispatch(removeFromCart(item.id))}
      >
        <FontAwesomeIcon icon={faTrash} size={18} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>Add some products to get started</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total Items:</Text>
              <Text style={styles.totalAmount}>{totalItems}</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total Price:</Text>
              <Text style={[styles.totalAmount, { color: colors.primary }]}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60, // Add top padding to prevent overlap with status bar
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 120, // Space for the fixed footer
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...spacing.shadow.sm,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: spacing.borderRadius.sm,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: spacing.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  quantityText: {
    minWidth: 30,
    textAlign: 'center',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as any,
  },
  removeButton: {
    padding: spacing.xs,
    alignSelf: 'flex-start',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...spacing.shadow.md,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  totalText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.textPrimary,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  checkoutButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold as any,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyCartText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyCartSubtext: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default CartScreen;
