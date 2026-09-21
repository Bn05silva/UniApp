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
  const { entrar } =
    useAuth();

  const [
    tipo,
    setTipo,
  ] = useState('aluno');

  const [
    identificador,
    setIdentificador,
  ] = useState('');

  const [
    senha,
    setSenha,
  ] = useState('');

  const [
    erro,
    setErro,
  ] = useState('');

  const [
    carregando,
    setCarregando,
  ] = useState(false);


  const tipoAtual =
    TIPOS.find(
      (item) =>
        item.id === tipo
    );


  // ======================================================
  // TROCAR ALUNO / PROFESSOR
  // ======================================================

  const trocarTipo =
    (novoTipo) => {

      Keyboard.dismiss();

      setTipo(
        novoTipo
      );

      setIdentificador(
        ''
      );

      setSenha(
        ''
      );

      setErro(
        ''
      );
    };


  // ======================================================
  // ENTRAR
  // ======================================================

  const handleEntrar =
    async () => {

      if (carregando) {
        return;
      }


      setErro('');

      setCarregando(
        true
      );


      const resultado =
        await entrar(
          tipo,
          identificador,
          senha
        );


      if (!resultado.ok) {

        setErro(
          resultado.erro
        );

        setCarregando(
          false
        );
      }
    };


  // ======================================================
  // TELA
  // ======================================================

  return (
    <KeyboardAvoidingView
      style={
        styles.container
      }
      behavior={
        Platform.OS === 'ios'
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

        {/* ============================================== */}
        {/* MARCA */}
        {/* ============================================== */}

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
            UniApp
          </Text>

          <Text
            style={
              styles.subtitulo
            }
          >
            Universidade de Vassouras
          </Text>

        </View>


        {/* ============================================== */}
        {/* LOGIN */}
        {/* ============================================== */}

        <View
          style={
            styles.card
          }
        >

          {/* ============================================ */}
          {/* ALUNO / PROFESSOR */}
          {/* ============================================ */}

          <View
            style={
              styles.seletor
            }
          >

            {TIPOS.map(
              (item) => (

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
                  onPress={() =>
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
                    {item.rotulo}
                  </Text>

                </TouchableOpacity>

              )
            )}

          </View>


          {/* ============================================ */}
          {/* IDENTIFICAÇÃO */}
          {/* ============================================ */}

          <Text
            style={
              styles.label
            }
          >
            {tipoAtual.campo}
          </Text>


          <TextInput
            key={
              tipo
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
              tipo === 'aluno'
                ? 'Digite sua matrícula'
                : 'Digite sua matrícula funcional'
            }

            keyboardType={
              tipo === 'aluno'
                ? 'number-pad'
                : 'default'
            }

            autoCapitalize={
              tipo === 'professor'
                ? 'characters'
                : 'none'
            }

            autoCorrect={
              false
            }

            editable={
              !carregando
            }

            returnKeyType="next"
          />


          {/* ============================================ */}
          {/* SENHA */}
          {/* ============================================ */}

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


          {/* ============================================ */}
          {/* ERRO */}
          {/* ============================================ */}

          {erro !== '' && (

            <Text
              style={
                styles.erro
              }
            >
              {erro}
            </Text>

          )}


          {/* ============================================ */}
          {/* ENTRAR */}
          {/* ============================================ */}

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

            {carregando ? (

              <ActivityIndicator
                color="#fff"
              />

            ) : (

              <Text
                style={
                  styles.textoBotao
                }
              >
                Entrar
              </Text>

            )}

          </TouchableOpacity>


          <Text
            style={
              styles.ajuda
            }
          >
            Após informar seus dados,
            confirme sua identidade
            utilizando a biometria do aparelho.
          </Text>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}


// ======================================================
// ESTILOS
// ======================================================

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


    // ==================================================
    // SELETOR
    // ==================================================

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
      flex:
        1,

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


    // ==================================================
    // CAMPOS
    // ==================================================

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


    // ==================================================
    // ERRO
    // ==================================================

    erro: {
      color:
        '#c0392b',

      fontSize:
        13,

      fontWeight:
        '600',

      marginBottom:
        12,
    },


    // ==================================================
    // BOTÃO
    // ==================================================

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


    ajuda: {
      fontSize:
        12,

      color:
        '#888',

      textAlign:
        'center',

      marginTop:
        12,

      lineHeight:
        17,
    },

  });