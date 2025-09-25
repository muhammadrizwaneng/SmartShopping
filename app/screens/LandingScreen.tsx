import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {
  const [message, setMessage] = useState('Welcome to SmartShopping!');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SmartShopping</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={() => {navigation.navigate('Onboarding');}}>
        <Text>Press Here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
});

export default HomeScreen;
