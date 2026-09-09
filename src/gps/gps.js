import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';

export default function Localizacao({ onLocalizacaoObtida }) {
  const [statusGPS, setStatusGPS] = useState('Verificar Localização');

  const obterLocalizacao = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permissão de acesso à localização é necessária.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setStatusGPS(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
      Alert.alert('Localização obtida', `Latitude: ${latitude}\nLongitude: ${longitude}`);
      
      if (onLocalizacaoObtida) {
        onLocalizacaoObtida({ latitude, longitude });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização atual.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoGPS} onPress={obterLocalizacao}>
        <Text style={styles.textoBotao}>{statusGPS}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginBottom: 15, 
    width: '100%' 
  },
  botaoGPS: {
    backgroundColor: '#430c0c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});