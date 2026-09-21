import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  useAuth,
} from '../contexto/AuthContext';

import {
  carregarBase,
} from '../dados/BaseDados';


// ======================================================
// CHAVE DE PRESENÇA POR ALUNO
// ======================================================

function obterStorageKey(
  matricula
) {
  return `@uniapp_presencas_${matricula}`;
}


// ======================================================
// CONVERTER DATA PARA ORDENAÇÃO
// ======================================================

function converterDataParaNumero(
  data
) {
  if (!data) {
    return 0;
  }


  const partes =
    data.split('/');


  if (
    partes.length !==
    3
  ) {
    return 0;
  }


  const dia =
    Number(
      partes[0]
    );

  const mes =
    Number(
      partes[1]
    );

  const ano =
    Number(
      partes[2]
    );


  return new Date(
    ano,
    mes - 1,
    dia
  ).getTime();
}


// ======================================================
// TELA
// ======================================================

export default function HistoricoProfessorScreen() {
  const {
    usuario,
  } =
    useAuth();


  const [
    disciplinas,
    setDisciplinas,
  ] =
    useState([]);


  const [
    totalPresencas,
    setTotalPresencas,
  ] =
    useState(0);


  const [
    carregando,
    setCarregando,
  ] =
    useState(true);


  const [
    datasAbertas,
    setDatasAbertas,
  ] =
    useState({});


  // ====================================================
  // ATUALIZAR AO ENTRAR NA TELA
  // ====================================================

  useFocusEffect(
    useCallback(
      () => {

        carregarHistorico();

      },
      [
        usuario,
      ]
    )
  );


  // ====================================================
  // ABRIR / FECHAR DATA
  // ====================================================

  const alternarData =
    (
      disciplina,
      data
    ) => {

      const chave =
        `${disciplina}-${data}`;


      setDatasAbertas(
        (
          atual
        ) => ({
          ...atual,

          [chave]:
            !atual[
              chave
            ],
        })
      );
    };


  // ====================================================
  // VERIFICAR SE DATA ESTÁ ABERTA
  // ====================================================

  const dataEstaAberta =
    (
      disciplina,
      data
    ) => {

      const chave =
        `${disciplina}-${data}`;


      return Boolean(
        datasAbertas[
          chave
        ]
      );
    };


  // ====================================================
  // CARREGAR HISTÓRICO
  // ====================================================

  const carregarHistorico =
    async () => {

      try {

        setCarregando(
          true
        );


        const base =
          await carregarBase();


        // ==============================================
        // TURMAS DO PROFESSOR
        // ==============================================

        const turmasProfessor =
          base.turmas.filter(
            (turma) =>
              turma.professorId ===
              usuario.identificador
          );


        const idsTurmasProfessor =
          turmasProfessor.map(
            (turma) =>
              turma.id
          );


        // ==============================================
        // BUSCAR PRESENÇAS DOS ALUNOS
        // ==============================================

        let todasPresencas =
          [];


        for (
          const aluno
          of base.alunos
        ) {

          const storageKey =
            obterStorageKey(
              aluno.matricula
            );


          const dados =
            await AsyncStorage.getItem(
              storageKey
            );


          if (!dados) {
            continue;
          }


          let presencasAluno =
            [];


          try {

            presencasAluno =
              JSON.parse(
                dados
              );

          } catch (error) {

            continue;

          }


          // ============================================
          // SOMENTE TURMAS DO PROFESSOR
          // ============================================

          const presencasProfessor =
            presencasAluno.filter(
              (presenca) =>
                idsTurmasProfessor.includes(
                  presenca.turmaId
                )
            );


          todasPresencas = [
            ...todasPresencas,
            ...presencasProfessor,
          ];
        }


        // ==============================================
        // MAIS RECENTES PRIMEIRO
        // ==============================================

        todasPresencas.sort(
          (
            a,
            b
          ) => {

            return (
              (
                b.registradoEm ||
                0
              ) -
              (
                a.registradoEm ||
                0
              )
            );
          }
        );


        setTotalPresencas(
          todasPresencas.length
        );


        // ==============================================
        // AGRUPAR DISCIPLINA
        // ==============================================

        const gruposDisciplinas =
          {};


        todasPresencas.forEach(
          (
            presenca
          ) => {

            const nomeDisciplina =
              presenca.disciplina ||
              presenca.aula ||
              'Disciplina';


            if (
              !gruposDisciplinas[
                nomeDisciplina
              ]
            ) {

              gruposDisciplinas[
                nomeDisciplina
              ] =
                {};
            }


            const data =
              presenca.data ||
              'Data não informada';


            // ==========================================
            // AGRUPAR POR DATA
            // ==========================================

            if (
              !gruposDisciplinas[
                nomeDisciplina
              ][
                data
              ]
            ) {

              gruposDisciplinas[
                nomeDisciplina
              ][
                data
              ] =
                [];
            }


            gruposDisciplinas[
              nomeDisciplina
            ][
              data
            ].push(
              presenca
            );
          }
        );


        // ==============================================
        // MONTAR ESTRUTURA FINAL
        // ==============================================

        const disciplinasMontadas =
          Object.keys(
            gruposDisciplinas
          ).map(
            (
              nomeDisciplina
            ) => {

              const datas =
                Object.keys(
                  gruposDisciplinas[
                    nomeDisciplina
                  ]
                )
                  .map(
                    (
                      data
                    ) => ({

                      data,

                      presencas:
                        gruposDisciplinas[
                          nomeDisciplina
                        ][
                          data
                        ],

                    })
                  )
                  .sort(
                    (
                      a,
                      b
                    ) =>
                      converterDataParaNumero(
                        b.data
                      ) -
                      converterDataParaNumero(
                        a.data
                      )
                  );


              return {

                nome:
                  nomeDisciplina,

                datas,

              };
            }
          );


        setDisciplinas(
          disciplinasMontadas
        );

      } catch (error) {

        console.log(
          'Erro ao carregar histórico do professor.'
        );


        setDisciplinas(
          []
        );


        setTotalPresencas(
          0
        );

      } finally {

        setCarregando(
          false
        );
      }
    };


  // ====================================================
  // ITEM DO ALUNO
  // ====================================================

  const renderPresenca =
    (
      item
    ) => {

      return (
        <View
          key={
            item.id
          }
          style={
            styles.cardAluno
          }
        >

          {/* ========================================== */}
          {/* ALUNO */}
          {/* ========================================== */}

          <View
            style={
              styles.alunoCabecalho
            }
          >

            <View
              style={
                styles.avatar
              }
            >

              <Text
                style={
                  styles.avatarTexto
                }
              >
                {item.aluno
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  'A'}
              </Text>

            </View>


            <View
              style={
                styles.dadosAluno
              }
            >

              <Text
                style={
                  styles.nomeAluno
                }
              >
                {item.aluno}
              </Text>


              <Text
                style={
                  styles.matricula
                }
              >
                Matrícula {item.matricula}
              </Text>

            </View>


            <Ionicons
              name="checkmark-circle"
              size={22}
              color="#27865c"
            />

          </View>


          <View
            style={
              styles.divisor
            }
          />


          {/* ========================================== */}
          {/* HORÁRIO */}
          {/* ========================================== */}

          <View
            style={
              styles.linha
            }
          >

            <Text
              style={
                styles.label
              }
            >
              Horário
            </Text>


            <Text
              style={
                styles.valor
              }
            >
              {item.hora}
            </Text>

          </View>


          {/* ========================================== */}
          {/* SALA */}
          {/* ========================================== */}

          {item.sala && (

            <View
              style={
                styles.linha
              }
            >

              <Text
                style={
                  styles.label
                }
              >
                Sala
              </Text>


              <Text
                style={
                  styles.valor
                }
              >
                {item.sala}
              </Text>

            </View>

          )}


          {/* ========================================== */}
          {/* DISTÂNCIA */}
          {/* ========================================== */}

          {item.distancia !==
            undefined && (

            <View
              style={
                styles.linha
              }
            >

              <Text
                style={
                  styles.label
                }
              >
                Distância
              </Text>


              <Text
                style={
                  styles.valor
                }
              >
                {item.distancia} m
              </Text>

            </View>

          )}


          {/* ========================================== */}
          {/* STATUS */}
          {/* ========================================== */}

          <View
            style={
              styles.status
            }
          >

            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color="#27865c"
            />


            <Text
              style={
                styles.statusTexto
              }
            >
              Presença confirmada
            </Text>

          </View>

        </View>
      );
    };


  // ====================================================
  // CARREGANDO
  // ====================================================

  if (
    carregando
  ) {

    return (
      <View
        style={
          styles.carregando
        }
      >

        <ActivityIndicator
          size="large"
          color="#a2181c"
        />


        <Text
          style={
            styles.textoCarregando
          }
        >
          Carregando histórico...
        </Text>

      </View>
    );
  }


  // ====================================================
  // TELA
  // ====================================================

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={
        styles.conteudo
      }
      showsVerticalScrollIndicator={
        false
      }
    >

      {/* ============================================== */}
      {/* CABEÇALHO */}
      {/* ============================================== */}

      <View
        style={
          styles.cabecalho
        }
      >

        <Text
          style={
            styles.titulo
          }
        >
          Histórico de presença
        </Text>


        <Text
          style={
            styles.subtitulo
          }
        >
          Selecione a data da aula para consultar
          os alunos que registraram presença.
        </Text>


        <View
          style={
            styles.resumo
          }
        >

          <Text
            style={
              styles.numero
            }
          >
            {totalPresencas}
          </Text>


          <Text
            style={
              styles.textoResumo
            }
          >
            {totalPresencas === 1
              ? 'presença registrada'
              : 'presenças registradas'}
          </Text>

        </View>

      </View>


      {/* ============================================== */}
      {/* SEM PRESENÇAS */}
      {/* ============================================== */}

      {disciplinas.length ===
      0 ? (

        <View
          style={
            styles.vazio
          }
        >

          <Ionicons
            name="clipboard-outline"
            size={42}
            color="#aaa"
          />


          <Text
            style={
              styles.vazioTitulo
            }
          >
            Nenhuma presença registrada
          </Text>


          <Text
            style={
              styles.vazioTexto
            }
          >
            Quando um aluno registrar presença
            em uma das suas turmas,
            a data da aula aparecerá aqui.
          </Text>

        </View>

      ) : (

        // ==============================================
        // DISCIPLINAS
        // ==============================================

        disciplinas.map(
          (
            disciplina
          ) => (

            <View
              key={
                disciplina.nome
              }
              style={
                styles.disciplinaContainer
              }
            >

              {/* ====================================== */}
              {/* NOME DA DISCIPLINA */}
              {/* ====================================== */}

              <View
                style={
                  styles.disciplinaCabecalho
                }
              >

                <View
                  style={
                    styles.iconeDisciplina
                  }
                >

                  <Ionicons
                    name="book-outline"
                    size={20}
                    color="#a2181c"
                  />

                </View>


                <Text
                  style={
                    styles.disciplina
                  }
                >
                  {disciplina.nome}
                </Text>

              </View>


              {/* ====================================== */}
              {/* DATAS DAS AULAS */}
              {/* ====================================== */}

              {disciplina.datas.map(
                (
                  grupoData
                ) => {

                  const aberta =
                    dataEstaAberta(
                      disciplina.nome,
                      grupoData.data
                    );


                  return (
                    <View
                      key={
                        grupoData.data
                      }
                      style={
                        styles.dataContainer
                      }
                    >

                      {/* ================================== */}
                      {/* BOTÃO DA DATA */}
                      {/* ================================== */}

                      <TouchableOpacity
                        style={[
                          styles.botaoData,

                          aberta &&
                            styles.botaoDataAberto,
                        ]}
                        onPress={() =>
                          alternarData(
                            disciplina.nome,
                            grupoData.data
                          )
                        }
                        activeOpacity={
                          0.7
                        }
                      >

                        <View
                          style={
                            styles.dataEsquerda
                          }
                        >

                          <Ionicons
                            name="calendar-outline"
                            size={20}
                            color={
                              aberta
                                ? '#fff'
                                : '#a2181c'
                            }
                          />


                          <View
                            style={
                              styles.infoData
                            }
                          >

                            <Text
                              style={[
                                styles.textoData,

                                aberta &&
                                  styles.textoDataAberto,
                              ]}
                            >
                              {grupoData.data}
                            </Text>


                            <Text
                              style={[
                                styles.quantidade,

                                aberta &&
                                  styles.quantidadeAberta,
                              ]}
                            >
                              {grupoData.presencas.length}{' '}
                              {grupoData.presencas.length === 1
                                ? 'presença'
                                : 'presenças'}
                            </Text>

                          </View>

                        </View>


                        <Ionicons
                          name={
                            aberta
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={21}
                          color={
                            aberta
                              ? '#fff'
                              : '#777'
                          }
                        />

                      </TouchableOpacity>


                      {/* ================================== */}
                      {/* ALUNOS DA DATA */}
                      {/* ================================== */}

                      {aberta && (

                        <View
                          style={
                            styles.listaAlunos
                          }
                        >

                          {grupoData.presencas.map(
                            (
                              presenca
                            ) =>
                              renderPresenca(
                                presenca
                              )
                          )}

                        </View>

                      )}

                    </View>
                  );
                }
              )}

            </View>

          )
        )

      )}

    </ScrollView>
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
      padding:
        20,

      paddingBottom:
        40,
    },


    // ==================================================
    // CABEÇALHO
    // ==================================================

    cabecalho: {
      marginBottom:
        20,
    },


    titulo: {
      fontSize:
        23,

      fontWeight:
        'bold',

      color:
        '#222',
    },


    subtitulo: {
      fontSize:
        13,

      color:
        '#777',

      lineHeight:
        19,

      marginTop:
        5,
    },


    resumo: {
      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#fff',

      borderRadius:
        12,

      padding:
        15,

      marginTop:
        16,
    },


    numero: {
      fontSize:
        25,

      fontWeight:
        'bold',

      color:
        '#a2181c',

      marginRight:
        10,
    },


    textoResumo: {
      fontSize:
        13,

      color:
        '#666',

      fontWeight:
        '600',
    },


    // ==================================================
    // DISCIPLINA
    // ==================================================

    disciplinaContainer: {
      marginBottom:
        23,
    },


    disciplinaCabecalho: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginBottom:
        10,
    },


    iconeDisciplina: {
      width:
        36,

      height:
        36,

      borderRadius:
        18,

      backgroundColor:
        '#f8e8e8',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight:
        9,
    },


    disciplina: {
      flex:
        1,

      fontSize:
        16,

      fontWeight:
        'bold',

      color:
        '#333',
    },


    // ==================================================
    // DATA
    // ==================================================

    dataContainer: {
      marginBottom:
        9,
    },


    botaoData: {
      backgroundColor:
        '#fff',

      borderRadius:
        11,

      paddingHorizontal:
        14,

      paddingVertical:
        12,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      borderWidth:
        1,

      borderColor:
        '#e2e2e2',
    },


    botaoDataAberto: {
      backgroundColor:
        '#a2181c',

      borderColor:
        '#a2181c',
    },


    dataEsquerda: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },


    infoData: {
      marginLeft:
        10,
    },


    textoData: {
      fontSize:
        14,

      fontWeight:
        'bold',

      color:
        '#333',
    },


    textoDataAberto: {
      color:
        '#fff',
    },


    quantidade: {
      fontSize:
        11,

      color:
        '#888',

      marginTop:
        2,
    },


    quantidadeAberta: {
      color:
        '#f3dddd',
    },


    // ==================================================
    // LISTA DE ALUNOS
    // ==================================================

    listaAlunos: {
      paddingTop:
        10,

      paddingHorizontal:
        3,
    },


    cardAluno: {
      backgroundColor:
        '#fff',

      borderRadius:
        11,

      padding:
        14,

      marginBottom:
        9,

      borderLeftWidth:
        4,

      borderLeftColor:
        '#27865c',
    },


    alunoCabecalho: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },


    avatar: {
      width:
        38,

      height:
        38,

      borderRadius:
        19,

      backgroundColor:
        '#f8e8e8',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight:
        10,
    },


    avatarTexto: {
      color:
        '#a2181c',

      fontSize:
        15,

      fontWeight:
        'bold',
    },


    dadosAluno: {
      flex:
        1,
    },


    nomeAluno: {
      fontSize:
        14,

      fontWeight:
        'bold',

      color:
        '#333',
    },


    matricula: {
      fontSize:
        11,

      color:
        '#888',

      marginTop:
        2,
    },


    divisor: {
      height:
        1,

      backgroundColor:
        '#eeeeee',

      marginVertical:
        11,
    },


    linha: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      marginBottom:
        6,
    },


    label: {
      fontSize:
        12,

      color:
        '#777',
    },


    valor: {
      fontSize:
        12,

      color:
        '#333',

      fontWeight:
        '600',

      maxWidth:
        '65%',

      textAlign:
        'right',
    },


    status: {
      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#e7f5ef',

      borderRadius:
        8,

      padding:
        8,

      marginTop:
        7,
    },


    statusTexto: {
      color:
        '#27865c',

      fontSize:
        11,

      fontWeight:
        'bold',

      marginLeft:
        6,
    },


    // ==================================================
    // VAZIO
    // ==================================================

    vazio: {
      backgroundColor:
        '#fff',

      borderRadius:
        14,

      padding:
        30,

      alignItems:
        'center',
    },


    vazioTitulo: {
      fontSize:
        15,

      fontWeight:
        'bold',

      color:
        '#555',

      marginTop:
        10,
    },


    vazioTexto: {
      fontSize:
        13,

      color:
        '#888',

      textAlign:
        'center',

      lineHeight:
        19,

      marginTop:
        5,
    },


    // ==================================================
    // CARREGANDO
    // ==================================================

    carregando: {
      flex:
        1,

      backgroundColor:
        '#edf1f4',

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    textoCarregando: {
      fontSize:
        14,

      color:
        '#666',

      marginTop:
        12,
    },

  });