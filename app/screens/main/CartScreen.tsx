import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/cartSlice';
import { colors } from '../../theme/color';
import AuthModal from '../../components/AuthModal';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const navigation = useNavigation<any>();
  const { items, totalItems, totalPrice } = useSelector((state: any) => state.cart);
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const [isAuthModalVisible, setIsAuthModalVisible] = React.useState(false);
  const dispatch = useDispatch();

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item?.image }}
        style={styles.productImage}
        resizeMode="cover"
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
        onPress={() => dispatch(removeFromCart(item.id || item._id))}
      >
        <LinearGradient
          colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
          style={styles.trashCircle}
        >
          <FontAwesomeIcon icon={faTrash} size={16} color={colors.error} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (!isLoggedIn) {
      return (
        <View style={styles.emptyCart}>
          <LinearGradient
            colors={['rgba(79, 70, 229, 0.1)', 'rgba(124, 58, 237, 0.05)']}
            style={styles.emptyIconContainer}
          >
            <FontAwesomeIcon icon={faUser} size={40} color={colors.primary} />
          </LinearGradient>
          <Text style={styles.emptyCartText}>Login to see your cart</Text>
          <Text style={styles.emptyCartSubtext}>Please login or continue as a guest to view your shopping cart and manage items.</Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => setIsAuthModalVisible(true)}
          >
            <Text style={styles.shopNowText}>Sign In / Join</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (items.length === 0) {
      return (
        <View style={styles.emptyCart}>
          <LinearGradient
            colors={['rgba(79, 70, 229, 0.1)', 'rgba(124, 58, 237, 0.05)']}
            style={styles.emptyIconContainer}
          >
            <FontAwesomeIcon icon={faTrash} size={40} color={colors.primary} />
          </LinearGradient>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>Looks like you haven't added anything to your cart yet.</Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopNowText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <SafeAreaView style={styles.footer} edges={['bottom'] as any}>
          <View style={styles.summaryContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('Checkout')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.gradientEnd]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.gradientEnd]} style={styles.headerBackground}>
        <SafeAreaView edges={['top'] as any}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Cart</Text>
            <View style={styles.itemCountBadge}>
              <Text style={styles.itemCountText}>{totalItems} Items</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {renderContent()}

      <AuthModal
        isVisible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBackground: {
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 15, // Added padding to push content down
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.white,
  },
  itemCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  itemCountText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
    paddingBottom: 150,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    ...spacing.shadow.sm,
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: colors.background,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.textPrimary,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.primary,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityButton: {
    padding: 8,
    paddingHorizontal: 12,
  },
  quantityText: {
    minWidth: 25,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.textPrimary,
  },
  trashCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    marginLeft: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...spacing.shadow.lg,
  },
  summaryContainer: {
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium as any,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.textPrimary,
  },
  checkoutButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: typography.fontWeight.bold as any,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 22,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  emptyCartSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  shopNowButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  shopNowText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CartScreen;
