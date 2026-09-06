import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import AddItem from '../add';
import ListItem from '../list';
import Biometria from '../biometria';
import Localizacao from '../gps';
import LeitorCamera from '../camera';

// Coordenadas da Universidade 
const FACULDADE_LAT = -22.4093;
const FACULDADE_LONG = -43.6641;
const RAIO_PERMITIDO_METROS = 150; 


function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371e3; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
}

export default function PresencaScreen() {
  const [listItems, setListItems] = useState([]);
  const [autenticado, setAutenticado] = useState(false);
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);
  const STORAGE_KEY = '@unipresenca_todo_items';

  useEffect(() => {
    loadStoredItems();
  }, []);

  const loadStoredItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) setListItems(JSON.parse(stored));
    } catch (error) {}
  };

  const saveToAsyncStorage = async (newList) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      setListItems(newList);
    } catch (error) {}
  };

  const addItem = (taskText) => {
    if (!autenticado) return Alert.alert('Atenção', 'Você precisa se autenticar por biometria.');
    if (!localizacaoAtual) return Alert.alert('Atenção', 'Você precisa capturar sua localização.');
    if (!qrCodeData) return Alert.alert('Atenção', 'Você precisa escanear o QR Code.');
    if (!taskText.trim()) return Alert.alert('Atenção', 'Digite uma identificação válida.');


    const distancia = calcularDistancia(
      localizacaoAtual.latitude, localizacaoAtual.longitude, 
      FACULDADE_LAT, FACULDADE_LONG
    );

    if (distancia > RAIO_PERMITIDO_METROS) {
      Alert.alert(
        'Fora do Campus ❌', 
        `Você está a ${Math.round(distancia)} metros da faculdade. Presença negada!`
      );
      return;
    }

    const dataAtual = new Date().toLocaleDateString() + ' às ' + new Date().toLocaleTimeString();
    const novoRegistro = {
      id: Date.now().toString(),
      task: `${taskText} | Aula: ${qrCodeData} | [Ok: ${Math.round(distancia)}m] (${dataAtual})`
    };

    saveToAsyncStorage([novoRegistro, ...listItems]);
    setQrCodeData(null);
    Alert.alert('Sucesso ✅', 'Presença validada no campus!');
  };

  const deleteItem = (id) => {
    saveToAsyncStorage(listItems.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Biometria onAutenticado={() => setAutenticado(true)} />
      <Localizacao onLocalizacaoObtida={(coords) => setLocalizacaoAtual(coords)} />
      <LeitorCamera onScanned={(data) => setQrCodeData(data)} />
      <AddItem addItem={addItem} />
      <ListItem listItems={listItems} deleteItem={deleteItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#edf1f4', padding: 20 },
});