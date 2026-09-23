import React, {
  createContext,
  useContext,
  useState,
} from 'react';

import AsyncStorage
  from '@react-native-async-storage/async-storage';

import * as LocalAuthentication
  from 'expo-local-authentication';

import {
  autenticar,
  alterarSenhaUsuario,
  verificarPrimeiroAcesso,
  definirSenhaPrimeiroAcesso,
} from '../dados/BaseDados';


const PERFIL_KEY =
  '@uniapp_perfil';


const AuthContext =
  createContext(
    null
  );


async function validarBiometria() {
  try {
    const compativel =
      await LocalAuthentication
        .hasHardwareAsync();


    const cadastrada =
      await LocalAuthentication
        .isEnrolledAsync();


    if (
      !compativel ||
      !cadastrada
    ) {
      return {
        ok: false,

        erro:
          'Nenhuma biometria ou senha cadastrada neste aparelho.',
      };
    }


    const resultado =
      await LocalAuthentication
        .authenticateAsync({
          promptMessage:
            'Confirme sua identidade para continuar',

          fallbackLabel:
            'Usar senha do aparelho',

          cancelLabel:
            'Cancelar',

          disableDeviceFallback:
            false,
        });


    if (
      !resultado.success
    ) {
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


async function sincronizarPerfilAluno(
  aluno
) {
  try {
    const salvo =
      await AsyncStorage
        .getItem(
          PERFIL_KEY
        );


    const atual =
      salvo
        ? JSON.parse(
            salvo
          )
        : null;


    if (
      atual &&
      atual.matricula ===
        aluno.matricula
    ) {
      return;
    }


    await AsyncStorage
      .setItem(
        PERFIL_KEY,

        JSON.stringify({
          nome:
            aluno.nome,

          matricula:
            aluno.matricula,

          email:
            aluno.email,

          curso:
            aluno.curso,

          periodo:
            aluno.periodo,

          foto:
            null,
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
  ] =
    useState(
      null
    );


  const entrar =
    async (
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


      const resultado =
        await autenticar(
          tipo,
          identificador,
          senha
        );


      if (
        !resultado.ok
      ) {
        return resultado;
      }


      const biometria =
        await validarBiometria();


      if (
        !biometria.ok
      ) {
        return biometria;
      }


      const encontrado =
        resultado.usuario;


      if (
        tipo ===
        'aluno'
      ) {
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


  const consultarPrimeiroAcesso =
    async (
      tipo,
      identificador
    ) => {

      if (
        !identificador.trim()
      ) {
        return {
          ok: false,

          erro:
            tipo ===
            'professor'
              ? 'Informe a matrícula funcional.'
              : 'Informe a matrícula.',
        };
      }


      const resultado =
        await verificarPrimeiroAcesso(
          tipo,
          identificador
        );


      return resultado;
    };


  const concluirPrimeiroAcesso =
    async (
      tipo,
      identificador,
      novaSenha,
      confirmarSenha
    ) => {

      if (
        !identificador.trim()
      ) {
        return {
          ok: false,

          erro:
            tipo ===
            'professor'
              ? 'Informe a matrícula funcional.'
              : 'Informe a matrícula.',
        };
      }


      if (
        !novaSenha ||
        !confirmarSenha
      ) {
        return {
          ok: false,

          erro:
            'Preencha e confirme a nova senha.',
        };
      }


      if (
        novaSenha.length <
        6
      ) {
        return {
          ok: false,

          erro:
            'A senha deve possuir pelo menos 6 caracteres.',
        };
      }


      if (
        novaSenha !==
        confirmarSenha
      ) {
        return {
          ok: false,

          erro:
            'As senhas informadas são diferentes.',
        };
      }


      const verificacao =
        await verificarPrimeiroAcesso(
          tipo,
          identificador
        );


      if (
        !verificacao.ok
      ) {
        return verificacao;
      }


      const biometria =
        await validarBiometria();


      if (
        !biometria.ok
      ) {
        return biometria;
      }


      const resultado =
        await definirSenhaPrimeiroAcesso(
          tipo,
          identificador,
          novaSenha
        );


      if (
        !resultado.ok
      ) {
        return resultado;
      }


      const encontrado =
        resultado.usuario;


      if (
        tipo ===
        'aluno'
      ) {
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


  const sair =
    () => {

      setUsuario(
        null
      );
    };


  const trocarSenha =
    async (
      senhaAtual,
      novaSenha
    ) => {

      if (
        !usuario
      ) {
        return {
          ok: false,

          erro:
            'Nenhum usuário está logado.',
        };
      }


      const identificador =
        usuario.tipo ===
        'professor'
          ? usuario
              .identificador
          : usuario
              .matricula;


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
        consultarPrimeiroAcesso,
        concluirPrimeiroAcesso,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(
    AuthContext
  );
}