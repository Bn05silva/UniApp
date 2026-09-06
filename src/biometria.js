
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Biometria({ onAutenticado }) {
  const handleAuthentication = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!compatible || !enrolled) {
        Alert.alert('Aviso do Sistema', `Hardware compatível: ${compatible ? 'Sim' : 'Não'}\nBiometria cadastrada: ${enrolled ? 'Sim' : 'Não'}`);
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para registrar presença',
        fallbackLabel: 'Usar senha',
      });

      if (result.success) {
        Alert.alert('Sucesso', 'Autenticação biométrica realizada com sucesso!');
        if (onAutenticado) onAutenticado();
      } else {
        Alert.alert('Falha', `Autenticação não concluída: ${result.error || 'Cancelado'}`);
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoBiometria} onPress={handleAuthentication}>
        <Text style={styles.textoBotao}>Autenticar por Biometria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginBottom: 15, 
    width: '100%' 
  },
  botaoBiometria: {
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