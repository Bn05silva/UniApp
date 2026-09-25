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
  Ionicons,
} from '@expo/vector-icons';

import {
  useFonts,
  Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';

import {
  useAuth,
} from '../contexto/AuthContext';


const TIPOS = [
  {
    id: 'aluno',
    rotulo: 'Aluno',
    campo: 'Matrícula',
    icone: 'school-outline',
  },
  {
    id: 'professor',
    rotulo: 'Professor',
    campo: 'Matrícula funcional',
    icone: 'briefcase-outline',
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
    fontsLoaded,
  ] =
    useFonts({
      Montserrat_800ExtraBold,
    });


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


  if (
    !fontsLoaded
  ) {
    return (
      <View
        style={
          styles.carregandoFonte
        }
      >
        <ActivityIndicator
          size="large"
          color="#a2181c"
        />
      </View>
    );
  }


  return (
    <KeyboardAvoidingView
      style={
        styles.container
      }

      behavior={
        Platform.OS ===
        'ios'
          ? 'padding'
          : 'height'
      }
    >

      <ScrollView
        contentContainerStyle={
          styles.conteudo
        }

        keyboardShouldPersistTaps="handled"

        keyboardDismissMode={
          Platform.OS ===
          'ios'
            ? 'interactive'
            : 'on-drag'
        }

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


          <Text
            style={
              styles.descricaoMarca
            }
          >
            Presença acadêmica de forma simples e segura
          </Text>

        </View>


        <View
          style={
            styles.card
          }
        >

          <View
            style={
              styles.cabecalhoCard
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

          </View>


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

                    <Ionicons
                      name={
                        item.icone
                      }

                      size={
                        17
                      }

                      color={
                        tipo ===
                        item.id
                          ? '#ffffff'
                          : '#666666'
                      }
                    />


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


                <View
                  style={
                    styles.inputContainer
                  }
                >

                  <Ionicons
                    name="person-outline"
                    size={
                      19
                    }
                    color="#8b8b8b"
                  />


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

                    placeholderTextColor="#aaaaaa"

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

                </View>


                <Text
                  style={
                    styles.label
                  }
                >
                  Senha
                </Text>


                <View
                  style={
                    styles.inputContainer
                  }
                >

                  <Ionicons
                    name="lock-closed-outline"
                    size={
                      19
                    }
                    color="#8b8b8b"
                  />


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

                    placeholderTextColor="#aaaaaa"

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

                </View>


                {
                  erro !==
                  '' && (

                    <View
                      style={
                        styles.caixaErro
                      }
                    >

                      <Ionicons
                        name="alert-circle-outline"
                        size={
                          18
                        }
                        color="#b31d22"
                      />


                      <Text
                        style={
                          styles.erro
                        }
                      >
                        {
                          erro
                        }
                      </Text>

                    </View>

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
                          color="#ffffff"
                        />

                      )
                      : (

                        <View
                          style={
                            styles.conteudoBotao
                          }
                        >

                          <Text
                            style={
                              styles.textoBotao
                            }
                          >
                            Entrar
                          </Text>


                          <Ionicons
                            name="arrow-forward"
                            size={
                              18
                            }
                            color="#ffffff"
                          />

                        </View>

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

                  <Ionicons
                    name="key-outline"
                    size={
                      17
                    }
                    color="#a2181c"
                  />


                  <Text
                    style={
                      styles.textoPrimeiroAcesso
                    }
                  >
                    Primeiro acesso
                  </Text>

                </TouchableOpacity>


                <View
                  style={
                    styles.caixaTeste
                  }
                >

                  <View
                    style={
                      styles.tituloTesteContainer
                    }
                  >

                    <Ionicons
                      name="information-circle-outline"
                      size={
                        16
                      }
                      color="#777777"
                    />


                    <Text
                      style={
                        styles.tituloTeste
                      }
                    >
                      Dados para demonstrar
                    </Text>

                  </View>


                  <Text
                    style={
                      styles.textoTeste
                    }
                  >
                    Aluno: 202312084 | Senha: 123456
                  </Text>


                  <Text
                    style={
                      styles.textoTeste
                    }
                  >
                    Professor: 20260001 | Senha: 123456
                  </Text>

                </View>

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


                <View
                  style={
                    styles.inputContainer
                  }
                >

                  <Ionicons
                    name="person-outline"
                    size={
                      19
                    }
                    color="#8b8b8b"
                  />


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

                    placeholderTextColor="#aaaaaa"

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

                </View>


                {
                  erro !==
                  '' && (

                    <View
                      style={
                        styles.caixaErro
                      }
                    >

                      <Ionicons
                        name="alert-circle-outline"
                        size={
                          18
                        }
                        color="#b31d22"
                      />


                      <Text
                        style={
                          styles.erro
                        }
                      >
                        {
                          erro
                        }
                      </Text>

                    </View>

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
                          color="#ffffff"
                        />

                      )
                      : (

                        <View
                          style={
                            styles.conteudoBotao
                          }
                        >

                          <Text
                            style={
                              styles.textoBotao
                            }
                          >
                            Verificar matrícula
                          </Text>


                          <Ionicons
                            name="search-outline"
                            size={
                              18
                            }
                            color="#ffffff"
                          />

                        </View>

                      )
                  }

                </TouchableOpacity>


                <View
                  style={
                    styles.caixaTeste
                  }
                >

                  <View
                    style={
                      styles.tituloTesteContainer
                    }
                  >

                    <Ionicons
                      name="information-circle-outline"
                      size={
                        16
                      }
                      color="#777777"
                    />


                    <Text
                      style={
                        styles.tituloTeste
                      }
                    >
                      Dados para demonstrar
                    </Text>

                  </View>


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

                  <Ionicons
                    name="arrow-back-outline"
                    size={
                      16
                    }
                    color="#a2181c"
                  />


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

                  <View
                    style={
                      styles.cadastroIcone
                    }
                  >

                    <Ionicons
                      name="checkmark"
                      size={
                        20
                      }
                      color="#a2181c"
                    />

                  </View>


                  <View
                    style={
                      styles.cadastroConteudo
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

                </View>


                <Text
                  style={
                    styles.label
                  }
                >
                  Criar senha
                </Text>


                <View
                  style={
                    styles.inputContainer
                  }
                >

                  <Ionicons
                    name="lock-closed-outline"
                    size={
                      19
                    }
                    color="#8b8b8b"
                  />


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

                    placeholderTextColor="#aaaaaa"

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

                </View>


                <Text
                  style={
                    styles.label
                  }
                >
                  Confirmar senha
                </Text>


                <View
                  style={
                    styles.inputContainer
                  }
                >

                  <Ionicons
                    name="shield-checkmark-outline"
                    size={
                      19
                    }
                    color="#8b8b8b"
                  />


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

                    placeholderTextColor="#aaaaaa"

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

                </View>


                {
                  erro !==
                  '' && (

                    <View
                      style={
                        styles.caixaErro
                      }
                    >

                      <Ionicons
                        name="alert-circle-outline"
                        size={
                          18
                        }
                        color="#b31d22"
                      />


                      <Text
                        style={
                          styles.erro
                        }
                      >
                        {
                          erro
                        }
                      </Text>

                    </View>

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
                          color="#ffffff"
                        />

                      )
                      : (

                        <View
                          style={
                            styles.conteudoBotao
                          }
                        >

                          <Text
                            style={
                              styles.textoBotao
                            }
                          >
                            Ativar acesso
                          </Text>


                          <Ionicons
                            name="checkmark-circle-outline"
                            size={
                              18
                            }
                            color="#ffffff"
                          />

                        </View>

                      )
                  }

                </TouchableOpacity>


                <TouchableOpacity
                  style={
                    styles.botaoVoltar
                  }

                  onPress={
                    () => {

                      Keyboard.dismiss();

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

                  <Ionicons
                    name="arrow-back-outline"
                    size={
                      16
                    }
                    color="#a2181c"
                  />


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

    carregandoFonte: {
      flex: 1,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#f1f4f6',
    },


    container: {
      flex: 1,
      backgroundColor:
        '#f1f4f6',
    },


    conteudo: {
      flexGrow: 1,
      justifyContent:
        'center',
      paddingHorizontal:
        20,
      paddingTop:
        24,
      paddingBottom:
        90,
    },


    marca: {
      alignItems:
        'center',
      marginBottom:
        18,
    },


    titulo: {
      fontSize:
        32,
      fontFamily:
        'Montserrat_800ExtraBold',
      color:
        '#a2181c',
      letterSpacing:
        0.2,
    },


    subtitulo: {
      fontSize:
        13,
      color:
        '#777777',
      marginTop:
        3,
      fontWeight:
        '500',
    },


    descricaoMarca: {
      fontSize:
        12,
      color:
        '#9a9a9a',
      marginTop:
        6,
      textAlign:
        'center',
    },


    card: {
      backgroundColor:
        '#ffffff',
      borderRadius:
        18,
      padding:
        20,
      borderWidth:
        1,
      borderColor:
        '#eeeeee',
      shadowColor:
        '#000000',
      shadowOpacity:
        0.08,
      shadowRadius:
        12,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      elevation:
        4,
    },


    cabecalhoCard: {
      alignItems:
        'center',
      marginBottom:
        20,
    },


    tituloCard: {
      fontSize:
        20,
      fontWeight:
        '800',
      color:
        '#242424',
      textAlign:
        'center',
    },


    descricaoCard: {
      fontSize:
        13,
      color:
        '#777777',
      textAlign:
        'center',
      lineHeight:
        19,
      marginTop:
        6,
      maxWidth:
        280,
    },


    seletor: {
      flexDirection:
        'row',
      backgroundColor:
        '#f1f1f1',
      borderRadius:
        12,
      padding:
        4,
      marginBottom:
        22,
    },


    opcao: {
      flex: 1,
      minHeight:
        42,
      borderRadius:
        9,
      alignItems:
        'center',
      justifyContent:
        'center',
      flexDirection:
        'row',
      gap:
        7,
    },


    opcaoAtiva: {
      backgroundColor:
        '#a2181c',
      shadowColor:
        '#a2181c',
      shadowOpacity:
        0.18,
      shadowRadius:
        5,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      elevation:
        2,
    },


    textoOpcao: {
      color:
        '#5f5f5f',
      fontWeight:
        '600',
      fontSize:
        13,
    },


    textoOpcaoAtivo: {
      color:
        '#ffffff',
      fontWeight:
        '700',
    },


    label: {
      fontSize:
        12,
      color:
        '#4d4d4d',
      fontWeight:
        '700',
      marginBottom:
        7,
    },


    inputContainer: {
      minHeight:
        48,
      backgroundColor:
        '#f7f7f7',
      borderRadius:
        10,
      borderWidth:
        1,
      borderColor:
        '#dddddd',
      flexDirection:
        'row',
      alignItems:
        'center',
      paddingHorizontal:
        13,
      marginBottom:
        16,
      gap:
        9,
    },


    input: {
      flex: 1,
      fontSize:
        14,
      color:
        '#222222',
      paddingVertical:
        12,
    },


    caixaErro: {
      backgroundColor:
        '#fff3f3',
      borderWidth:
        1,
      borderColor:
        '#f2cccc',
      borderRadius:
        9,
      paddingHorizontal:
        11,
      paddingVertical:
        10,
      flexDirection:
        'row',
      alignItems:
        'center',
      gap:
        8,
      marginBottom:
        14,
    },


    erro: {
      flex: 1,
      color:
        '#a2181c',
      fontSize:
        12,
      fontWeight:
        '600',
      lineHeight:
        17,
    },


    botao: {
      minHeight:
        48,
      backgroundColor:
        '#a2181c',
      borderRadius:
        10,
      alignItems:
        'center',
      justifyContent:
        'center',
      shadowColor:
        '#a2181c',
      shadowOpacity:
        0.18,
      shadowRadius:
        6,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      elevation:
        2,
    },


    botaoDesabilitado: {
      opacity:
        0.65,
    },


    conteudoBotao: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      gap:
        8,
    },


    textoBotao: {
      color:
        '#ffffff',
      fontWeight:
        '700',
      fontSize:
        14,
    },


    botaoPrimeiroAcesso: {
      minHeight:
        44,
      marginTop:
        10,
      alignItems:
        'center',
      justifyContent:
        'center',
      flexDirection:
        'row',
      gap:
        7,
    },


    textoPrimeiroAcesso: {
      color:
        '#a2181c',
      fontWeight:
        '700',
      fontSize:
        13,
    },


    caixaTeste: {
      backgroundColor:
        '#f8f8f8',
      borderRadius:
        10,
      paddingHorizontal:
        12,
      paddingVertical:
        11,
      marginTop:
        10,
      borderWidth:
        1,
      borderColor:
        '#e9e9e9',
    },


    tituloTesteContainer: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      gap:
        5,
      marginBottom:
        5,
    },


    tituloTeste: {
      fontSize:
        11,
      color:
        '#666666',
      fontWeight:
        '700',
      textAlign:
        'center',
    },


    textoTeste: {
      fontSize:
        11,
      color:
        '#888888',
      textAlign:
        'center',
      lineHeight:
        17,
    },


    botaoVoltar: {
      minHeight:
        43,
      alignItems:
        'center',
      justifyContent:
        'center',
      flexDirection:
        'row',
      gap:
        6,
      marginTop:
        6,
    },


    textoVoltar: {
      color:
        '#a2181c',
      fontSize:
        13,
      fontWeight:
        '700',
    },


    cadastroEncontrado: {
      backgroundColor:
        '#fff8f8',
      borderRadius:
        11,
      padding:
        13,
      marginBottom:
        18,
      borderWidth:
        1,
      borderColor:
        '#eed5d6',
      flexDirection:
        'row',
      alignItems:
        'center',
    },


    cadastroIcone: {
      width:
        38,
      height:
        38,
      borderRadius:
        19,
      backgroundColor:
        '#f5dddd',
      alignItems:
        'center',
      justifyContent:
        'center',
      marginRight:
        11,
    },


    cadastroConteudo: {
      flex: 1,
    },


    cadastroTitulo: {
      fontSize:
        11,
      fontWeight:
        '700',
      color:
        '#a2181c',
      marginBottom:
        3,
    },


    cadastroNome: {
      fontSize:
        15,
      fontWeight:
        '800',
      color:
        '#242424',
    },


    cadastroMatricula: {
      fontSize:
        11,
      color:
        '#777777',
      marginTop:
        3,
    },

  });