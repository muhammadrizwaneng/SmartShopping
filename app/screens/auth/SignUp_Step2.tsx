import React, { use, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginUser, setSignupSuccess } from '../../redux/userSlice';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Hello',
    desc: 'Lorem ipsum dolor sit amet, \n consectetur adipiscing elit. \n Sed non consectetur turpis. \n Morbi eu eleifend lacus.',
    img: require('../../assets/images/Image.jpg'),
  },
  {
    id: 2,
    title: 'Ready?',
    desc: 'Lorem ipsum dolor sit amet, \n consectetur adipiscing elit. \n Sed non consectetur turpis. \n Morbi eu eleifend lacus.',
    img: require('../../assets/images/Image2.jpg'),
  },
  {
    id: 3,
    title: 'Discover',
    desc: 'Explore thousands of products tailored just for you and your style.',
    img: require('../../assets/images/Image3.jpg'),
  },
  {
    id: 4,
    title: 'Shop Now',
    desc: 'Quick checkout and secure payment options for a seamless experience.',
    img: require('../../assets/images/Image4.jpg'),
  }
];

const SignUp_Step2 = (props) => {
    console.log('props:', props);
  const [activeIndex, setActiveIndex] = useState(0);
  const  user  = props?.route?.params?.user;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };


    const handleStart = () => {
    dispatch(setSignupSuccess({
        user: user,
        token: user.access_token.access_token,   // your backend sends access_token
    }));

    // navigation.replace("HomeScreen"); // redirect to dashboard
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.bgMain}>
          <Image source={require('../../assets/images/mask_group_6.png')} style={styles.bgImage}/>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
            {slides.map((item, i) => (
            <View key={item.id} style={styles.cardWrapper}>
                <View style={styles.card}>
                <View style={styles.imageBox}>
                    <Image source={item.img} style={styles.mainImage}/>
                </View>

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
                {i === slides.length - 1 && (
                    <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
                    <Text style={styles.startBtnText}>Let's Start</Text>
                    </TouchableOpacity>
                )}
                </View>
            </View>
            ))}
        </ScrollView>

        {/* Pagination */}
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff' },

  bgMain: { height: 678, width: 331, position: 'absolute' },
  bgImage: { width: '100%', height: '100%' },

  cardWrapper: { width, alignItems: 'center' },

  card: {
    height: 678,
    width: 331,
    justifyContent: 'flex-start',
    alignItems: 'center',
    top: 100,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

  imageBox: {
    height: 338,
    width: 326,
    marginBottom: 50,
    overflow: 'hidden',
    borderRadius: 20
  },
  mainImage: { width: '100%', height: '100%' },

  title: {
    color: '#000',
    fontSize: 28,
    marginBottom: 25,
    fontFamily: 'Raleway-Bold'
  },
  desc: {
    color: '#000',
    fontSize: 19,
    textAlign: 'center',
    fontFamily: 'nunito-sans.light'
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 4 },
  activeDot: { backgroundColor: '#0054FF', width: 25 },
  inactiveDot: { backgroundColor: '#E5E9F0' },
  startBtn: {
  backgroundColor: '#0054FF',
  paddingVertical: 12,
  paddingHorizontal: 50,
  borderRadius: 15,
  marginTop: 20,
},
startBtnText: {
  color: '#fff',
  fontSize: 22,
  fontWeight: '600',
  fontFamily: 'nunito-sans.light',
},
});

export default SignUp_Step2;
