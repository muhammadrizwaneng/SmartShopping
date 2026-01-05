import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components';

const { width, height } = Dimensions.get('window');

const LandingScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <LinearGradient
        colors={[colors.primary, colors.gradientEnd]}
        style={styles.backgroundGradient}
      >
        <Animatable.View
          animation="fadeInDown"
          duration={1500}
          style={styles.logoContainer}
        >
          <View style={styles.imageWrapper}>
            <Animatable.Image
              animation="pulse"
              iterationCount="infinite"
              source={require('../assets/images/shopicon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Shoppe</Text>
          <Text style={styles.subtitle}>Beautiful eCommerce UI Kit for your online store</Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          delay={500}
          style={styles.bottomSection}
        >
          <Text style={styles.welcomeText}>Experience the future of shopping today.</Text>

          <Button
            title="Let's Get Started"
            onPress={() => navigation.navigate('Main')}
            variant="primary"
            size="lg"
            style={styles.getStartedButton}
          />

          <View style={styles.loginRow}>
            <Text style={styles.alreadyHaveText}>I already have an account</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.arrowButton}>
              <Animatable.Image
                source={require('../assets/images/arrow-front.png')}
                style={styles.arrowImage}
                resizeMode="contain"
                animation="bounce"
                iterationCount="infinite"
                duration={2000}
              />
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  imageWrapper: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: typography.fontSize['14xl'],
    fontWeight: 'bold' as const,
    color: colors.white,
    letterSpacing: -0.52,
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize['6xl'],
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.sm,
    fontWeight: '300' as const,
    fontFamily: typography.fontFamily.light,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  bottomSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.9,
    fontFamily: typography.fontFamily.light,
  },
  getStartedButton: {
    marginBottom: spacing.lg,
  },
  loginRow: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
    gap: 15,
  },
  alreadyHaveText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.light,
  },
  arrowButton: {
    width: 30,
    height: 30,
  },
  arrowImage: {
    width: '100%',
    height: '100%',
    tintColor: colors.white,
  },
});

export default LandingScreen;
