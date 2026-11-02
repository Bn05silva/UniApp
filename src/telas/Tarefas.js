import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
  alterarStatusTarefa,
  atualizarTarefa,
  criarTarefa,
  inicializarBanco,
  listarTarefas,
  removerTarefa,
} from '../banco/sqlite';

import {
  sincronizarTarefas,
} from '../servicos/sincronizacao';

import {
  removerTarefaAPI,
} from '../servicos/tarefasApi';


export default function TarefasScreen() {
  const [
    tarefas,
    setTarefas,
  ] = useState([]);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    sincronizando,
    setSincronizando,
  ] = useState(false);

  const [
    modalVisivel,
    setModalVisivel,
  ] = useState(false);

  const [
    tarefaEditando,
    setTarefaEditando,
  ] = useState(null);

  const [
    titulo,
    setTitulo,
  ] = useState('');

  const [
    descricao,
    setDescricao,
  ] = useState('');

  const [
    disciplina,
    setDisciplina,
  ] = useState('');

  const [
    dataEntrega,
    setDataEntrega,
  ] = useState('');


  useEffect(
    () => {
      prepararBanco();
    },
    []
  );


  const carregarTarefas =
    async () => {

      try {

        const dados =
          await listarTarefas();

        setTarefas(
          dados
        );

      } catch (error) {

        Alert.alert(
          'Erro',
          'Não foi possível carregar as tarefas.'
        );

      } finally {

        setCarregando(
          false
        );
      }
    };


  const executarSincronizacao =
    async (
      exibirMensagem = false
    ) => {

      if (
        sincronizando
      ) {
        return;
      }

      try {

        setSincronizando(
          true
        );

        const resultado =
          await sincronizarTarefas();

        await carregarTarefas();

        if (
          !exibirMensagem
        ) {
          return;
        }

        if (
          !resultado.online
        ) {

          Alert.alert(
            'Modo offline',
            'A API está indisponível. As tarefas continuam salvas no SQLite e poderão ser sincronizadas depois.'
          );

          return;
        }

        if (
          resultado.erros > 0
        ) {

          Alert.alert(
            'Sincronização parcial',
            `${resultado.sincronizadas} tarefa(s) sincronizada(s) e ${resultado.erros} com erro.`
          );

          return;
        }

        if (
          resultado.sincronizadas === 0
        ) {

          Alert.alert(
            'Sincronização',
            'Todas as tarefas já estão sincronizadas.'
          );

          return;
        }

        Alert.alert(
          'Sincronização concluída',
          `${resultado.sincronizadas} tarefa(s) sincronizada(s) com sucesso.`
        );

      } catch (error) {

        if (
          exibirMensagem
        ) {

          Alert.alert(
            'Erro',
            'Não foi possível sincronizar as tarefas.'
          );
        }

      } finally {

        setSincronizando(
          false
        );
      }
    };


  const prepararBanco =
    async () => {

      try {

        await inicializarBanco();

        await carregarTarefas();

        await executarSincronizacao(
          false
        );

      } catch (error) {

        Alert.alert(
          'Erro',
          'Não foi possível iniciar o banco de dados.'
        );

        setCarregando(
          false
        );
      }
    };


  const limparFormulario =
    () => {

      setTitulo('');

      setDescricao('');

      setDisciplina('');

      setDataEntrega('');

      setTarefaEditando(
        null
      );
    };


  const abrirNovaTarefa =
    () => {

      limparFormulario();

      setModalVisivel(
        true
      );
    };


  const abrirEdicao =
    (
      tarefa
    ) => {

      setTarefaEditando(
        tarefa
      );

      setTitulo(
        tarefa.titulo
      );

      setDescricao(
        tarefa.descricao || ''
      );

      setDisciplina(
        tarefa.disciplina || ''
      );

      setDataEntrega(
        tarefa.dataEntrega || ''
      );

      setModalVisivel(
        true
      );
    };


  const fecharModal =
    () => {

      setModalVisivel(
        false
      );

      limparFormulario();
    };


  const salvarTarefa =
    async () => {

      if (
        !titulo.trim()
      ) {

        Alert.alert(
          'Atenção',
          'Informe o título da tarefa.'
        );

        return;
      }

      try {

        if (
          tarefaEditando
        ) {

          await atualizarTarefa(
            tarefaEditando.id,
            {
              titulo,
              descricao,
              disciplina,
              dataEntrega,
            }
          );

        } else {

          await criarTarefa({
            titulo,
            descricao,
            disciplina,
            dataEntrega,
          });
        }

        fecharModal();

        await carregarTarefas();

        await executarSincronizacao(
          false
        );

      } catch (error) {

        Alert.alert(
          'Erro',
          'Não foi possível salvar a tarefa.'
        );
      }
    };


  const alternarStatus =
    async (
      tarefa
    ) => {

      try {

        await alterarStatusTarefa(
          tarefa.id,
          !tarefa.concluida
        );

        await carregarTarefas();

        await executarSincronizacao(
          false
        );

      } catch (error) {

        Alert.alert(
          'Erro',
          'Não foi possível atualizar a tarefa.'
        );
      }
    };


  const confirmarExclusao =
    (
      tarefa
    ) => {

      Alert.alert(
        'Excluir tarefa',
        `Deseja excluir "${tarefa.titulo}"?`,
        [
          {
            text:
              'Cancelar',
            style:
              'cancel',
          },
          {
            text:
              'Excluir',
            style:
              'destructive',
            onPress:
              () =>
                excluirTarefa(
                  tarefa
                ),
          },
        ]
      );
    };


  const excluirTarefa =
    async (
      tarefa
    ) => {

      try {

        if (
          tarefa.remoteId
        ) {

          try {

            await removerTarefaAPI(
              tarefa.remoteId
            );

          } catch (error) {

            Alert.alert(
              'API indisponível',
              'Essa tarefa já está sincronizada e não foi possível removê-la do servidor. Tente novamente quando estiver online.'
            );

            return;
          }
        }

        await removerTarefa(
          tarefa.id
        );

        await carregarTarefas();

      } catch (error) {

        Alert.alert(
          'Erro',
          'Não foi possível excluir a tarefa.'
        );
      }
    };


  const renderTarefa =
    ({
      item,
    }) => {

      const sincronizada =
        Boolean(
          item.sincronizado &&
          item.remoteId
        );

      return (
        <View
          style={[
            styles.card,
            item.concluida &&
              styles.cardConcluido,
          ]}
        >

          <View
            style={
              styles.cardTopo
            }
          >

            <TouchableOpacity
              style={[
                styles.statusBotao,
                item.concluida &&
                  styles.statusBotaoAtivo,
              ]}
              onPress={
                () =>
                  alternarStatus(
                    item
                  )
              }
            >

              <Ionicons
                name={
                  item.concluida
                    ? 'checkmark'
                    : 'ellipse-outline'
                }
                size={20}
                color={
                  item.concluida
                    ? '#ffffff'
                    : '#a2181c'
                }
              />

            </TouchableOpacity>


            <View
              style={
                styles.cardConteudo
              }
            >

              <Text
                style={[
                  styles.tituloTarefa,
                  item.concluida &&
                    styles.textoConcluido,
                ]}
              >
                {
                  item.titulo
                }
              </Text>

              {
                item.disciplina
                  ? (
                    <Text
                      style={
                        styles.disciplina
                      }
                    >
                      {
                        item.disciplina
                      }
                    </Text>
                  )
                  : null
              }

            </View>


            <TouchableOpacity
              style={
                styles.acaoBotao
              }
              onPress={
                () =>
                  abrirEdicao(
                    item
                  )
              }
            >

              <Ionicons
                name="create-outline"
                size={20}
                color="#555555"
              />

            </TouchableOpacity>


            <TouchableOpacity
              style={
                styles.acaoBotao
              }
              onPress={
                () =>
                  confirmarExclusao(
                    item
                  )
              }
            >

              <Ionicons
                name="trash-outline"
                size={20}
                color="#b3261e"
              />

            </TouchableOpacity>

          </View>


          {
            item.descricao
              ? (
                <Text
                  style={
                    styles.descricao
                  }
                >
                  {
                    item.descricao
                  }
                </Text>
              )
              : null
          }


          <View
            style={
              styles.cardRodape
            }
          >

            {
              item.dataEntrega
                ? (
                  <View
                    style={
                      styles.info
                    }
                  >

                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color="#777777"
                    />

                    <Text
                      style={
                        styles.infoTexto
                      }
                    >
                      {
                        item.dataEntrega
                      }
                    </Text>

                  </View>
                )
                : (
                  <View />
                )
            }


            <View
              style={[
                styles.sincronizacao,
                sincronizada
                  ? styles.sincronizado
                  : styles.pendente,
              ]}
            >

              <View
                style={[
                  styles.ponto,
                  sincronizada
                    ? styles.pontoSincronizado
                    : styles.pontoPendente,
                ]}
              />

              <Text
                style={[
                  styles.sincronizacaoTexto,
                  sincronizada
                    ? styles.textoSincronizado
                    : styles.textoPendente,
                ]}
              >
                {
                  sincronizada
                    ? 'Sincronizada'
                    : 'Pendente'
                }
              </Text>

            </View>

          </View>

        </View>
      );
    };


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
            styles.carregandoTexto
          }
        >
          Carregando tarefas...
        </Text>

      </View>
    );
  }


  return (
    <View
      style={
        styles.container
      }
    >

      <View
        style={
          styles.cabecalho
        }
      >

        <View
          style={
            styles.cabecalhoTexto
          }
        >

          <Text
            style={
              styles.tituloPagina
            }
          >
            Minhas tarefas
          </Text>

          <Text
            style={
              styles.subtituloPagina
            }
          >
            Organize suas atividades acadêmicas
          </Text>

        </View>


        <View
          style={
            styles.cabecalhoAcoes
          }
        >

          <TouchableOpacity
            style={
              styles.botaoSincronizar
            }
            disabled={
              sincronizando
            }
            onPress={
              () =>
                executarSincronizacao(
                  true
                )
            }
          >

            {
              sincronizando
                ? (
                  <ActivityIndicator
                    size="small"
                    color="#a2181c"
                  />
                )
                : (
                  <Ionicons
                    name="cloud-upload-outline"
                    size={22}
                    color="#a2181c"
                  />
                )
            }

          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.botaoAdicionar
            }
            onPress={
              abrirNovaTarefa
            }
          >

            <Ionicons
              name="add"
              size={25}
              color="#ffffff"
            />

          </TouchableOpacity>

        </View>

      </View>


      <FlatList
        data={
          tarefas
        }
        keyExtractor={
          (
            item
          ) =>
            String(
              item.id
            )
        }
        renderItem={
          renderTarefa
        }
        contentContainerStyle={
          tarefas.length === 0
            ? styles.listaVaziaContainer
            : styles.lista
        }
        showsVerticalScrollIndicator={
          false
        }
        ListEmptyComponent={
          <View
            style={
              styles.listaVazia
            }
          >

            <View
              style={
                styles.iconeVazio
              }
            >

              <Ionicons
                name="clipboard-outline"
                size={42}
                color="#a2181c"
              />

            </View>

            <Text
              style={
                styles.vazioTitulo
              }
            >
              Nenhuma tarefa cadastrada
            </Text>

            <Text
              style={
                styles.vazioTexto
              }
            >
              Adicione sua primeira tarefa acadêmica.
            </Text>


            <TouchableOpacity
              style={
                styles.botaoPrimeiraTarefa
              }
              onPress={
                abrirNovaTarefa
              }
            >

              <Ionicons
                name="add"
                size={18}
                color="#ffffff"
              />

              <Text
                style={
                  styles.botaoPrimeiraTarefaTexto
                }
              >
                Nova tarefa
              </Text>

            </TouchableOpacity>

          </View>
        }
      />


      <Modal
        visible={
          modalVisivel
        }
        transparent
        animationType="slide"
        onRequestClose={
          fecharModal
        }
      >

        <KeyboardAvoidingView
          style={
            styles.modalFundo
          }
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
        >

          <View
            style={
              styles.modal
            }
          >

            <View
              style={
                styles.modalTopo
              }
            >

              <Text
                style={
                  styles.modalTitulo
                }
              >
                {
                  tarefaEditando
                    ? 'Editar tarefa'
                    : 'Nova tarefa'
                }
              </Text>


              <TouchableOpacity
                onPress={
                  fecharModal
                }
              >

                <Ionicons
                  name="close"
                  size={25}
                  color="#555555"
                />

              </TouchableOpacity>

            </View>


            <Text
              style={
                styles.label
              }
            >
              Título
            </Text>

            <TextInput
              style={
                styles.input
              }
              value={
                titulo
              }
              onChangeText={
                setTitulo
              }
              placeholder="Ex: Trabalho de Segurança"
              placeholderTextColor="#aaaaaa"
            />


            <Text
              style={
                styles.label
              }
            >
              Disciplina
            </Text>

            <TextInput
              style={
                styles.input
              }
              value={
                disciplina
              }
              onChangeText={
                setDisciplina
              }
              placeholder="Ex: Segurança e Auditoria"
              placeholderTextColor="#aaaaaa"
            />


            <Text
              style={
                styles.label
              }
            >
              Data de entrega
            </Text>

            <TextInput
              style={
                styles.input
              }
              value={
                dataEntrega
              }
              onChangeText={
                setDataEntrega
              }
              placeholder="Ex: 15/11/2026"
              placeholderTextColor="#aaaaaa"
              keyboardType="numbers-and-punctuation"
            />


            <Text
              style={
                styles.label
              }
            >
              Descrição
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.inputDescricao,
              ]}
              value={
                descricao
              }
              onChangeText={
                setDescricao
              }
              placeholder="Detalhes da tarefa"
              placeholderTextColor="#aaaaaa"
              multiline
              textAlignVertical="top"
            />


            <TouchableOpacity
              style={
                styles.botaoSalvar
              }
              onPress={
                salvarTarefa
              }
            >

              <Ionicons
                name="save-outline"
                size={18}
                color="#ffffff"
              />

              <Text
                style={
                  styles.botaoSalvarTexto
                }
              >
                {
                  tarefaEditando
                    ? 'Salvar alterações'
                    : 'Adicionar tarefa'
                }
              </Text>

            </TouchableOpacity>

          </View>

        </KeyboardAvoidingView>

      </Modal>

    </View>
  );
}


