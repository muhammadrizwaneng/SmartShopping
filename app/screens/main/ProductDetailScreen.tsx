import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faTruck} from '@fortawesome/free-solid-svg-icons';
import ApiConfig from '../../config/api-config';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';

const ProductDetailScreen = (props) => {
  const [productData, setProductData] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeMainImage, setActiveMainImage] = useState(null);
  const isFocused = useIsFocused();

  const fetchProductDetails = async (product_id) => {
    const PRODUCT_ID = product_id;
    // const PRODUCT_ID = '68e35fad980706ff128da73d';
    const URL = `${ApiConfig.BASE_URL}${ApiConfig.FETCH_PRODUCTS}/${PRODUCT_ID}`;

    try {
      const response = await axios.get(URL);
      if (response.status === 200) {
        setProductData(response.data);
        setActiveMainImage(response.data?.main_image_url);
        return;
      }
    } catch (error) {
      console.error(
        'Failed to fetch product details:',
        error.response?.data || error.message,
      );
      return null;
    }
  };

  useEffect(() => {
    if(props?.route?.params?.product != "" && props?.route?.params?.product!= null){
      fetchProductDetails(props?.route?.params?.product);
    }
  }, [isFocused]);


  const getDisplayPrice = () => {
    let price;
    if (productData?.has_variants && productData.variants?.length) {

      if(productData.variants[selectedVariantIndex]?.discountprice != null ){
        price = productData.variants[selectedVariantIndex]?.discountprice
      } else {
        price = productData.variants[selectedVariantIndex]?.price;
      }
    } else {
      if(productData?.discount_percent != null){
        price = productData?.discount_price
      } else {
        price = productData?.price;
      }
      
    }

    return price;
  }

  const getDisplayStock = () => {
    if (productData?.has_variants && productData.variants?.length) {
      return productData.variants.reduce(
        (total, variant) => total + (variant.stock || 0),
        0,
      );
    }
    return productData?.stock;
  };

  const displayPrice = getDisplayPrice();
  const displayStock = getDisplayStock();
  const isInStock = displayStock > 0;
  
  const handleVariantSelect = index => {
    setSelectedVariantIndex(index);
  };
  
  if (!productData) {
    return <Text style={{padding: 20}}>Loading product details...</Text>;
  }

  const handleGalleryImageSelect = url => {
    setActiveMainImage(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topSectionBackground}>
        <View style={{height: 250, marginBottom: 20}}>
          <Image
            source={{uri: activeMainImage}}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.galleryContainer}>
          {[productData?.main_image_url, ...(productData?.gallery_images || [])]
            .filter(url => url)
            .map((url, index) => {
              const isSelected = url === activeMainImage;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleGalleryImageSelect(url)}
                  style={[
                    styles.thumbnailWrapper,
                    isSelected && styles.thumbnailWrapperSelected,
                  ]}>
                  <Image
                    source={{uri: url}}
                    style={styles.thumbnailImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{productData?.name}</Text>
        <Text style={styles.brand}>{productData?.brand}</Text>
        <Text style={styles.categoryBreadcrumb}>
          {productData?.category_name || 'Category Name Lookup Needed'}
        </Text>

        {/* Tags/Chips */}
        <View style={styles.tagsContainer}>
          {productData?.tags?.map((tag, index) => (
            <Text key={index} style={styles.tagChip}>
              {tag}
            </Text>
          ))}
        </View>
        
        {/* Price Row */}
        <View style={styles.priceRow}>
          <View style={styles.priceTextGroup}>
            <Text style={styles.discountPrice}>
              {displayPrice ? `$${displayPrice.toFixed(2)}` : 'Price Varies'}
            </Text>
            
            {productData?.has_variants && productData.variants[selectedVariantIndex]?.discountprice != null && (
              <Text style={styles.basePrice}>
                {productData?.has_variants 
                  ? `$${productData.variants[selectedVariantIndex]?.price.toFixed(2)}` 
                  : `$${productData?.price.toFixed(2)}`
                }
              </Text>
            )}

            {productData?.price && productData?.price > displayPrice  && (
              <Text style={styles.basePrice}>
                ${productData?.price.toFixed(2)}
              </Text>
            )}
          </View>
          
          {((productData?.has_variants && productData.variants[selectedVariantIndex]?.discount_percent != null) || (productData?.discount_percent)) && (
            <View style={styles.discountChip}>
              <Text style={styles.discountText}>
                {((productData?.has_variants && productData.variants[selectedVariantIndex]?.discount_percent) || (productData?.discount_percent))}% OFF
              </Text>
            </View>
          )}
        </View>
        <View style={styles.ratingRow}>
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              size={14}
              color={
                i < Math.floor(productData?.rating || 0) ? '#fbbf24' : '#ccc'
              }
              style={{marginRight: 2}}
            />
          ))}
          <Text style={styles.reviewsText}>
            ({productData?.reviews_count || 0} reviews)
          </Text>
        </View>

        {productData?.has_variants && productData?.variants?.length > 0 && (
          <View>
            <Text style={styles.variantTitle}>Variants</Text>
            <View style={styles.variantsContainer}>
              {productData?.variants.map((v, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleVariantSelect(index)}
                  style={[
                    styles.variantChip,
                    index === selectedVariantIndex &&
                      styles.variantChipSelected,
                  ]}>
                  <Text
                    style={[
                      styles.variantText,
                      index === selectedVariantIndex &&
                        styles.variantTextSelected,
                    ]}>
                    {v.name} ({v.stock} left)
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        <View style={[styles.sizeStockRow]}>
          <View style={styles.stockContainer}>
            <Text style={styles.stockText}>
              {isInStock ? '✓ In Stock' : '✕ Out of Stock'}
            </Text>
            <Text style={styles.stockTextSmall}>
              {productData?.has_variants
                ? `(${displayStock} total)`
                : `(${displayStock} left)`}
            </Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          {productData?.features?.map((f, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureValue}>{f.value}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Options</Text>
          <View style={styles.deliveryRow}>
            {productData?.delivery_options?.map((option, index) => (
              <View key={index} style={styles.deliveryChip}>
                <FontAwesomeIcon
                  icon={faTruck}
                  size={14}
                  color="#6366F1"
                  style={{marginRight: 5}}
                />
                <Text style={styles.deliveryText}>{option}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F5EF',
  },
  topSectionBackground: {
    backgroundColor: '#F9F5EF',
    paddingTop: 30,
    paddingBottom: 20,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  galleryContainer: {
    paddingHorizontal: 16,
  },
  thumbnailWrapper: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: '#E7D7C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    zIndex: 10,
    paddingTop: 25,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  brand: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  categoryBreadcrumb: {
    fontSize: 14,
    color: '#666',
    marginTop: 0,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tagChip: {
    backgroundColor: '#F9F5EF',
    color: '#666',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
    fontSize: 13,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  priceTextGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  discountPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginRight: 10,
  },
  basePrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountChip: {
    backgroundColor: '#D72A60',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  discountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addDiscountButton: {
    backgroundColor: '#BD0B0B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    // flex: 1,
    alignSelf:"flex-start"
  },
  addDiscountButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf:"flex-start"
  },
  discountStatusRow: {
    marginBottom: 20,
  },
  discountStatusTextSuccess: {
    fontSize: 14,
    color: '#38A169',
    fontWeight: '600',
  },
  discountStatusTextHint: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewsText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  variantTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  variantsContainer: {
    marginBottom: 20,
  },
  variantChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  variantChipSelected: {
    backgroundColor: '#ef8402ff',
  },
  variantText: {
    color: '#333',
    fontWeight: '500',
  },
  variantTextSelected: {
    color: '#fff',
  },
  sizeStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    color: '#38A169',
    fontSize: 14,
    fontWeight: '600',
  },
  stockTextSmall: {
    color: '#666',
    fontSize: 12,
    marginLeft: 4,
  },
  section: {marginTop: 20},
  sectionTitle: {fontSize: 18, fontWeight: '600', marginBottom: 10},
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  featureLabel: {fontSize: 14, color: '#666'},
  featureValue: {fontSize: 14, fontWeight: '500', color: '#111'},
  deliveryRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 6},
  deliveryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ede9fe',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginTop: 6,
  },
  deliveryText: {color: '#6366F1', fontSize: 13, fontWeight: '500'},
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  cartButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cartButtonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  thumbnailWrapperSelected: {
    borderColor: '#ef8402ff',
    borderWidth: 3,
  },

  // === CENTERED MODAL STYLES ===
  centeredModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  centeredModalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  discountTextInputModal: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
  },
  suggestionChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  suggestionText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  applyButton: {
    backgroundColor: '#6366F1',
  },
  applyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductDetailScreen;