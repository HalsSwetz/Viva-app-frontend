import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Animated,
} from 'react-native';

const bulletsData = [
  '• Tailored event feed based on your favorites',
  '• Real-time alerts & local discoveries',
  '• One-tap checkout with Stripe',
];

export default function AppEducationScreen({ navigation }) {
  const animations = useRef(bulletsData.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      300,
      animations.map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/v-logo-1.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome to Viva</Text>

      <Text style={styles.subtitle}>
        The easiest way to follow and book live events you love.
      </Text>

      <View style={styles.bullets}>
        {bulletsData.map((text, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.bullet,
              {
                opacity: animations[index],
                transform: [
                  {
                    translateY: animations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {text}
          </Animated.Text>
        ))}
      </View>

      <View style={styles.button}>
        <Button
          title="Get Started →"
          onPress={() => navigation.navigate('Preferences')}
          color="#00bcd4"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Playfair',
    marginBottom: 20,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 65,
    fontFamily: 'Alike',
  },
  bullets: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 55,
  },
  bullet: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 22,
    fontFamily: 'Alike',
  },
  note: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Alike',
  },
  button: {
    width: '100%',
  },
});