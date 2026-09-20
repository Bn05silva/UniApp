import React, { useEffect, useState } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

import PerfilHeader from '../perfil/PerfilHeader';
import InformacoesAcademicas from '../perfil/InformacoesAcademicas';
import AlterarSenhaModal from '../perfil/AlterarSenhaModal';

import { useAuth } from '../contexto/AuthContext';

const STORAGE_KEY = '@uniapp_perfil';

const PERFIL_INICIAL = {
  nome: 'Richard Rodrigues',
  matricula: '202312084',
  email: 'richard.rodrigues@aluno.edu.br',
  curso: 'Engenharia de Software',
  periodo: '7º período',
  foto: null,
};

export default function PerfilScreen() {
  const [perfil, setPerfil] =
    useState(PERFIL_INICIAL);

  const [modalSenha, setModalSenha] =
    useState(false);

  const { trocarSenha } = useAuth();

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const dados =
        await AsyncStorage.getItem(
          STORAGE_KEY
        );

      if (dados) {
        setPerfil(
          JSON.parse(dados)
        );
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível carregar o perfil.'
      );
    }
  };


  const alterarFoto = async () => {
    try {
      const permissao =
        await ImagePicker
          .requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Autorize o acesso à galeria para alterar sua foto.'
        );

        return;
      }

      const resultado =
        await ImagePicker
          .launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

      if (resultado.canceled) {
        return;
      }

      const novoPerfil = {
        ...perfil,
        foto:
          resultado.assets[0].uri,
      };

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(novoPerfil)
      );

      setPerfil(novoPerfil);

    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível alterar a foto.'
      );
    }
  };


  const alterarSenha = async (
    senhaAtual,
    novaSenha
  ) => {
    const resultado =
      await trocarSenha(
        senhaAtual,
        novaSenha
      );

    if (resultado.ok) {
      Alert.alert(
        'Sucesso',
        'Senha alterada com sucesso.'
      );
    }

    return resultado;
  };


  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.conteudo
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <PerfilHeader
          perfil={perfil}
          onAlterarFoto={alterarFoto}
        />

        <InformacoesAcademicas
          perfil={perfil}
          onAlterarSenha={() =>
            setModalSenha(true)
          }
        />
      </ScrollView>

      <AlterarSenhaModal
        visible={modalSenha}
        onClose={() =>
          setModalSenha(false)
        }
        onSalvar={alterarSenha}
      />
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1f4',
  },

  conteudo: {
    paddingBottom: 25,
  },
});