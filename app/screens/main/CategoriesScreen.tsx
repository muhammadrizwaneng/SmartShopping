import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Pressable } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import ApiConfig from '../../config/api-config';


// interface Category {
//   _id: string;
//   category_name: string;
//   category_id: string;
//   product_count: number;
// }

export default function CategoriesScreen() {
  const navigation = useNavigation();
  // const [categories, setCategories] = useState<Category[]>([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${ApiConfig.BASE_URL}category/categories-with-product-count`);
        if (!isMounted) return;

        const sorted = res.data.sort(
          (a,b) => b.product_count - a.product_count
        );

        setCategories(sorted);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();
    return () => { isMounted = false };
  }, []);

  const renderItem = ({ item }: { item: Category }) => (
    <Pressable
      onPress={() => navigation.navigate("categoryDetail", { categoryId: item.category_id })}
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 14,
        margin: 6,
        elevation: 2
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 6 }}>
        {item.category_name}
      </Text>

      <Text style={{ color: "#555" }}>
        {item.product_count} {item.product_count === 1 ? "product" : "products"}
      </Text>

      <Text style={{ position: "absolute", right: 12, bottom: 12, fontSize: 18 }}>
        ➜
      </Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f8f9fa" }}>
      <Text style={{ fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 12 }}>
        Shop by Category
      </Text>

      {loading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" />
        </View>
      ) : categories.length === 0 ? (
        <View style={{ marginTop: 50 }}>
          <Text style={{ textAlign: "center", color: "#666" }}>
            No categories available
          </Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(item) => item.category_id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      )}
    </View>
  );
}
