import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import ApiConfig from "../../config/api-config";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  discount_price: number | null;
  discount_percent: number | null;
  main_image_url: string;
  has_variants?: boolean;
  variants?: Array<{
    name: string;
    price: number;
    discount_price?: number;
    discount_percent?: number;
  }>;
  category_name: string | null;
}

export default function CategoryPageScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { categoryId } = route.params;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    let mount = true;
    const c = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${ApiConfig.BASE_URL}products/get-products-by-category/${categoryId}`, {
          signal: c.signal,
        });

        if (!mount) return;

        setProducts(res.data);

        if (res.data.length && res.data[0].category_name) {
          setCategoryName(res.data[0].category_name);
        } else {
          const nameFromUrl = categoryId
            .split("-")
            .map(w => w[0]?.toUpperCase() + w.slice(1))
            .join(" ");
          setCategoryName(nameFromUrl);
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
        //   toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
        }
      } finally {
        if (mount) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mount = false;
      c.abort();
    };
  }, [categoryId]);

  const renderProduct = ({ item }: { item: Product }) => {
    const firstVariant = item.variants?.[0];

    // ✅ Price logic: if variant discount exists, use it else use product price
    const displayPrice = item.has_variants
      ? firstVariant?.discount_price ?? firstVariant?.price
      : item.discount_price ?? item.price;

    const originalPrice = item.has_variants
      ? firstVariant?.price
      : item.price;

    const hasDiscount = item.has_variants
      ? !!firstVariant?.discount_price
      : !!item.discount_price;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ProductDetails", { product: item._id })}
      >
        <Image source={{ uri: item.main_image_url }} style={styles.image} />

        {hasDiscount && (
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>
              {item.has_variants
                ? firstVariant?.discount_percent
                : item.discount_percent}
              % OFF
            </Text>
          </View>
        )}

        <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
        <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${displayPrice?.toFixed(2)}</Text>

          {hasDiscount && originalPrice && (
            <Text style={styles.oldPrice}>${originalPrice.toFixed(2)}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.center}>
        <Text>No products found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{categoryName}</Text>
      <Text style={styles.subHeader}>{products.length} products found</Text>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: "#fff", flex: 1 },
  header: { fontSize: 22, fontWeight: "600", marginBottom: 4 },
  subHeader: { fontSize: 14, color: "#777", marginBottom: 12 },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 14,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  image: { width: "100%", height: 140, borderRadius: 8 },
  discountTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#e11d48",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  discountText: { fontSize: 10, color: "#fff", fontWeight: "700" },
  title: { fontWeight: "600", marginVertical: 4, fontSize: 14 },
  desc: { fontSize: 12, color: "#777" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6, marginVertical: 4 },
  price: { fontSize: 16, fontWeight: "700" },
  oldPrice: { fontSize: 12, textDecorationLine: "line-through", color: "#888" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
