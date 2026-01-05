import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faSearch, faList, faUser, faMagnifyingGlass, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHome as faHomeOutline, faListAlt, faUser as faUserOutline } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass as faSearchOutline } from '@fortawesome/free-solid-svg-icons';

// import SearchScreen from '../screens/main/SearchScreen';
// import ShoppingListScreen from '../screens/main/ShoppingListScreen';
// import ProfileScreen from '../screens/main/ProfileScreen';
// import ProductDetailsScreen from '../screens/main/ProductDetailsScreen';
// import BarcodeScannerScreen from '../screens/main/BarcodeScannerScreen';
// import CameraSearchScreen from '../screens/main/CameraSearchScreen';
// import PriceComparisonScreen from '../screens/main/PriceComparisonScreen';


import HomeScreen from '../screens/main/HomeScreen';
import { colors } from '../theme/color';
import ProductDetailScreen from '../screens/main/ProductDetailScreen';
import CreateProductScreen from '../screens/main/CreateProductScreen';
import CategoryPageScreen from '../screens/main/CategoryPageScreen';
import CategoriesScreen from '../screens/main/CategoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/main/CartScreen';
import UserDashboardScreen from '../screens/main/UserDashboard';
import SearchScreen from '../screens/main/SearchScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import WishlistScreen from '../screens/main/WishlistScreen';
import ProductOrderScreen from '../screens/ProductOrderScreen';
import ProfileDetailScreen from '../screens/main/ProfileDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (

  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="UserDashboard"
      component={UserDashboardScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProductDetails"
      component={ProductDetailScreen}
      options={{
        headerTitle: 'Product Details',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    />
    <Stack.Screen
      name="CreateProduct"
      component={CreateProductScreen}
      options={{
        headerTitle: 'Product Details',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    />

    <Stack.Screen
      name="CategoryPageScreen"
      component={CategoryPageScreen}
      options={{
        headerTitle: 'Category Products',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    />

    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{ headerShown: false }}
    />

  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Categories"
      component={CategoriesScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="categoryDetail"
      component={CategoryPageScreen}
      options={{
        headerTitle: 'Category Details',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    />
    <Stack.Screen
      name="ProductDetails"
      component={ProductDetailScreen}
      options={{
        headerTitle: 'Product Details',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    />
  </Stack.Navigator>
);

// ProductOrderScreen already imported if added to the top, but let's just clean this block
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Wishlist"
      component={WishlistScreen}
      options={{
        headerTitle: 'My Wishlist',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    />
    <Stack.Screen
      name="ProductOrderScreen"
      component={ProductOrderScreen}
      options={{
        headerTitle: 'My Orders',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    />
    <Stack.Screen
      name="ProfileDetailScreen"
      component={ProfileDetailScreen}
      options={{
        headerTitle: 'Profile Details',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    />

  </Stack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({

        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          switch (route.name) {
            case 'Home':
              icon = focused ? faHome : faHomeOutline;
              break;
            case 'Search':
              icon = focused ? faSearch : faSearchOutline;
              break;
            case 'ShoppingList':
              icon = focused ? faList : faListAlt; // Regular for outline
              break;
            case 'Profile':
              icon = focused ? faUser : faUserOutline;
              break;
            default:
              icon = faHomeOutline;
          }

          return <FontAwesomeIcon icon={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.lightGray,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon
              icon={focused ? faSearch : faMagnifyingGlass}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ position: 'relative' }}>
              <FontAwesomeIcon
                icon={faShoppingCart}
                size={size}
                color={color}
              />
              <View style={{
                position: 'absolute',
                top: -5,
                right: -8,
                backgroundColor: 'red',
                borderRadius: 10,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                  {useSelector((state: any) => state.cart.items?.length) || 0}
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon
              icon={focused ? faUser : faUserOutline}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
