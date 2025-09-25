import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

import {typography} from '../theme/typography';
import { colors } from '../theme/color';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const SplashScreen = () => {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}>
      <Animatable.View
        animation="bounceIn"
        duration={1500}
        style={styles.logoContainer}>
        <FontAwesomeIcon icon={faStore} size={60} color={colors.white} />
        <Text style={styles.title}>Smart Shopping</Text>
        <Text style={styles.subtitle}>AI-Powered Assistant</Text>
      </Animatable.View>
      
      <Animatable.View
        animation="fadeInUp"
        delay={1000}
        style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
    marginTop: 8,
    opacity: 0.9,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    opacity: 0.8,
  },
});

export default SplashScreen;