import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Images Section */}
      <View style={styles.imageRow}>
        <Image
          source={require('../assets/images/one.jpg')}
          style={[styles.mainImage, { transform: [{ rotate: '-10deg' }] }]}
        />
        <View style={styles.sideImagesWrapper}>
          <Image
            source={require('../assets/images/two.jpg')}
            style={[styles.sideImage, { transform: [{ rotate: '10deg' }] }]}
          />
          <Image
            source={require('../assets/images/three.jpg')}
            style={[styles.sideImage, { transform: [{ rotate: '0deg' }] }]}
          />
        </View>
      </View>

      {/* Bottom Content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          The <Text style={styles.highlight}>Fashion App</Text> That Makes You
          Look Your Best
        </Text>
        <Text style={styles.subtitle}>
          Unleash your inner style icon with curated fashion looks, personalized
          just for you.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Signup')} // adjust to your route name
        >
          <Text style={styles.buttonText}>Let's Get Started</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  mainImage: {
    width: 144, // 36 * 4 (Tailwind w-36)
    height: 288, // 72 * 4
    borderRadius: 24,
  },
  sideImagesWrapper: {
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  sideImage: {
    width: 96, // 24 * 4
    height: 192, // 48 * 4
    borderRadius: 9999,
    marginBottom: 16,
  },

  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  highlight: {
    color: '#78350f', // amber-950
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4B5563', // gray-600
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#78350f', // amber-950
    paddingVertical: 12,
    paddingHorizontal: 96,
    borderRadius: 9999,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  loginText: {
    fontSize: 14,
    color: '#000',
  },
  loginLink: {
    color: '#78350f',
    textDecorationLine: 'underline',
  },
});
