import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCreditCard, faTruck, faTag } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../theme/color';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { CallServiceFor } from '../../services/call_services_for';
import ApiConfig from '../../config/api-config';

const CheckoutScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const { items, totalPrice } = useSelector((state: any) => state.cart);
    const user = useSelector((state: any) => state.auth.userInfo);

    const [address, setAddress] = useState('');
    const [voucher, setVoucher] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApplyVoucher = async () => {
        if (!voucher.trim()) return;
        try {
            const response = await CallServiceFor(ApiConfig.VOUCHER_VALIDATE, 'post', { code: voucher });
            if (response.status === 200) {
                setDiscount(response.data.discount_amount || 0);
                Alert.alert('Success', 'Voucher applied successfully!');
            } else {
                Alert.alert('Error', 'Invalid voucher code');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to apply voucher');
        }
    };

    const handlePlaceOrder = async () => {
        if (!address.trim()) {
            Alert.alert('Error', 'Please enter a shipping address');
            return;
        }

        setIsProcessing(true);
        try {
            const orderPayload = {
                items: items.map((item: any) => ({
                    product_id: item._id,
                    quantity: item.quantity,
                })),
                shipping_address: address,
                total_amount: totalPrice - discount,
                payment_method: 'Credit Card', // Default for now
            };

            const response = await CallServiceFor(ApiConfig.CREATE_ORDER, 'post', orderPayload);
            if (response.status === 200 || response.status === 201) {
                Alert.alert('Success', 'Order placed successfully!', [
                    { text: 'OK', onPress: () => navigation.navigate('Home') }
                ]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={[colors.primary, colors.gradientEnd]} style={styles.headerBackground}>
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.white} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Checkout</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Shipping Address */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <FontAwesomeIcon icon={faTruck} size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Shipping Address</Text>
                    </View>
                    <TextInput
                        style={styles.addressInput}
                        placeholder="Enter your full address"
                        multiline
                        numberOfLines={3}
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.orderItemsContainer}>
                        {items.map((item: any) => (
                            <View key={item._id} style={styles.orderItem}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.name} x {item.quantity}</Text>
                                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Voucher */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <FontAwesomeIcon icon={faTag} size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Apply Voucher</Text>
                    </View>
                    <View style={styles.voucherContainer}>
                        <TextInput
                            style={styles.voucherInput}
                            placeholder="Enter voucher code"
                            value={voucher}
                            onChangeText={setVoucher}
                            autoCapitalize="characters"
                        />
                        <TouchableOpacity style={styles.applyButton} onPress={handleApplyVoucher}>
                            <Text style={styles.applyButtonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <FontAwesomeIcon icon={faCreditCard} size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                    </View>
                    <TouchableOpacity style={styles.paymentMethod}>
                        <Text style={styles.paymentText}>Credit Card (Default)</Text>
                    </TouchableOpacity>
                </View>

                {/* Totals Card */}
                <View style={styles.totalsCard}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Discount</Text>
                        <Text style={[styles.totalValue, { color: colors.secondary }]}>-${discount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.finalTotalLabel}>Grand Total</Text>
                        <Text style={styles.finalTotalValue}>${(totalPrice - discount).toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            <SafeAreaView style={styles.footer}>
                <TouchableOpacity
                    style={[styles.placeOrderButton, isProcessing && styles.disabledButton]}
                    onPress={handlePlaceOrder}
                    disabled={isProcessing}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[colors.primary, colors.gradientEnd]}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.placeOrderText}>
                            {isProcessing ? 'Processing...' : 'Place Order Now'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaView>
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
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: typography.fontWeight.bold as any,
        color: colors.white,
        marginLeft: 20,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    section: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        ...spacing.shadow.sm,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: typography.fontWeight.bold as any,
        color: colors.textPrimary,
        marginLeft: 10,
    },
    addressInput: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 15,
        textAlignVertical: 'top',
        fontSize: 14,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    orderItemsContainer: {
        marginTop: 5,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.background,
    },
    itemName: {
        fontSize: 14,
        color: colors.textSecondary,
        flex: 1,
        marginRight: 10,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: typography.fontWeight.semibold as any,
        color: colors.textPrimary,
    },
    voucherContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    voucherInput: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 48,
        marginRight: 10,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.textPrimary,
    },
    applyButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    applyButtonText: {
        color: colors.white,
        fontWeight: typography.fontWeight.bold as any,
        fontSize: 14,
    },
    paymentMethod: {
        padding: 15,
        backgroundColor: colors.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    paymentText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: typography.fontWeight.medium as any,
    },
    totalsCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        marginTop: 5,
        ...spacing.shadow.md,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    totalLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    totalValue: {
        fontSize: 14,
        fontWeight: typography.fontWeight.semibold as any,
        color: colors.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.background,
        marginVertical: 15,
    },
    finalTotalLabel: {
        fontSize: 18,
        fontWeight: typography.fontWeight.bold as any,
        color: colors.textPrimary,
    },
    finalTotalValue: {
        fontSize: 20,
        fontWeight: typography.fontWeight.bold as any,
        color: colors.primary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        padding: 20,
        ...spacing.shadow.lg,
    },
    placeOrderButton: {
        borderRadius: 15,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeOrderText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: typography.fontWeight.bold as any,
    },
    disabledButton: {
        opacity: 0.6,
    },
});

export default CheckoutScreen;
