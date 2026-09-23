import React, {
  useState,
} from 'react';

import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useAuth,
} from '../contexto/AuthContext';


const TIPOS = [
  {
    id: 'aluno',
    rotulo: 'Aluno',
    campo: 'Matrícula',
  },
  {
    id: 'professor',
    rotulo: 'Professor',
    campo: 'Matrícula funcional',
  },
];


export default function LoginScreen() {
  const {
    entrar,
    consultarPrimeiroAcesso,
    concluirPrimeiroAcesso,
  } =
    useAuth();


  const [
    tipo,
    setTipo,
  ] =
    useState(
      'aluno'
    );


  const [
    modo,
    setModo,
  ] =
    useState(
      'login'
    );


  const [
    etapaPrimeiroAcesso,
    setEtapaPrimeiroAcesso,
  ] =
    useState(
      'identificacao'
    );


  const [
    identificador,
    setIdentificador,
  ] =
    useState(
      ''
    );


  const [
    senha,
    setSenha,
  ] =
    useState(
      ''
    );


  const [
    novaSenha,
    setNovaSenha,
  ] =
    useState(
      ''
    );


  const [
    confirmarSenha,
    setConfirmarSenha,
  ] =
    useState(
      ''
    );


  const [
    nomeCadastro,
    setNomeCadastro,
  ] =
    useState(
      ''
    );


  const [
    erro,
    setErro,
  ] =
    useState(
      ''
    );


  const [
    carregando,
    setCarregando,
  ] =
    useState(
      false
    );


  const tipoAtual =
    TIPOS.find(
      (item) =>
        item.id === tipo
    );


  const limparCampos =
    () => {

      setIdentificador(
        ''
      );

      setSenha(
        ''
      );

      setNovaSenha(
        ''
      );

      setConfirmarSenha(
        ''
      );

      setNomeCadastro(
        ''
      );

      setErro(
        ''
      );

      setEtapaPrimeiroAcesso(
        'identificacao'
      );
    };


  const trocarTipo =
    (
      novoTipo
    ) => {

      Keyboard.dismiss();

      setTipo(
        novoTipo
      );

      limparCampos();
    };


  const abrirPrimeiroAcesso =
    () => {

      Keyboard.dismiss();

      limparCampos();

      setModo(
        'primeiroAcesso'
      );
    };


  const voltarLogin =
    () => {

      Keyboard.dismiss();

      limparCampos();

      setModo(
        'login'
      );
    };


  const handleEntrar =
    async () => {

      if (
        carregando
      ) {
        return;
      }


      setErro(
        ''
      );

      setCarregando(
        true
      );


      const resultado =
        await entrar(
          tipo,
          identificador,
          senha
        );


      if (
        !resultado.ok
      ) {

        setErro(
          resultado.erro
        );

        setCarregando(
          false
        );
      }
    };


  const handleVerificarCadastro =
    async () => {

      if (
        carregando
      ) {
        return;
      }


      setErro(
        ''
      );

      setCarregando(
        true
      );


      const resultado =
        await consultarPrimeiroAcesso(
          tipo,
          identificador
        );


      if (
        !resultado.ok
      ) {

        setErro(
          resultado.erro
        );

        setCarregando(
          false
        );

        return;
      }


      setNomeCadastro(
        resultado.usuario.nome
      );


      setEtapaPrimeiroAcesso(
        'senha'
      );


      setCarregando(
        false
      );
    };


  const handleConcluirPrimeiroAcesso =
    async () => {

      if (
        carregando
      ) {
        return;
      }


      setErro(
        ''
      );

      setCarregando(
        true
      );


      const resultado =
        await concluirPrimeiroAcesso(
          tipo,
          identificador,
          novaSenha,
          confirmarSenha
        );


      if (
        !resultado.ok
      ) {

        setErro(
          resultado.erro
        );

        setCarregando(
          false
        );
      }
    };


  return (
    <KeyboardAvoidingView
      style={
        styles.container
      }

      behavior={
        Platform.OS ===
        'ios'
          ? 'padding'
          : undefined
      }
    >

      <ScrollView
        contentContainerStyle={
          styles.conteudo
        }

        keyboardShouldPersistTaps="handled"

        showsVerticalScrollIndicator={
          false
        }
      >

        <View
          style={
            styles.marca
          }
        >

          <Text
            style={
              styles.titulo
            }
          >
            UniClass
          </Text>

          <Text
            style={
              styles.subtitulo
            }
          >
            Universidade de Vassouras
          </Text>

        </View>


        <View
          style={
            styles.card
          }
        >

          <Text
            style={
              styles.tituloCard
            }
          >
            {
              modo ===
              'login'
                ? 'Acessar conta'
                : 'Primeiro acesso'
            }
          </Text>


          <Text
            style={
              styles.descricaoCard
            }
          >
            {
              modo ===
              'login'
                ? 'Entre com seus dados acadêmicos.'
                : etapaPrimeiroAcesso ===
                  'identificacao'
                  ? 'Informe sua matrícula para localizar seu cadastro institucional.'
                  : 'Cadastro localizado. Defina sua senha de acesso.'
            }
          </Text>


          <View
            style={
              styles.seletor
            }
          >

            {
              TIPOS.map(
                (
                  item
                ) => (

                  <TouchableOpacity
                    key={
                      item.id
                    }

                    style={[
                      styles.opcao,

                      tipo ===
                        item.id &&
                        styles.opcaoAtiva,
                    ]}

                    onPress={
                      () =>
                        trocarTipo(
                          item.id
                        )
                    }

                    disabled={
                      carregando
                    }
                  >

                    <Text
                      style={[
                        styles.textoOpcao,

                        tipo ===
                          item.id &&
                          styles.textoOpcaoAtivo,
                      ]}
                    >
                      {
                        item.rotulo
                      }
                    </Text>

                  </TouchableOpacity>

                )
              )
            }

          </View>


          {
            modo ===
            'login' && (
              <>

                <Text
                  style={
                    styles.label
                  }
                >
                  {
                    tipoAtual.campo
                  }
                </Text>


                <TextInput
                  key={
                    `login-${tipo}`
                  }

                  style={
                    styles.input
                  }

                  value={
                    identificador
                  }

                  onChangeText={
                    setIdentificador
                  }

                  placeholder={
                    tipo ===
                    'aluno'
                      ? 'Digite sua matrícula'
                      : 'Digite sua matrícula funcional'
                  }

                  keyboardType="number-pad"

                  autoCapitalize="none"

                  autoCorrect={
                    false
                  }

                  editable={
                    !carregando
                  }

                  returnKeyType="next"
                />


                <Text
                  style={
                    styles.label
                  }
                >
                  Senha
                </Text>


                <TextInput
                  style={
                    styles.input
                  }

                  value={
                    senha
                  }

                  onChangeText={
                    setSenha
                  }

                  placeholder="Digite sua senha"

                  secureTextEntry

                  autoCapitalize="none"

                  autoCorrect={
                    false
                  }

                  editable={
                    !carregando
                  }

                  returnKeyType="done"

                  onSubmitEditing={
                    handleEntrar
                  }
                />


                {
                  erro !==
                  '' && (

                    <Text
                      style={
                        styles.erro
                      }
                    >
                      {
                        erro
                      }
                    </Text>

                  )
                }


                <TouchableOpacity
                  style={[
                    styles.botao,

                    carregando &&
                      styles.botaoDesabilitado,
                  ]}

                  onPress={
                    handleEntrar
                  }

                  disabled={
                    carregando
                  }
                >

                  {
                    carregando
                      ? (

                        <ActivityIndicator
                          color="#fff"
                        />

                      )
                      : (

                        <Text
                          style={
                            styles.textoBotao
                          }
                        >
                          Entrar
                        </Text>

                      )
                  }

                </TouchableOpacity>


                <TouchableOpacity
                  style={
                    styles.botaoPrimeiroAcesso
                  }

                  onPress={
                    abrirPrimeiroAcesso
                  }

                  disabled={
                    carregando
                  }
                >

                  <Text
                    style={
                      styles.textoPrimeiroAcesso
                    }
                  >
                    Primeiro acesso
                  </Text>

                </TouchableOpacity>


                <Text
                  style={
                    styles.ajuda
                  }
                >
                  Aluno: 202312084 | Senha: 123456
                  {'\n'}
                  Professor: 20260001 | Senha: 123456
                </Text>

              </>
            )
          }


          {
            modo ===
              'primeiroAcesso' &&
            etapaPrimeiroAcesso ===
              'identificacao' && (
              <>

                <Text
                  style={
                    styles.label
                  }
                >
                  {
                    tipoAtual.campo
                  }
                </Text>


                <TextInput
                  key={
                    `primeiro-${tipo}`
                  }

                  style={
                    styles.input
                  }

                  value={
                    identificador
                  }

                  onChangeText={
                    setIdentificador
                  }

                  placeholder={
                    tipo ===
                    'aluno'
                      ? 'Digite sua matrícula'
                      : 'Digite sua matrícula funcional'
                  }

                  keyboardType="number-pad"

                  autoCapitalize="none"

                  autoCorrect={
                    false
                  }

                  editable={
                    !carregando
                  }

                  returnKeyType="done"

                  onSubmitEditing={
                    handleVerificarCadastro
                  }
                />


                {
                  erro !==
                  '' && (

                    <Text
                      style={
                        styles.erro
                      }
                    >
                      {
                        erro
                      }
                    </Text>

                  )
                }


                <TouchableOpacity
                  style={[
                    styles.botao,

                    carregando &&
                      styles.botaoDesabilitado,
                  ]}

                  onPress={
                    handleVerificarCadastro
                  }

                  disabled={
                    carregando
                  }
                >

                  {
                    carregando
                      ? (

                        <ActivityIndicator
                          color="#fff"
                        />

                      )
                      : (

                        <Text
                          style={
                            styles.textoBotao
                          }
                        >
                          Verificar matrícula
                        </Text>

                      )
                  }

                </TouchableOpacity>


                <View
                  style={
                    styles.caixaTeste
                  }
                >

                  <Text
                    style={
                      styles.tituloTeste
                    }
                  >
                    Dados para demonstrar
                  </Text>

                  <Text
                    style={
                      styles.textoTeste
                    }
                  >
                    Aluno: 202312096
                  </Text>

                  <Text
                    style={
                      styles.textoTeste
                    }
                  >
                    Professor: 20260005
                  </Text>

                </View>


                <TouchableOpacity
                  style={
                    styles.botaoVoltar
                  }

                  onPress={
                    voltarLogin
                  }

                  disabled={
                    carregando
                  }
                >

                  <Text
                    style={
                      styles.textoVoltar
                    }
                  >
                    Voltar para o login
                  </Text>

                </TouchableOpacity>

              </>
            )
          }


          {
            modo ===
              'primeiroAcesso' &&
            etapaPrimeiroAcesso ===
              'senha' && (
              <>

                <View
                  style={
                    styles.cadastroEncontrado
                  }
                >

                  <Text
                    style={
                      styles.cadastroTitulo
                    }
                  >
                    Cadastro encontrado
                  </Text>

                  <Text
                    style={
                      styles.cadastroNome
                    }
                  >
                    {
                      nomeCadastro
                    }
                  </Text>

                  <Text
                    style={
                      styles.cadastroMatricula
                    }
                  >
                    {
                      tipoAtual.campo
                    }: {
                      identificador
                    }
                  </Text>

                </View>


                <Text
                  style={
                    styles.label
                  }
                >
                  Criar senha
                </Text>


                <TextInput
                  style={
                    styles.input
                  }

                  value={
                    novaSenha
                  }

                  onChangeText={
                    setNovaSenha
                  }

                  placeholder="Mínimo de 6 caracteres"

                  secureTextEntry

                  autoCapitalize="none"

                  autoCorrect={
                    false
                  }

                  editable={
                    !carregando
                  }

                  returnKeyType="next"
                />


                <Text
                  style={
                    styles.label
                  }
                >
                  Confirmar senha
                </Text>


                <TextInput
                  style={
                    styles.input
                  }

                  value={
                    confirmarSenha
                  }

                  onChangeText={
                    setConfirmarSenha
                  }

                  placeholder="Digite novamente a senha"

                  secureTextEntry

                  autoCapitalize="none"

                  autoCorrect={
                    false
                  }

                  editable={
                    !carregando
                  }

                  returnKeyType="done"

                  onSubmitEditing={
                    handleConcluirPrimeiroAcesso
                  }
                />


                {
                  erro !==
                  '' && (

                    <Text
                      style={
                        styles.erro
                      }
                    >
                      {
                        erro
                      }
                    </Text>

                  )
                }


                <TouchableOpacity
                  style={[
                    styles.botao,

                    carregando &&
                      styles.botaoDesabilitado,
                  ]}

                  onPress={
                    handleConcluirPrimeiroAcesso
                  }

                  disabled={
                    carregando
                  }
                >

                  {
                    carregando
                      ? (

                        <ActivityIndicator
                          color="#fff"
                        />

                      )
                      : (

                        <Text
                          style={
                            styles.textoBotao
                          }
                        >
                          Ativar acesso
                        </Text>

                      )
                  }

                </TouchableOpacity>


                <TouchableOpacity
                  style={
                    styles.botaoVoltar
                  }

                  onPress={
                    () => {

                      setEtapaPrimeiroAcesso(
                        'identificacao'
                      );

                      setNovaSenha(
                        ''
                      );

                      setConfirmarSenha(
                        ''
                      );

                      setNomeCadastro(
                        ''
                      );

                      setErro(
                        ''
                      );
                    }
                  }

                  disabled={
                    carregando
                  }
                >

                  <Text
                    style={
                      styles.textoVoltar
                    }
                  >
                    Usar outra matrícula
                  </Text>

                </TouchableOpacity>

              </>
            )
          }

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}


const styles =
  StyleSheet.create({

    container: {
      flex: 1,

      backgroundColor:
        '#edf1f4',
    },


    conteudo: {
      flexGrow: 1,

      justifyContent:
        'center',

      padding: 24,
    },


    marca: {
      alignItems:
        'center',

      marginBottom:
        28,
    },


    titulo: {
      fontSize:
        34,

      fontWeight:
        'bold',

      color:
        '#a2181c',

      letterSpacing:
        1,
    },


    subtitulo: {
      fontSize:
        14,

      color:
        '#777',

      marginTop:
        4,
    },


    card: {
      backgroundColor:
        '#fff',

      borderRadius:
        14,

      padding:
        20,

      elevation:
        2,

      shadowColor:
        '#000',

      shadowOpacity:
        0.08,

      shadowRadius:
        5,

      shadowOffset: {
        width: 0,
        height: 2,
      },
    },


    tituloCard: {
      fontSize:
        20,

      fontWeight:
        'bold',

      color:
        '#222',

      textAlign:
        'center',
    },


    descricaoCard: {
      fontSize:
        13,

      color:
        '#777',

      textAlign:
        'center',

      lineHeight:
        19,

      marginTop:
        6,

      marginBottom:
        18,
    },


    seletor: {
      flexDirection:
        'row',

      backgroundColor:
        '#f0f0f0',

      borderRadius:
        10,

      padding:
        3,

      marginBottom:
        20,
    },


    opcao: {
      flex: 1,

      paddingVertical:
        10,

      borderRadius:
        8,

      alignItems:
        'center',
    },


    opcaoAtiva: {
      backgroundColor:
        '#a2181c',
    },


    textoOpcao: {
      color:
        '#555',

      fontWeight:
        '600',

      fontSize:
        14,
    },


    textoOpcaoAtivo: {
      color:
        '#fff',

      fontWeight:
        'bold',
    },


    label: {
      fontSize:
        13,

      color:
        '#555',

      fontWeight:
        '600',

      marginBottom:
        5,
    },


    input: {
      backgroundColor:
        '#f5f5f5',

      borderRadius:
        9,

      paddingHorizontal:
        12,

      paddingVertical:
        11,

      fontSize:
        15,

      marginBottom:
        15,

      borderWidth:
        1,

      borderColor:
        '#e0e0e0',

      color:
        '#222',
    },


    erro: {
      color:
        '#c0392b',

      fontSize:
        13,

      fontWeight:
        '600',

      marginBottom:
        12,

      lineHeight:
        18,
    },


    botao: {
      backgroundColor:
        '#a2181c',

      borderRadius:
        9,

      padding:
        14,

      alignItems:
        'center',
    },


    botaoDesabilitado: {
      opacity:
        0.7,
    },


    textoBotao: {
      color:
        '#fff',

      fontWeight:
        'bold',

      fontSize:
        15,
    },


    botaoPrimeiroAcesso: {
      marginTop:
        15,

      paddingVertical:
        8,

      alignItems:
        'center',
    },


    textoPrimeiroAcesso: {
      color:
        '#a2181c',

      fontWeight:
        'bold',

      fontSize:
        14,
    },


    ajuda: {
      fontSize:
        12,

      color:
        '#888',

      textAlign:
        'center',

      marginTop:
        10,

      lineHeight:
        17,
    },


    caixaTeste: {
      backgroundColor:
        '#f7f7f7',

      borderRadius:
        9,

      padding:
        12,

      marginTop:
        15,

      borderWidth:
        1,

      borderColor:
        '#eeeeee',
    },


    tituloTeste: {
      fontSize:
        12,

      color:
        '#666',

      fontWeight:
        'bold',

      textAlign:
        'center',

      marginBottom:
        5,
    },


    textoTeste: {
      fontSize:
        12,

      color:
        '#888',

      textAlign:
        'center',

      lineHeight:
        18,
    },


    botaoVoltar: {
      paddingVertical:
        12,

      alignItems:
        'center',

      marginTop:
        5,
    },


    textoVoltar: {
      color:
        '#666',

      fontSize:
        13,

      fontWeight:
        '600',
    },


    cadastroEncontrado: {
      backgroundColor:
        '#f7f7f7',

      borderRadius:
        10,

      padding:
        14,

      marginBottom:
        18,

      borderWidth:
        1,

      borderColor:
        '#e5e5e5',
    },


    cadastroTitulo: {
      fontSize:
        12,

      fontWeight:
        'bold',

      color:
        '#a2181c',

      marginBottom:
        5,
    },


    cadastroNome: {
      fontSize:
        16,

      fontWeight:
        'bold',

      color:
        '#222',
    },


    cadastroMatricula: {
      fontSize:
        12,

      color:
        '#777',

      marginTop:
        4,
    },

  });