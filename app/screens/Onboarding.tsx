import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { slides, Slide } from '../utils/index';

const { width } = Dimensions.get('window');

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: Slide }) => {
    const [firstWord, ...restWords] = item.title.split(' ');
    return (
      <View style={styles.slideContainer}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>
          <Text style={[styles.titleHighlight, styles[item.titleColor]]}>
            {firstWord}
          </Text>
          <Text> {restWords.join(' ')}</Text>
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  const handleNext = () => {
    console.log("=-=-=-=currentIndex", currentIndex)
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      console.log("-    ")
      navigation.navigate("WelcomeScreen"); // change with your route name
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      />

      {renderDots()}

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slideContainer: {
    width,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 500,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  titleHighlight: {
    // default highlight style (override via dynamic styles below)
  },
  description: {
    textAlign: 'center',
    color: '#4B5563', // gray-600
    paddingHorizontal: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#78350f', // amber-950
    width: 24,
  },
  inactiveDot: {
    backgroundColor: '#D1D5DB', // gray-300
    width: 8,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#78350f', // amber-950
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginBottom: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Dynamic title colors (instead of Tailwind classes)
  red: { color: 'red' },
  blue: { color: 'blue' },
  amber: { color: '#F59E0B' },
});
