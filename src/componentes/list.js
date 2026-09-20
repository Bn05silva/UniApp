import React from 'react';

import {
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';


// ======================================================
// ORGANIZAR PRESENÇAS POR DISCIPLINA
// ======================================================

function organizarPorDisciplina(listItems) {
  const grupos = {};

  listItems.forEach((item) => {
    const disciplina =
      item.disciplina ||
      item.aula ||
      'Registros anteriores';

    if (!grupos[disciplina]) {
      grupos[disciplina] = [];
    }

    grupos[disciplina].push(item);
  });

  return Object.keys(grupos).map(
    (disciplina) => ({
      title: disciplina,
      data: grupos[disciplina],
    })
  );
}


// ======================================================
// COMPONENTE
// ======================================================

export default function ListItem({
  listItems,
}) {
  const secoes =
    organizarPorDisciplina(
      listItems
    );


  // ====================================================
  // REGISTRO DE PRESENÇA
  // ====================================================

  const renderItem = ({
    item,
  }) => {

    // Compatibilidade com registros antigos
    if (
      item.task &&
      !item.aluno
    ) {
      return (
        <View
          style={
            styles.itemContainer
          }
        >
          <Text
            style={
              styles.legacyText
            }
          >
            {item.task}
          </Text>
        </View>
      );
    }


    return (
      <View
        style={
          styles.itemContainer
        }
      >
        <View
          style={
            styles.cabecalhoRegistro
          }
        >
          <View>
            <Text
              style={
                styles.data
              }
            >
              {item.data}
            </Text>

            <Text
              style={
                styles.hora
              }
            >
              {item.hora}
            </Text>
          </View>

          <View
            style={
              styles.statusContainer
            }
          >
            <Text
              style={
                styles.status
              }
            >
              Presença confirmada
            </Text>
          </View>
        </View>


        <View
          style={
            styles.divisor
          }
        />


        {item.professor && (
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
              Professor
            </Text>

            <Text
              style={
                styles.valor
              }
            >
              {item.professor}
            </Text>
          </View>
        )}


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
      </View>
    );
  };


  // ====================================================
  // HISTÓRICO VAZIO
  // ====================================================

  const renderVazio = () => (
    <View
      style={
        styles.emptyContainer
      }
    >
      <Text
        style={
          styles.emptyTitle
        }
      >
        Nenhuma presença registrada
      </Text>

      <Text
        style={
          styles.emptyText
        }
      >
        As presenças confirmadas
        aparecerão aqui.
      </Text>
    </View>
  );


  // ====================================================
  // TELA
  // ====================================================

  return (
    <View
      style={
        styles.container
      }
    >
      <Text
        style={
          styles.sectionTitle
        }
      >
        Histórico de presenças
      </Text>

      {listItems.length === 0 ? (
        renderVazio()
      ) : (
        <SectionList
          sections={
            secoes
          }

          keyExtractor={(
            item,
            index
          ) =>
            item.id ||
            index.toString()
          }

          renderItem={
            renderItem
          }

          renderSectionHeader={({
            section,
          }) => (
            <View
              style={
                styles.disciplinaContainer
              }
            >
              <Text
                style={
                  styles.disciplina
                }
              >
                {section.title}
              </Text>

              <Text
                style={
                  styles.quantidade
                }
              >
                {
                  section.data
                    .length
                }{' '}
                {section.data
                  .length === 1
                  ? 'presença'
                  : 'presenças'}
              </Text>
            </View>
          )}

          showsVerticalScrollIndicator={
            false
          }

          contentContainerStyle={
            styles.lista
          }

          stickySectionHeadersEnabled={
            false
          }
        />
      )}
    </View>
  );
}


// ======================================================
// ESTILOS
// ======================================================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      marginTop: 10,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#222',
      marginBottom: 14,
    },

    lista: {
      paddingBottom: 30,
    },


    // ==================================================
    // DISCIPLINA
    // ==================================================

    disciplinaContainer: {
      marginBottom: 8,
      marginTop: 5,
    },

    disciplina: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#a2181c',
    },

    quantidade: {
      fontSize: 12,
      color: '#777',
      marginTop: 2,
    },


    // ==================================================
    // CARD
    // ==================================================

    itemContainer: {
      backgroundColor: '#fff',

      padding: 15,

      borderRadius: 12,

      marginBottom: 12,

      borderLeftWidth: 4,

      borderLeftColor:
        '#a2181c',

      elevation: 1,

      shadowColor: '#000',

      shadowOpacity: 0.05,

      shadowRadius: 3,

      shadowOffset: {
        width: 0,
        height: 1,
      },
    },

    cabecalhoRegistro: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    data: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
    },

    hora: {
      fontSize: 12,
      color: '#777',
      marginTop: 2,
    },


    // ==================================================
    // STATUS
    // ==================================================

    statusContainer: {
      backgroundColor:
        '#e7f5ef',

      paddingHorizontal: 10,

      paddingVertical: 6,

      borderRadius: 20,
    },

    status: {
      color: '#27865c',
      fontSize: 11,
      fontWeight: 'bold',
    },


    // ==================================================
    // INFORMAÇÕES
    // ==================================================

    divisor: {
      height: 1,

      backgroundColor:
        '#eeeeee',

      marginVertical: 12,
    },

    linha: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      marginBottom: 7,
    },

    label: {
      fontSize: 13,
      color: '#777',
    },

    valor: {
      fontSize: 13,
      color: '#333',
      fontWeight: '600',

      maxWidth: '65%',

      textAlign: 'right',
    },


    // ==================================================
    // REGISTROS ANTIGOS
    // ==================================================

    legacyText: {
      fontSize: 13,
      color: '#333',
    },


    // ==================================================
    // VAZIO
    // ==================================================

    emptyContainer: {
      backgroundColor: '#fff',

      borderRadius: 12,

      padding: 25,

      alignItems: 'center',
    },

    emptyTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#555',
    },

    emptyText: {
      marginTop: 5,

      fontSize: 13,

      color: '#888',

      textAlign: 'center',
    },
  });