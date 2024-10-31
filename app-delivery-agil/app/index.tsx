import React from 'react';
import {
  ActivityIndicator,
  View,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';

export default function Index() {
  return (
    <ImageBackground
      source={require('../assets/images/loading-bg.png')}
      style={styles.background}
    >
      <View>
        <Image
          source={require('../assets/images/entregadora.png')}
          style={styles.logo}
        />
        <ActivityIndicator size="large" color="#121212" style={styles.loader} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    borderRadius: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});
