import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Image,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../theme/color';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { CallServiceFor } from '../../services/call_services_for';
import ApiConfig from '../../config/api-config';
import { useNavigation } from '@react-navigation/native';

const WishlistScreen = () => {
    const navigation = useNavigation<any>();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await CallServiceFor(ApiConfig.WISHLIST_GET, 'get', {});
            if (response.status === 200) {
                setWishlist(response.data.items || []);
            }
        } catch (error) {
            console.error('Fetch wishlist error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId: string) => {
        try {
            const response = await CallServiceFor(ApiConfig.WISHLIST_REMOVE, 'post', { product_id: productId });
            if (response.status === 200) {
                setWishlist(wishlist.filter(item => item.product_id !== productId));
            }
        } catch (error) {
            console.error('Remove from wishlist error:', error);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.wishlistItem}
            onPress={() => navigation.navigate('ProductDetails', { product: item.product_id })}
        >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item.product_id)}
            >
                <FontAwesomeIcon icon={faTrash} size={18} color={colors.error} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wishlist</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : wishlist.length === 0 ? (
                <View style={styles.center}>
                    <FontAwesomeIcon icon={faHeart} size={60} color={colors.lightGray} />
                    <Text style={styles.emptyText}>Your wishlist is empty</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.shopButtonText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={wishlist}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.product_id}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.white,
        ...spacing.shadow.sm,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold as any,
        color: colors.textPrimary,
        marginLeft: spacing.lg,
    },
    listContent: {
        padding: spacing.md,
    },
    wishlistItem: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: spacing.borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...spacing.shadow.sm,
        alignItems: 'center',
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: spacing.borderRadius.sm,
    },
    itemDetails: {
        flex: 1,
        marginLeft: spacing.md,
    },
    productName: {
        fontSize: typography.fontSize.base,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    productPrice: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold as any,
        color: colors.primary,
    },
    removeButton: {
        padding: spacing.sm,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        fontSize: typography.fontSize.lg,
        color: colors.textSecondary,
        marginTop: spacing.md,
        marginBottom: spacing.xl,
    },
    shopButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: spacing.borderRadius.md,
    },
    shopButtonText: {
        color: colors.white,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold as any,
    },
});

export default WishlistScreen;
