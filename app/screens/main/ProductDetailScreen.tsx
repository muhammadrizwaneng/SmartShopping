import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar, faTruck } from "@fortawesome/free-solid-svg-icons";

const ProductDetailScreen = () => {
  const product = {
    name: "Gaming Laptop",
    brand: "Brand",
    description:
      "High-performance gaming laptop with Intel i9, RTX 4080, 32GB RAM, 1TB SSD.",
    category: "Electronics",
    subCategory: "Computers",
    tags: ["Gaming", "Laptop"],
    base_price: 1299.99,
    discount_price: 899.99,
    discount_percent: "31% OFF",
    rating: 4.5,
    reviews_count: 128,
    main_image_url:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    gallery_images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    ],
    variants: [
      { color: 'Black', selected: true },
      { color: 'Silver', selected: false },
      { color: 'White', selected: false },
    ],
    sizes: [
      { size: '256GB', selected: false },
      { size: '512GB', selected: true },
    ],
    stock: 12,
    features: [
      { label: "Processor", value: "Intel Core i9" },
      { label: "Graphics", value: "NVIDIA RTX 4080" },
      { label: "RAM", value: "32GB DDR5" },
      { label: "Storage", value: "1TB SSD" },
    ],
    delivery_options: ["Standard", "Express", "Same Day"],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Background Container (Beige) */}
      <View style={styles.topSectionBackground}>

        <View style={{height:250,marginBottom:20}}>
            <Image
            source={{ uri: product.main_image_url }}
            style={styles.mainImage}
            resizeMode="contain"
            />
        </View>

        {/* Gallery/Thumbnails */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryContainer}>
          {product.gallery_images.map((url, index) => (
            <TouchableOpacity key={index} style={styles.thumbnailWrapper}>
              <Image
                source={{ uri: url }}
                style={styles.thumbnailImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Info (White Card) */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>

        {/* Brand & Category Breadcrumbs */}
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.categoryBreadcrumb}>
          {product.category} {'>'} {product.subCategory}
        </Text>

        {/* Tags/Chips */}
        <View style={styles.tagsContainer}>
          {product.tags.map((tag, index) => (
            <Text key={index} style={styles.tagChip}>{tag}</Text>
          ))}
        </View>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <View style={styles.priceTextGroup}>
            <Text style={styles.discountPrice}>${product.discount_price}</Text>
            <Text style={styles.basePrice}>${product.base_price}</Text>
          </View>
          <View style={styles.discountChip}>
            <Text style={styles.discountText}>{product.discount_percent}</Text>
          </View>
        </View>
        
        {/* Rating and Reviews */}
        <View style={styles.ratingRow}>
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon 
              key={i}
              icon={faStar} 
              size={14} 
              color={i < Math.floor(product.rating) ? '#fbbf24' : '#ccc'} 
              style={{ marginRight: 2 }}
            />
          ))}
          <Text style={styles.reviewsText}>({product.reviews_count} reviews)</Text>
        </View>

        {/* Variants Section */}
        <Text style={styles.variantTitle}>Variants</Text>
        <View style={styles.variantsContainer}>
          {product.variants.map((v, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.variantChip, 
                v.selected && styles.variantChipSelected
              ]}
            >
              <Text style={[
                styles.variantText,
                v.selected && styles.variantTextSelected
              ]}>
                {v.color}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Size/Stock Section */}
        <View style={styles.sizeStockRow}>
          <Text style={styles.variantTitle}>Size</Text>
          <View style={styles.sizesContainer}>
            {product.sizes.map((s, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.variantChip, 
                  s.selected && styles.variantChipSelected
                ]}
              >
                <Text style={[
                  styles.variantText,
                  s.selected && styles.variantTextSelected
                ]}>
                  {s.size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.stockContainer}>
            <Text style={styles.stockText}>✓ In Stock</Text>
            <Text style={styles.stockTextSmall}>({product.stock} left)</Text>
          </View>
        </View>
        
        
        {/* Features (Original Code Section - Kept for structure/completeness) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          {product.features.map((f, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureValue}>{f.value}</Text>
            </View>
          ))}
        </View>

        {/* Delivery Options (Original Code Section) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Options</Text>
          <View style={styles.deliveryRow}>
            {product.delivery_options.map((option, index) => (
              <View key={index} style={styles.deliveryChip}>
                <FontAwesomeIcon
                  icon={faTruck}
                  size={14}
                  color="#6366F1"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.deliveryText}>{option}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Add to Cart */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // === GLOBAL/LAYOUT STYLES ===
  container: { 
    flex: 1, 
    backgroundColor: "#F9F5EF" 
  },
  
  // === TOP SECTION STYLES (MATCHING IMAGE) ===
  topSectionBackground: {
    backgroundColor: "#F9F5EF",
    paddingTop: 30, 
    paddingBottom: 20,
  },
  mainImage: { 
    width: "100%", // <--- THIS IS THE CHANGE
    height: "100%", 
    alignSelf: 'center', 
    marginBottom: 20 
  },
  
  // Gallery Styles
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
    overflow: 'hidden'
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },

  // === INFO CONTAINER STYLES (MATCHING IMAGE) ===
  infoContainer: { 
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    zIndex: 10,
    paddingTop: 25,
  },
  productName: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#111", 
    marginBottom: 4 
  },
  brand: { 
    fontSize: 16, 
    color: "#333", 
    fontWeight: '500' 
  },
  categoryBreadcrumb: { 
    fontSize: 14, 
    color: "#666", 
    marginTop: 0, 
    marginBottom: 10 
  },
  
  // Tags Styles
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
  
  // Price Styles
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
    fontWeight: "bold", 
    color: "#111", 
    marginRight: 10,
  },
  basePrice: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
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
  
  // Rating Styles
  ratingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  reviewsText: { 
    marginLeft: 6, 
    fontSize: 14, 
    color: "#666" 
  },

  // Variants Styles
  variantTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#111', 
    marginBottom: 8 
  },
  variantsContainer: {
    flexDirection: 'row',
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
  },
  variantChipSelected: {
    backgroundColor: '#ef8402ff',
    // borderColor: '#6D4F35',
  },
  variantText: {
    color: '#333',
    fontWeight: '500',
  },
  variantTextSelected: {
    color: '#fff',
  },

  // Size and Stock Styles
  sizeStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
  },
  sizesContainer: {
    flexDirection: 'row',
    marginRight: 20,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', 
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

  // === ORIGINAL STYLES (KEPT FOR FEATURES/DELIVERY) ===
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  featureLabel: { fontSize: 14, color: "#666" },
  featureValue: { fontSize: 14, fontWeight: "500", color: "#111" },
  deliveryRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  deliveryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ede9fe",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginTop: 6,
  },
  deliveryText: { color: "#6366F1", fontSize: 13, fontWeight: "500" },
  
  // Footer/Cart Button
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  cartButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cartButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default ProductDetailScreen;