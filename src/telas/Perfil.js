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
import EditarPerfilModal from '../perfil/EditarPerfilModal';

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
  const [perfil, setPerfil] = useState(PERFIL_INICIAL);
  const [modalEditar, setModalEditar] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const dados = await AsyncStorage.getItem(STORAGE_KEY);

      if (dados) {
        setPerfil(JSON.parse(dados));
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível carregar o perfil.'
      );
    }
  };

  const salvarPerfil = async (novoPerfil) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(novoPerfil)
      );

      setPerfil(novoPerfil);
      setModalEditar(false);

      Alert.alert(
        'Sucesso',
        'Perfil atualizado com sucesso!'
      );
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar o perfil.'
      );
    }
  };

  const alterarFoto = async () => {
    const permissao =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        'Permissão necessária',
        'Autorize o acesso à galeria para alterar sua foto.'
      );

      return;
    }

    const resultado =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (!resultado.canceled) {
      const novoPerfil = {
        ...perfil,
        foto: resultado.assets[0].uri,
      };

      await salvarPerfil(novoPerfil);
    }
  };

  const alterarSenha = () => {
    Alert.prompt(
      'Alterar senha',
      'Digite uma nova senha.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Alterar',
          onPress: (senha) => {
            if (!senha || senha.length < 6) {
              Alert.alert(
                'Senha inválida',
                'A senha deve possuir pelo menos 6 caracteres.'
              );

              return;
            }

            Alert.alert(
              'Sucesso',
              'Senha alterada para fins demonstrativos.'
            );
          },
        },
      ],
      'secure-text'
    );
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <PerfilHeader
          perfil={perfil}
          onAlterarFoto={alterarFoto}
        />

        <InformacoesAcademicas
          perfil={perfil}
          onEditar={() => setModalEditar(true)}
          onAlterarSenha={alterarSenha}
        />
      </ScrollView>

      <EditarPerfilModal
        visible={modalEditar}
        perfil={perfil}
        onClose={() => setModalEditar(false)}
        onSalvar={salvarPerfil}
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