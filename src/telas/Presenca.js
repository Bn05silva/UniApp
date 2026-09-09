import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AddItem from '../componentes/add';
import ListItem from '../componentes/list';
import Biometria from '../biometria/biometria';
import Localizacao from '../gps/gps';
import LeitorCamera from '../camera/camera';

// Coordenadas do Campus Vassouras
const FACULDADE_LAT = -22.40944;
const FACULDADE_LONG = -43.66326;

// Valor oficial 150
const RAIO_PERMITIDO_METROS = 50000;

const STORAGE_KEY = '@uniapp_presencas';

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371e3;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function PresencaScreen() {
  const [listItems, setListItems] = useState([]);
  const [autenticado, setAutenticado] = useState(false);
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);

  useEffect(() => {
    loadStoredItems();
  }, []);

  const loadStoredItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored !== null) {
        setListItems(JSON.parse(stored));
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível carregar o histórico de presenças.'
      );
    }
  };

  const saveToAsyncStorage = async (newList) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(newList)
      );

      setListItems(newList);

      return true;
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar o registro de presença.'
      );

      return false;
    }
  };

  const addItem = async (taskText) => {
    if (!autenticado) {
      Alert.alert(
        'Atenção',
        'Você precisa se autenticar por biometria.'
      );

      return false;
    }

    if (!localizacaoAtual) {
      Alert.alert(
        'Atenção',
        'Você precisa capturar sua localização.'
      );

      return false;
    }

    if (!qrCodeData) {
      Alert.alert(
        'Atenção',
        'Você precisa escanear o QR Code da aula.'
      );

      return false;
    }

    if (!taskText.trim()) {
      Alert.alert(
        'Atenção',
        'Digite seu nome ou matrícula.'
      );

      return false;
    }

    const distancia = calcularDistancia(
      localizacaoAtual.latitude,
      localizacaoAtual.longitude,
      FACULDADE_LAT,
      FACULDADE_LONG
    );

    if (distancia > RAIO_PERMITIDO_METROS) {
      Alert.alert(
        'Fora do Campus',
        `Você está a ${Math.round(
          distancia
        )} metros do ponto de validação. Presença negada!`
      );

      return false;
    }

    const agora = new Date();

    const dataAtual = agora.toLocaleDateString('pt-BR');

    const horaAtual = agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const novoRegistro = {
      id: Date.now().toString(),

      aluno: taskText.trim(),

      aula: 'QR Code validado',

      status: 'Presença confirmada',

      distancia: Math.round(distancia),

      data: dataAtual,

      hora: horaAtual,
    };

    const salvo = await saveToAsyncStorage([
      novoRegistro,
      ...listItems,
    ]);

    if (!salvo) {
      return false;
    }

    // Reinicia as validações após registrar uma presença
    setAutenticado(false);
    setLocalizacaoAtual(null);
    setQrCodeData(null);

    Alert.alert(
      'Sucesso',
      'Presença validada e salva no dispositivo!'
    );

    return true;
  };

  const deleteItem = async (id) => {
    const novaLista = listItems.filter(
      (item) => item.id !== id
    );

    await saveToAsyncStorage(novaLista);
  };

  return (
    <View style={styles.container}>
      <Biometria
        onAutenticado={() => setAutenticado(true)}
      />

      <Localizacao
        onLocalizacaoObtida={(coords) =>
          setLocalizacaoAtual(coords)
        }
      />

      <LeitorCamera
        onScanned={(data) => setQrCodeData(data)}
      />

      <AddItem addItem={addItem} />

      <ListItem
        listItems={listItems}
        deleteItem={deleteItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1f4',
    padding: 20,
  },
});