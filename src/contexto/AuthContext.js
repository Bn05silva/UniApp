import React, {
  createContext,
  useContext,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

import {
  autenticar,
  alterarSenhaUsuario,
} from '../dados/BaseDados';

const PERFIL_KEY = '@uniapp_perfil';

const AuthContext = createContext(null);


async function validarBiometria() {
  try {
    const compativel =
      await LocalAuthentication.hasHardwareAsync();

    const cadastrada =
      await LocalAuthentication.isEnrolledAsync();

    if (!compativel || !cadastrada) {
      return {
        ok: false,
        erro:
          'Nenhuma biometria ou senha cadastrada neste aparelho.',
      };
    }

    const resultado =
      await LocalAuthentication.authenticateAsync({
        promptMessage:
          'Confirme sua identidade para entrar',

        fallbackLabel:
          'Usar senha do aparelho',

        cancelLabel:
          'Cancelar',

        disableDeviceFallback: false,
      });

    if (!resultado.success) {
      return {
        ok: false,
        erro:
          'Biometria não confirmada.',
      };
    }

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      erro:
        'Não foi possível validar a biometria.',
    };
  }
}


async function sincronizarPerfilAluno(aluno) {
  try {
    const salvo =
      await AsyncStorage.getItem(PERFIL_KEY);

    const atual =
      salvo
        ? JSON.parse(salvo)
        : null;
    if (
      atual &&
      atual.matricula === aluno.matricula
    ) {
      return;
    }

    await AsyncStorage.setItem(
      PERFIL_KEY,
      JSON.stringify({
        nome: aluno.nome,
        matricula: aluno.matricula,
        email: aluno.email,
        curso: aluno.curso,
        periodo: aluno.periodo,
        foto: null,
      })
    );
  } catch (error) {
    console.log(
      'Erro ao sincronizar o perfil do aluno.'
    );
  }
}

export function AuthProvider({
  children,
}) {
  const [
    usuario,
    setUsuario,
  ] = useState(null);


  const entrar = async (
    tipo,
    identificador,
    senha
  ) => {
    if (
      !identificador.trim() ||
      !senha
    ) {
      return {
        ok: false,
        erro:
          'Preencha o login e a senha.',
      };
    }

    const encontrado =
      await autenticar(
        tipo,
        identificador,
        senha
      );

    if (!encontrado) {
      return {
        ok: false,
        erro:
          'Login ou senha incorretos.',
      };
    }

    const biometria =
      await validarBiometria();

    if (!biometria.ok) {
      return biometria;
    }

    if (tipo === 'aluno') {
      await sincronizarPerfilAluno(
        encontrado
      );
    }

    setUsuario({
      tipo,
      ...encontrado,
    });

    return {
      ok: true,
    };
  };


  const sair = () => {
    setUsuario(null);
  };

  const trocarSenha = async (
    senhaAtual,
    novaSenha
  ) => {
    if (!usuario) {
      return {
        ok: false,
        erro:
          'Nenhum usuário está logado.',
      };
    }

    const identificador =
      usuario.tipo === 'professor'
        ? usuario.identificador
        : usuario.matricula;

    const resultado =
      await alterarSenhaUsuario(
        usuario.tipo,
        identificador,
        senhaAtual,
        novaSenha
      );

    return resultado;
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        entrar,
        sair,
        trocarSenha,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}