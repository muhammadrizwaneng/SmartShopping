import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../theme/color';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import ProductCard from '../../components/ProductCard';
import { CallServiceFor } from '../../services/call_services_for';
import ApiConfig from '../../config/api-config';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            // The API getAllProducts doesn't seem to have a query param in the path, 
            // but let's assume it accepts a query param or we filter.
            // Based on typical REST, we'll try passing it as a param.
            const response = await CallServiceFor(ApiConfig.FETCH_LIST_PRODUCTS, 'get', {});
            if (response.status === 200) {
                const allProducts = response.data;
                const filtered = allProducts.filter((p: any) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setProducts(filtered);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderProductItem = ({ item }: { item: any }) => (
        <View style={styles.productWrapper}>
            <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetails', { product: item?._id })}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={[colors.primary, colors.gradientEnd]} style={styles.headerBackground}>
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.white} />
                        </TouchableOpacity>
                        <View style={styles.glassSearchBar}>
                            <FontAwesomeIcon icon={faSearch} size={16} color={colors.white} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search products..."
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                                autoFocus
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <View style={styles.content}>
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : searched && products.length === 0 ? (
                    <View style={styles.center}>
                        <FontAwesomeIcon icon={faSearch} size={60} color={colors.lightGray} />
                        <Text style={styles.noResults}>No products found for "{searchQuery}"</Text>
                    </View>
                ) : (
                    <FlatList
                        data={products}
                        renderItem={renderProductItem}
                        keyExtractor={(item) => item._id}
                        numColumns={2}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={styles.columnWrapper}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerBackground: {
        paddingBottom: spacing.lg,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xs,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    glassSearchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 15,
        paddingHorizontal: spacing.md,
        height: 45,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: 16,
        color: colors.white,
    },
    content: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    noResults: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.md,
    },
    listContent: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.md,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    productWrapper: {
        width: '48%',
    },
});

export default SearchScreen;