const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#edf1f4',
    },

    cabecalho: {
      paddingHorizontal: 20,
      paddingTop: 22,
      paddingBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    cabecalhoTexto: {
      flex: 1,
    },

    cabecalhoAcoes: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },

    tituloPagina: {
      fontSize: 23,
      fontWeight: '800',
      color: '#222222',
    },

    subtituloPagina: {
      fontSize: 12,
      color: '#777777',
      marginTop: 3,
    },

    botaoSincronizar: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#dedede',
      alignItems: 'center',
      justifyContent: 'center',
    },

    botaoAdicionar: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: '#a2181c',
      alignItems: 'center',
      justifyContent: 'center',
    },

    lista: {
      paddingHorizontal: 20,
      paddingBottom: 30,
    },

    card: {
      backgroundColor: '#ffffff',
      borderRadius: 14,
      padding: 15,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#e7e7e7',
      elevation: 2,
      shadowColor: '#000000',
      shadowOpacity: 0.05,
      shadowRadius: 5,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },

    cardConcluido: {
      opacity: 0.65,
    },

    cardTopo: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    statusBotao: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: '#a2181c',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 11,
    },

    statusBotaoAtivo: {
      backgroundColor: '#a2181c',
    },

    cardConteudo: {
      flex: 1,
    },

    tituloTarefa: {
      fontSize: 15,
      fontWeight: '800',
      color: '#222222',
    },

    textoConcluido: {
      textDecorationLine: 'line-through',
    },

    disciplina: {
      fontSize: 12,
      color: '#a2181c',
      fontWeight: '600',
      marginTop: 3,
    },

    acaoBotao: {
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },

    descricao: {
      fontSize: 13,
      color: '#666666',
      lineHeight: 19,
      marginTop: 12,
    },

    cardRodape: {
      marginTop: 14,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#eeeeee',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    info: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },

    infoTexto: {
      fontSize: 11,
      color: '#777777',
    },

    sincronizacao: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
      gap: 5,
    },

    pendente: {
      backgroundColor: '#fff5df',
    },

    sincronizado: {
      backgroundColor: '#e9f7ee',
    },

    ponto: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },

    pontoPendente: {
      backgroundColor: '#d68b00',
    },

    pontoSincronizado: {
      backgroundColor: '#218c4f',
    },

    sincronizacaoTexto: {
      fontSize: 10,
      fontWeight: '700',
    },

    textoPendente: {
      color: '#a56b00',
    },

    textoSincronizado: {
      color: '#218c4f',
    },

    carregando: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#edf1f4',
    },

    carregandoTexto: {
      fontSize: 13,
      color: '#777777',
      marginTop: 10,
    },

    listaVaziaContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingBottom: 80,
    },

    listaVazia: {
      alignItems: 'center',
    },

    iconeVazio: {
      width: 78,
      height: 78,
      borderRadius: 39,
      backgroundColor: '#f5dfe0',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },

    vazioTitulo: {
      fontSize: 17,
      fontWeight: '800',
      color: '#333333',
    },

    vazioTexto: {
      fontSize: 12,
      color: '#777777',
      textAlign: 'center',
      marginTop: 5,
    },

    botaoPrimeiraTarefa: {
      marginTop: 20,
      backgroundColor: '#a2181c',
      borderRadius: 10,
      paddingHorizontal: 18,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },

    botaoPrimeiraTarefaTexto: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '700',
    },

    modalFundo: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      justifyContent: 'flex-end',
    },

    modal: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 30,
    },

    modalTopo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },

    modalTitulo: {
      fontSize: 20,
      fontWeight: '800',
      color: '#222222',
    },

    label: {
      fontSize: 12,
      color: '#555555',
      fontWeight: '700',
      marginBottom: 6,
    },

    input: {
      minHeight: 46,
      backgroundColor: '#f7f7f7',
      borderWidth: 1,
      borderColor: '#dddddd',
      borderRadius: 10,
      paddingHorizontal: 12,
      fontSize: 14,
      color: '#222222',
      marginBottom: 14,
    },

    inputDescricao: {
      height: 90,
      paddingTop: 12,
    },

    botaoSalvar: {
      backgroundColor: '#a2181c',
      minHeight: 48,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      marginTop: 4,
    },

    botaoSalvarTexto: {
      color: '#ffffff',
      fontWeight: '700',
      fontSize: 14,
    },

  });