import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

// Mesmo ponto utilizado na validação de presença.
const FACULDADE = {
  latitude: -22.40944,
  longitude: -43.66326,
};

export default function MapaScreen() {
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);

  useEffect(() => {
    obterLocalizacao();
  }, []);

  const obterLocalizacao = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'A localização é necessária para mostrar sua posição no mapa.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocalizacaoAtual(location.coords);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização atual.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: FACULDADE.latitude,
          longitude: FACULDADE.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={FACULDADE}
          title="Universidade de Vassouras"
          description="Campus Vassouras"
        />

        {localizacaoAtual && (
          <Marker
            coordinate={{
              latitude: localizacaoAtual.latitude,
              longitude: localizacaoAtual.longitude,
            }}
            title="Minha localização"
            description="Posição atual obtida pelo GPS"
            pinColor="blue"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  map: {
    flex: 1,
  },
});
