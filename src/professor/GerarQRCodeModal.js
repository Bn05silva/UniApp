import React, {
  useEffect,
  useState,
} from 'react';

import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import QRCode
  from 'react-native-qrcode-svg';


// ======================================================
// TEMPO DE VALIDADE
// ======================================================

const TEMPO_VALIDADE_MINUTOS = 180;


// ======================================================
// DATA LOCAL YYYY-MM-DD
// ======================================================

function obterDataISO() {
  const agora =
    new Date();

  const ano =
    agora.getFullYear();

  const mes =
    String(
      agora.getMonth() + 1
    ).padStart(2, '0');

  const dia =
    String(
      agora.getDate()
    ).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}


// ======================================================
// DATA PARA EXIBIÇÃO
// ======================================================

function obterDataFormatada() {
  return new Date()
    .toLocaleDateString(
      'pt-BR'
    );
}


// ======================================================
// HORA PARA EXIBIÇÃO
// ======================================================

function formatarHora(data) {
  return new Date(data)
    .toLocaleTimeString(
      'pt-BR',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );
}


// ======================================================
// COMPONENTE
// ======================================================

export default function GerarQRCodeModal({
  visible,
  turma,
  professor,
  onClose,
}) {
  const [
    conteudoQR,
    setConteudoQR,
  ] = useState('');

  const [
    sessao,
    setSessao,
  ] = useState('');

  const [
    criadoEm,
    setCriadoEm,
  ] = useState(null);

  const [
    expiraEm,
    setExpiraEm,
  ] = useState(null);


  // ====================================================
  // CRIAR SESSÃO QUANDO ABRIR
  // ====================================================

  useEffect(() => {
    if (
      visible &&
      turma &&
      professor
    ) {
      criarSessao();
    }

    if (!visible) {
      setConteudoQR('');
      setSessao('');
      setCriadoEm(null);
      setExpiraEm(null);
    }
  }, [
    visible,
    turma,
    professor,
  ]);


  // ====================================================
  // GERAR DADOS DO QR
  // ====================================================

  const criarSessao = () => {

    const agora =
      Date.now();

    const expiracao =
      agora +
      (
        TEMPO_VALIDADE_MINUTOS *
        60 *
        1000
      );


    const data =
      obterDataISO();


    const idSessao =
      `${turma.id}-${agora}`;


    const dadosQR = {

      tipo:
        'presenca',

      turmaId:
        turma.id,

      professorId:
        professor.identificador,

      data,

      sessao:
        idSessao,

      criadoEm:
        agora,

      expiraEm:
        expiracao,
    };


    setSessao(
      idSessao
    );

    setCriadoEm(
      agora
    );

    setExpiraEm(
      expiracao
    );

    setConteudoQR(
      JSON.stringify(
        dadosQR
      )
    );
  };


  // ====================================================
  // SEM TURMA
  // ====================================================

  if (
    !turma ||
    !professor
  ) {
    return null;
  }


  // ====================================================
  // TELA
  // ====================================================

  return (
    <Modal
      visible={
        visible
      }
      transparent
      animationType="fade"
      onRequestClose={
        onClose
      }
    >

      <View
        style={
          styles.fundo
        }
      >

        <View
          style={
            styles.card
          }
        >

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
          >

            {/* ========================================== */}
            {/* CABEÇALHO */}
            {/* ========================================== */}

            <View
              style={
                styles.cabecalho
              }
            >

              <View
                style={
                  styles.tituloContainer
                }
              >

                <Text
                  style={
                    styles.titulo
                  }
                >
                  Aula iniciada
                </Text>

                <Text
                  style={
                    styles.subtitulo
                  }
                >
                  QR Code para registro de presença
                </Text>

              </View>


              <TouchableOpacity
                style={
                  styles.fechar
                }
                onPress={
                  onClose
                }
              >
                <Ionicons
                  name="close"
                  size={23}
                  color="#555"
                />
              </TouchableOpacity>

            </View>


            {/* ========================================== */}
            {/* DISCIPLINA */}
            {/* ========================================== */}

            <View
              style={
                styles.disciplinaContainer
              }
            >

              <View
                style={
                  styles.iconeDisciplina
                }
              >

                <Ionicons
                  name="book-outline"
                  size={22}
                  color="#a2181c"
                />

              </View>


              <View
                style={
                  styles.dadosDisciplina
                }
              >

                <Text
                  style={
                    styles.disciplina
                  }
                >
                  {turma.disciplina}
                </Text>

                <Text
                  style={
                    styles.turma
                  }
                >
                  Turma {turma.id}
                </Text>

              </View>

            </View>


            {/* ========================================== */}
            {/* INFORMAÇÕES DA AULA */}
            {/* ========================================== */}

            <View
              style={
                styles.infoAula
              }
            >

              <View
                style={
                  styles.infoItem
                }
              >
                <Ionicons
                  name="calendar-outline"
                  size={17}
                  color="#777"
                />

                <Text
                  style={
                    styles.infoTexto
                  }
                >
                  {obterDataFormatada()}
                </Text>
              </View>


              <View
                style={
                  styles.infoItem
                }
              >
                <Ionicons
                  name="time-outline"
                  size={17}
                  color="#777"
                />

                <Text
                  style={
                    styles.infoTexto
                  }
                >
                  {turma.horario}
                </Text>
              </View>


              <View
                style={
                  styles.infoItem
                }
              >
                <Ionicons
                  name="location-outline"
                  size={17}
                  color="#777"
                />

                <Text
                  style={
                    styles.infoTexto
                  }
                >
                  Sala {turma.sala}
                </Text>
              </View>

            </View>


            {/* ========================================== */}
            {/* QR CODE */}
            {/* ========================================== */}

            <View
              style={
                styles.qrContainer
              }
            >

              {conteudoQR !== '' && (
                <QRCode
                  value={
                    conteudoQR
                  }
                  size={220}
                  backgroundColor="#ffffff"
                  color="#000000"
                />
              )}

            </View>


            {/* ========================================== */}
            {/* VALIDADE */}
            {/* ========================================== */}

            <View
              style={
                styles.validade
              }
            >

              <Ionicons
                name="timer-outline"
                size={20}
                color="#a2181c"
              />


              <View
                style={
                  styles.validadeDados
                }
              >

                <Text
                  style={
                    styles.validadeTitulo
                  }
                >
                  QR válido por {TEMPO_VALIDADE_MINUTOS} minutos
                </Text>


                {criadoEm &&
                  expiraEm && (
                    <Text
                      style={
                        styles.validadeTexto
                      }
                    >
                      Criado às {formatarHora(criadoEm)}
                      {' • '}
                      Expira às {formatarHora(expiraEm)}
                    </Text>
                  )}

              </View>

            </View>


            {/* ========================================== */}
            {/* ORIENTAÇÃO */}
            {/* ========================================== */}

            <View
              style={
                styles.orientacao
              }
            >

              <Ionicons
                name="scan-outline"
                size={21}
                color="#a2181c"
              />

              <Text
                style={
                  styles.orientacaoTexto
                }
              >
                Os alunos devem ler este QR Code
                enquanto ele estiver válido.
              </Text>

            </View>


            {/* ========================================== */}
            {/* SESSÃO */}
            {/* ========================================== */}

            <Text
              style={
                styles.sessaoLabel
              }
            >
              Sessão da aula
            </Text>


            <Text
              style={
                styles.sessao
              }
            >
              {sessao}
            </Text>


            {/* ========================================== */}
            {/* ENCERRAR */}
            {/* ========================================== */}

            <TouchableOpacity
              style={
                styles.botaoEncerrar
              }
              onPress={
                onClose
              }
            >

              <Ionicons
                name="stop-circle-outline"
                size={20}
                color="#fff"
              />


              <Text
                style={
                  styles.textoEncerrar
                }
              >
                Encerrar exibição
              </Text>

            </TouchableOpacity>

          </ScrollView>

        </View>

      </View>

    </Modal>
  );
}


