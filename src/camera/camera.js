import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';

export default function LeitorCamera({ onScanned }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [ativo, Ativo] = useState(false);
  

  const bloqueioLeitura = useRef(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (bloqueioLeitura.current) return;
    bloqueioLeitura.current = true;
    setScanned(true);
    Ativo(false); 
    
    Alert.alert('QR Code Lido!', `Conteúdo: ${data}`);
    
    if (onScanned) {
      onScanned(data);
    }
  };

  if (hasPermission === null) {
    return <View><Text>Solicitando permissão de câmera...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>Sem acesso à câmera</Text></View>;
  }

  return (
    <View style={styles.container}>
      {!ativo ? (
        <TouchableOpacity 
          style={styles.botaoCamera} 
          onPress={() => { 
            bloqueioLeitura.current = false;
            setScanned(false); 
            Ativo(true); 
          }}>
          <Text style={styles.textoBotao}>Escanear QR Code da Aula</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            style={{ flex: 1, width: '100%' }}
          />
          <TouchableOpacity style={styles.botaoFechar} onPress={() => Ativo(false)}>
            <Text style={styles.textoBotaoFechar}>Fechar Câmera</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15, width: '100%' },
  botaoCamera: { backgroundColor: '#430c0c', padding: 12, borderRadius: 8, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  cameraContainer: { width: '100%', height: 350, borderRadius: 8, overflow: 'hidden', backgroundColor: '#000' },
  botaoFechar: { position: 'absolute', bottom: 15, alignSelf: 'center', backgroundColor: '#c0392b', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 5, zIndex: 10 },
  textoBotaoFechar: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});