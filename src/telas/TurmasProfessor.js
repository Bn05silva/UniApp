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

import GerarQRCodeModal
  from '../professor/GerarQRCodeModal';


export default function TurmasProfessorScreen() {
  const { usuario } =
    useAuth();


  const [
    turmas,
    setTurmas,
  ] = useState([]);


  const [
    carregando,
    setCarregando,
  ] = useState(true);


  const [
    turmaSelecionada,
    setTurmaSelecionada,
  ] = useState(null);


  const [
    qrVisible,
    setQrVisible,
  ] = useState(false);


  // ======================================================
  // ATUALIZAR AO ENTRAR NA TELA
  // ======================================================

  useFocusEffect(
    useCallback(() => {
      carregarTurmas();
    }, [usuario])
  );


  // ======================================================
  // CARREGAR TURMAS DO PROFESSOR
  // ======================================================

  const carregarTurmas =
    async () => {

      try {

        setCarregando(
          true
        );


        const base =
          await carregarBase();


        // ================================================
        // SOMENTE TURMAS DO PROFESSOR LOGADO
        // ================================================

        const turmasProfessor =
          base.turmas.filter(
            (turma) =>
              turma.professorId ===
              usuario.identificador
          );


        // ================================================
        // COMPLETAR DADOS
        // ================================================

        const completas =
          turmasProfessor.map(
            (turma) => {

              const disciplina =
                base.disciplinas.find(
                  (item) =>
                    item.id ===
                    turma.disciplinaId
                );


              // ==========================================
              // MATRÍCULAS DA TURMA
              // ==========================================

              const matriculasTurma =
                base.matriculas.filter(
                  (item) =>
                    item.turmaId ===
                    turma.id
                );


              // ==========================================
              // DADOS DOS ALUNOS
              // ==========================================

              const alunos =
                matriculasTurma
                  .map(
                    (matricula) =>
                      base.alunos.find(
                        (aluno) =>
                          aluno.matricula ===
                          matricula.matricula
                      )
                  )
                  .filter(Boolean);


              return {
                ...turma,

                disciplina:
                  disciplina
                    ? disciplina.nome
                    : 'Disciplina não encontrada',

                alunos,
              };
            }
          );


        setTurmas(
          completas
        );

      } catch (error) {

        console.log(
          'Erro ao carregar as turmas.'
        );

      } finally {

        setCarregando(
          false
        );
      }
    };


  // ======================================================
  // INICIAR AULA
  // ======================================================

  const iniciarAula =
    (turma) => {

      setTurmaSelecionada(
        turma
      );

      setQrVisible(
        true
      );
    };


  // ======================================================
  // FECHAR QR
  // ======================================================

  const fecharQRCode =
    () => {

      setQrVisible(
        false
      );

      setTurmaSelecionada(
        null
      );
    };


  // ======================================================
  // CARREGANDO
  // ======================================================

  if (carregando) {
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
          Carregando suas turmas...
        </Text>

      </View>
    );
  }


  // ======================================================
  // TELA
  // ======================================================

  return (
    <>

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
        {/* INTRODUÇÃO */}
        {/* ============================================== */}

        <View
          style={
            styles.introducao
          }
        >

          <Text
            style={
              styles.titulo
            }
          >
            Minhas turmas
          </Text>


          <Text
            style={
              styles.subtitulo
            }
          >
            Consulte suas disciplinas,
            horários, salas e alunos
            matriculados.
          </Text>

        </View>


        {/* ============================================== */}
        {/* LISTA DE TURMAS */}
        {/* ============================================== */}

        {turmas.length === 0 ? (

          <View
            style={
              styles.vazio
            }
          >

            <Ionicons
              name="school-outline"
              size={38}
              color="#aaa"
            />


            <Text
              style={
                styles.vazioTitulo
              }
            >
              Nenhuma turma encontrada
            </Text>


            <Text
              style={
                styles.vazioTexto
              }
            >
              Não existem turmas vinculadas
              a este professor.
            </Text>

          </View>

        ) : (

          turmas.map(
            (turma) => (

              <View
                key={
                  turma.id
                }
                style={
                  styles.card
                }
              >

                {/* ====================================== */}
                {/* DISCIPLINA */}
                {/* ====================================== */}

                <View
                  style={
                    styles.cabecalhoCard
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
                      styles.tituloCard
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
                        styles.codigoTurma
                      }
                    >
                      {turma.id}
                    </Text>

                  </View>

                </View>


                <View
                  style={
                    styles.divisor
                  }
                />


                {/* ====================================== */}
                {/* GRADE INSTITUCIONAL */}
                {/* ====================================== */}

                <View
                  style={
                    styles.grade
                  }
                >

                  {/* DIA */}

                  <View
                    style={
                      styles.gradeItem
                    }
                  >

                    <Ionicons
                      name="calendar-outline"
                      size={17}
                      color="#777"
                    />

                    <Text
                      style={
                        styles.label
                      }
                    >
                      Dia
                    </Text>

                    <Text
                      style={
                        styles.valor
                      }
                    >
                      {turma.dia}
                    </Text>

                  </View>


                  {/* HORÁRIO */}

                  <View
                    style={
                      styles.gradeItem
                    }
                  >

                    <Ionicons
                      name="time-outline"
                      size={17}
                      color="#777"
                    />

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
                      {turma.horario}
                      {turma.horarioFim
                        ? ` às ${turma.horarioFim}`
                        : ''}
                    </Text>

                  </View>


                  {/* SALA */}

                  <View
                    style={
                      styles.gradeItem
                    }
                  >

                    <Ionicons
                      name="location-outline"
                      size={17}
                      color="#777"
                    />

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
                      {turma.sala}
                    </Text>

                  </View>

                </View>


                {/* ====================================== */}
                {/* INFORMAÇÃO DA GRADE */}
                {/* ====================================== */}

                <View
                  style={
                    styles.avisoGrade
                  }
                >

                  <Ionicons
                    name="information-circle-outline"
                    size={17}
                    color="#777"
                  />

                  <Text
                    style={
                      styles.avisoTexto
                    }
                  >
                    Horário definido pela grade institucional.
                  </Text>

                </View>


                {/* ====================================== */}
                {/* INICIAR AULA */}
                {/* ====================================== */}

                <TouchableOpacity
                  style={
                    styles.botaoIniciar
                  }
                  onPress={() =>
                    iniciarAula(
                      turma
                    )
                  }
                  activeOpacity={
                    0.8
                  }
                >

                  <Ionicons
                    name="qr-code-outline"
                    size={20}
                    color="#fff"
                  />


                  <Text
                    style={
                      styles.textoIniciar
                    }
                  >
                    Iniciar aula
                  </Text>

                </TouchableOpacity>


                {/* ====================================== */}
                {/* ALUNOS */}
                {/* ====================================== */}

                <View
                  style={
                    styles.alunosContainer
                  }
                >

                  <View
                    style={
                      styles.alunosCabecalho
                    }
                  >

                    <Text
                      style={
                        styles.alunosTitulo
                      }
                    >
                      Alunos matriculados
                    </Text>


                    <View
                      style={
                        styles.contador
                      }
                    >

                      <Text
                        style={
                          styles.contadorTexto
                        }
                      >
                        {turma.alunos.length}
                      </Text>

                    </View>

                  </View>


                  {turma.alunos.length === 0 ? (

                    <Text
                      style={
                        styles.semAlunos
                      }
                    >
                      Nenhum aluno matriculado.
                    </Text>

                  ) : (

                    turma.alunos.map(
                      (aluno) => (

                        <View
                          key={
                            aluno.matricula
                          }
                          style={
                            styles.aluno
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
                              {aluno.nome
                                .charAt(0)
                                .toUpperCase()}
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
                              {aluno.nome}
                            </Text>


                            <Text
                              style={
                                styles.matriculaAluno
                              }
                            >
                              Matrícula {aluno.matricula}
                            </Text>

                          </View>

                        </View>

                      )
                    )

                  )}

                </View>

              </View>

            )
          )

        )}

      </ScrollView>


      {/* ================================================== */}
      {/* QR CODE */}
      {/* ================================================== */}

      <GerarQRCodeModal
        visible={
          qrVisible
        }

        turma={
          turmaSelecionada
        }

        professor={
          usuario
        }

        onClose={
          fecharQRCode
        }
      />

    </>
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
      padding: 20,

      paddingBottom: 35,
    },


    introducao: {
      marginBottom: 20,
    },


    titulo: {
      fontSize: 23,

      fontWeight: 'bold',

      color: '#222',
    },


    subtitulo: {
      fontSize: 13,

      color: '#777',

      lineHeight: 19,

      marginTop: 5,
    },


    // ==================================================
    // CARD
    // ==================================================

    card: {
      backgroundColor: '#fff',

      borderRadius: 14,

      padding: 16,

      marginBottom: 16,

      elevation: 2,

      shadowColor: '#000',

      shadowOpacity: 0.06,

      shadowRadius: 4,

      shadowOffset: {
        width: 0,
        height: 2,
      },
    },


    cabecalhoCard: {
      flexDirection: 'row',

      alignItems: 'center',
    },


    iconeDisciplina: {
      width: 44,

      height: 44,

      borderRadius: 22,

      backgroundColor: '#f8e8e8',

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 12,
    },


    tituloCard: {
      flex: 1,
    },


    disciplina: {
      fontSize: 16,

      fontWeight: 'bold',

      color: '#222',
    },


    codigoTurma: {
      fontSize: 12,

      color: '#888',

      marginTop: 3,
    },


    divisor: {
      height: 1,

      backgroundColor: '#eeeeee',

      marginVertical: 15,
    },


    // ==================================================
    // GRADE
    // ==================================================

    grade: {
      flexDirection: 'row',

      justifyContent:
        'space-between',
    },


    gradeItem: {
      flex: 1,
    },


    label: {
      fontSize: 11,

      color: '#888',

      marginTop: 5,
    },


    valor: {
      fontSize: 13,

      fontWeight: '600',

      color: '#333',

      marginTop: 3,
    },


    avisoGrade: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor: '#f5f5f5',

      borderRadius: 8,

      paddingHorizontal: 10,

      paddingVertical: 8,

      marginTop: 15,
    },


    avisoTexto: {
      flex: 1,

      fontSize: 11,

      color: '#777',

      marginLeft: 6,
    },


    // ==================================================
    // INICIAR AULA
    // ==================================================

    botaoIniciar: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor: '#a2181c',

      borderRadius: 10,

      paddingVertical: 13,

      marginTop: 16,
    },


    textoIniciar: {
      color: '#fff',

      fontWeight: 'bold',

      fontSize: 14,

      marginLeft: 7,
    },


    // ==================================================
    // ALUNOS
    // ==================================================

    alunosContainer: {
      marginTop: 17,

      paddingTop: 14,

      borderTopWidth: 1,

      borderTopColor:
        '#eeeeee',
    },


    alunosCabecalho: {
      flexDirection: 'row',

      justifyContent: 'space-between',

      alignItems: 'center',

      marginBottom: 10,
    },


    alunosTitulo: {
      fontSize: 14,

      fontWeight: 'bold',

      color: '#333',
    },


    contador: {
      backgroundColor: '#f8e8e8',

      minWidth: 26,

      height: 26,

      borderRadius: 13,

      justifyContent: 'center',

      alignItems: 'center',

      paddingHorizontal: 7,
    },


    contadorTexto: {
      color: '#a2181c',

      fontWeight: 'bold',

      fontSize: 12,
    },


    aluno: {
      flexDirection: 'row',

      alignItems: 'center',

      paddingVertical: 9,
    },


    avatar: {
      width: 36,

      height: 36,

      borderRadius: 18,

      backgroundColor: '#edf1f4',

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 10,
    },


    avatarTexto: {
      color: '#a2181c',

      fontWeight: 'bold',

      fontSize: 14,
    },


    dadosAluno: {
      flex: 1,
    },


    nomeAluno: {
      fontSize: 13,

      color: '#333',

      fontWeight: '600',
    },


    matriculaAluno: {
      fontSize: 11,

      color: '#888',

      marginTop: 2,
    },


    semAlunos: {
      fontSize: 13,

      color: '#888',

      fontStyle: 'italic',
    },


    // ==================================================
    // VAZIO
    // ==================================================

    vazio: {
      backgroundColor: '#fff',

      borderRadius: 14,

      padding: 30,

      alignItems: 'center',
    },


    vazioTitulo: {
      fontSize: 15,

      fontWeight: 'bold',

      color: '#555',

      marginTop: 10,
    },


    vazioTexto: {
      fontSize: 13,

      color: '#888',

      textAlign: 'center',

      marginTop: 5,
    },


    // ==================================================
    // CARREGANDO
    // ==================================================

    carregando: {
      flex: 1,

      backgroundColor: '#edf1f4',

      alignItems: 'center',

      justifyContent: 'center',
    },


    textoCarregando: {
      marginTop: 12,

      color: '#666',

      fontSize: 14,
    },

  });