import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Biometria({ onAutenticado }) {
  const handleAuthentication = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!compatible || !enrolled) {
        Alert.alert('Erro', 'Nenhuma biometria ou senha cadastrada neste aparelho.');
        return;
      }

     
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se com sua face ou digital',
        fallbackLabel: 'Usar senha',   
        disableDeviceFallback: false,  
        cancelLabel: 'Cancelar',
      });

    if (result.success) {
        Alert.alert('Presença Registrada', 'Sua biometria foi confirmada com sucesso!');
        
        if (onAutenticado) onAutenticado();
      } else {
        Alert.alert('Falha', 'Autenticação não concluída.');
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoBiometria} onPress={handleAuthentication}>
        <Text style={styles.textoBotao}>Registrar Presença</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15, width: '100%' },
  botaoBiometria: { backgroundColor: '#430c0c', padding: 12, borderRadius: 8, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});