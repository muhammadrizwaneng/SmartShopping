import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native-animatable';


const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ width: 200, height: 200 }} >
        <Image source={require('../assets/images/shopicon.png')} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
      </View>
      <Text style={styles.title}>SmartShopping</Text>
      <Text style={styles.message}>Discover. Shop. Save</Text>
      <Text style={styles.message}>Smarter Every Day</Text>
      <TouchableOpacity onPress={() => {navigation.navigate('Signup')}} style={{
        backgroundColor:'#004CFF',width:'100%',alignItems:'center',paddingVertical:10,borderRadius:10,marginTop:150
        }}>
        <Text style={{color:'#fff'}}>Let's Started</Text>
      </TouchableOpacity>
      <View style={{flexDirection:'row',alignItems:'center',marginTop:18,gap:20}}>
        <Text style={{fontFamily:'nunito-sans.light',fontSize:15}}>I already have an account</Text>
        <TouchableOpacity style={{ width: 30, height: 30 }} onPress={() => {navigation.navigate('Login')}}  >
          <Image source={require('../assets/images/arrow-front.png')} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // D9E4FF
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontFamily:'nunito-sans.bold',
    fontSize: 52,
    marginBottom: 20,
    color: '#333',
  },
  message: {
    fontFamily:'nunito-sans.light',
    fontSize: 19,
    marginBottom: 19,
    color: '#000',
  },
});

export default HomeScreen;
