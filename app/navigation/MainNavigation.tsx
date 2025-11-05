import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faSearch, faList, faUser, faMagnifyingGlass,faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHome as faHomeOutline, faListAlt, faUser as faUserOutline } from '@fortawesome/free-regular-svg-icons';

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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  
  <Stack.Navigator>
    <Stack.Screen 
      name="UserDashboard" 
      component={UserDashboardScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen 
      name="HomeMain" 
      component={HomeScreen} 
      options={{headerShown: false}}
    />
    <Stack.Screen 
      name="ProductDetails" 
      component={ProductDetailScreen}
      options={{
        headerTitle: 'Product Details',
        headerStyle: {backgroundColor: colors.primary},
        headerTintColor: colors.white,
      }}
    />
    <Stack.Screen 
      name="CreateProduct" 
      component={CreateProductScreen}
      options={{
        headerTitle: 'Product Details',
        headerStyle: {backgroundColor: colors.primary},
        headerTintColor: colors.white,
      }}
    />

    <Stack.Screen
      name="CategoryPageScreen" 
      component={CategoryPageScreen}
      options={{
        headerTitle: 'Category Products',
        headerStyle: {backgroundColor: colors.primary},
        headerTintColor: colors.white,
      }}
    />
    

  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Categories" 
      component={CategoriesScreen} 
      options={{headerShown: false}}
    />
    <Stack.Screen 
      name="categoryDetail" 
      component={CategoryPageScreen}
      options={{
        headerTitle: 'Category Details',
        headerStyle: {backgroundColor: colors.primary},
        headerTintColor: colors.white,
      }}
    /> 
    {/* <Stack.Screen 
      name="BarcodeScanner" 
      component={BarcodeScannerScreen}
      options={{
        headerTitle: 'Scan Barcode',
        headerStyle: {backgroundColor: colors.dark},
        headerTintColor: colors.white,
      }}
    />
    <Stack.Screen 
      name="CameraSearch" 
      component={CameraSearchScreen}
      options={{
        headerTitle: 'Camera Search',
        headerStyle: {backgroundColor: colors.dark},
        headerTintColor: colors.white,
      }}
    />
    */}
  </Stack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
  
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
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{tabBarLabel: 'Home'}}
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
        component={ProfileScreen}
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