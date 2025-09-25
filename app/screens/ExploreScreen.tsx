import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ExploreScreen = () => {
  const [searchText, setSearchText] = useState("");

  const navigation = useNavigation();

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productContainer}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const exploreData = [
    {
      id: "1",
      title: "Hooded Jacket",
      price: "$99.99",
      image: require("../assets/images/one.jpg"),
    },
    {
      id: "2",
      title: "Casual Shirt",
      price: "$49.99",
      image: require("../assets/images/one.jpg"),
    },
  ];

  const categoryData = [
    { id: "1", title: "T-Shirt", image: require("../assets/images/one.jpg") },
    { id: "2", title: "Pant", image: require("../assets/images/one.jpg") },
    { id: "3", title: "Dress", image: require("../assets/images/one.jpg") },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.locationContainer}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.locationText}>Mombasa, Kenya</Text>
        </View>
        <TouchableOpacity style={styles.notificationContainer}>
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>
        <Text onPress={() => navigation.navigate("profile")}>Profile</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.icon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <Image
          source={require("../assets/images/one.jpg")}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>New Collection</Text>
          <Text style={styles.cardDescription}>
            Discount 50% for the first transaction
          </Text>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Category</Text>
        <View style={styles.categoryList}>
          {categoryData.map((category) => (
            <TouchableOpacity style={styles.categoryItem} key={category.id}>
              <Image source={category.image} style={styles.categoryImage} />
              <Text style={styles.categoryItemText}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Products */}
      <FlatList
        data={exploreData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        renderItem={renderProduct}
      />
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#b5651d",
    marginLeft: 6,
  },
  notificationContainer: {
    padding: 8,
  },
  icon: {
    fontSize: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 50,
    paddingHorizontal: 16,
  },
  searchButton: {
    padding: 8,
    marginLeft: 8,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#FFECB3",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardImage: {
    width: "50%",
    height: 200,
    resizeMode: "cover",
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#424242",
  },
  cardDescription: {
    marginTop: 8,
    color: "#757575",
  },
  cardButton: {
    backgroundColor: "#4E342E",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryImage: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 30,
  },
  categoryItemText: {
    marginTop: 4,
    color: "#1f2937",
  },
  productContainer: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    marginHorizontal: 4,
  },
  productImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  productDetails: {
    padding: 12,
  },
  productTitle: {
    fontWeight: "bold",
    color: "#1f2937",
  },
  productPrice: {
    color: "#f97316",
    marginTop: 4,
  },
  flatListContent: {
    paddingBottom: 24,
  },
});