// ======================================================
// ESTILOS
// ======================================================

const styles =
  StyleSheet.create({

    fundo: {
      flex: 1,

      backgroundColor:
        'rgba(0, 0, 0, 0.55)',

      justifyContent:
        'center',

      paddingHorizontal:
        18,
    },


    card: {
      backgroundColor:
        '#fff',

      borderRadius:
        17,

      padding:
        20,

      maxHeight:
        '92%',
    },


    // ==================================================
    // CABEÇALHO
    // ==================================================

    cabecalho: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',
    },


    tituloContainer: {
      flex:
        1,
    },


    titulo: {
      fontSize:
        22,

      fontWeight:
        'bold',

      color:
        '#222',
    },


    subtitulo: {
      fontSize:
        12,

      color:
        '#888',

      marginTop:
        3,
    },


    fechar: {
      width:
        38,

      height:
        38,

      borderRadius:
        19,

      backgroundColor:
        '#f1f1f1',

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    // ==================================================
    // DISCIPLINA
    // ==================================================

    disciplinaContainer: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginTop:
        20,

      paddingBottom:
        15,

      borderBottomWidth:
        1,

      borderBottomColor:
        '#eeeeee',
    },


    iconeDisciplina: {
      width:
        44,

      height:
        44,

      borderRadius:
        22,

      backgroundColor:
        '#f8e8e8',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight:
        11,
    },


    dadosDisciplina: {
      flex:
        1,
    },


    disciplina: {
      fontSize:
        16,

      fontWeight:
        'bold',

      color:
        '#222',
    },


    turma: {
      fontSize:
        11,

      color:
        '#888',

      marginTop:
        3,
    },


    // ==================================================
    // INFORMAÇÕES
    // ==================================================

    infoAula: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      marginTop:
        15,
    },


    infoItem: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },


    infoTexto: {
      fontSize:
        12,

      color:
        '#555',

      marginLeft:
        5,

      fontWeight:
        '600',
    },


    // ==================================================
    // QR
    // ==================================================

    qrContainer: {
      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#fff',

      paddingVertical:
        24,

      marginTop:
        15,

      borderRadius:
        14,

      borderWidth:
        1,

      borderColor:
        '#eeeeee',
    },


    // ==================================================
    // VALIDADE
    // ==================================================

    validade: {
      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#fff5f5',

      borderRadius:
        10,

      padding:
        11,

      marginTop:
        14,

      borderWidth:
        1,

      borderColor:
        '#f1d6d6',
    },


    validadeDados: {
      flex:
        1,

      marginLeft:
        8,
    },


    validadeTitulo: {
      fontSize:
        12,

      color:
        '#a2181c',

      fontWeight:
        'bold',
    },


    validadeTexto: {
      fontSize:
        11,

      color:
        '#777',

      marginTop:
        3,
    },


    // ==================================================
    // ORIENTAÇÃO
    // ==================================================

    orientacao: {
      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#f8e8e8',

      borderRadius:
        10,

      padding:
        11,

      marginTop:
        10,
    },


    orientacaoTexto: {
      flex:
        1,

      fontSize:
        12,

      color:
        '#555',

      lineHeight:
        17,

      marginLeft:
        8,
    },


    // ==================================================
    // SESSÃO
    // ==================================================

    sessaoLabel: {
      fontSize:
        11,

      color:
        '#999',

      marginTop:
        15,
    },


    sessao: {
      fontSize:
        10,

      color:
        '#888',

      marginTop:
        2,
    },


    // ==================================================
    // BOTÃO
    // ==================================================

    botaoEncerrar: {
      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
        'center',

      backgroundColor:
        '#a2181c',

      borderRadius:
        10,

      paddingVertical:
        13,

      marginTop:
        20,
    },


    textoEncerrar: {
      color:
        '#fff',

      fontWeight:
        'bold',

      fontSize:
        14,

      marginLeft:
        7,
    },

  });