import React, {
  useCallback,
  useState,
} from 'react';

import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import SaudacaoAluno from '../inicio/SaudacaoAluno';
import ProximaAula from '../inicio/ProximaAula';
import ResumoPresenca from '../inicio/ResumoPresenca';
import AcessoRapido from '../inicio/AcessoRapido';

const PERFIL_KEY = '@uniapp_perfil';
const PRESENCAS_KEY = '@uniapp_presencas';

const PERFIL_PADRAO = {
  nome: 'Aluno',
  curso: 'Engenharia de Software',
  periodo: '7º período',
};

export default function InicioScreen({
  navigation,
}) {
  const [perfil, setPerfil] =
    useState(PERFIL_PADRAO);

  const [presencas, setPresencas] =
    useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    try {
      const dadosPerfil =
        await AsyncStorage.getItem(PERFIL_KEY);

      const dadosPresencas =
        await AsyncStorage.getItem(PRESENCAS_KEY);

      if (dadosPerfil) {
        setPerfil(JSON.parse(dadosPerfil));
      }

      if (dadosPresencas) {
        setPresencas(JSON.parse(dadosPresencas));
      }
    } catch (error) {
      console.log(
        'Erro ao carregar área do aluno.'
      );
    }
  };

  const ultimaPresenca =
    presencas.length > 0
      ? presencas[0]
      : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      <SaudacaoAluno perfil={perfil} />

      <ProximaAula />

      <ResumoPresenca
        quantidade={presencas.length}
        ultimaPresenca={ultimaPresenca}
      />

      <AcessoRapido
        navigation={navigation}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1f4',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 35,
  },
});