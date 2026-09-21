import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AsyncStorage
  from '@react-native-async-storage/async-storage';

import LeitorCamera
  from '../camera/camera';

import ListItem
  from '../componentes/list';

import {
  obterLocalizacaoAtual,
} from '../gps/gps';

import {
  carregarBase,
} from '../dados/BaseDados';

import {
  useAuth,
} from '../contexto/AuthContext';


// ======================================================
// CONFIGURAÇÕES
// ======================================================

const FACULDADE_LAT =
  -22.40944;

const FACULDADE_LONG =
  -43.66326;

const RAIO_PERMITIDO_METROS =
  150;


// ======================================================
// CHAVE DE PRESENÇA POR ALUNO
// ======================================================

function obterStorageKey(
  matricula
) {
  return `@uniapp_presencas_${matricula}`;
}


// ======================================================
// CALCULAR DISTÂNCIA
// ======================================================

function calcularDistancia(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R =
    6371e3;

  const dLat =
    ((lat2 - lat1) *
      Math.PI) /
    180;

  const dLon =
    ((lon2 - lon1) *
      Math.PI) /
    180;

  const a =
    Math.sin(
      dLat / 2
    ) *
      Math.sin(
        dLat / 2
      ) +
    Math.cos(
      (lat1 *
        Math.PI) /
        180
    ) *
      Math.cos(
        (lat2 *
          Math.PI) /
          180
      ) *
      Math.sin(
        dLon / 2
      ) *
      Math.sin(
        dLon / 2
      );

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(
        1 - a
      )
    );

  return R * c;
}


// ======================================================
// DATA YYYY-MM-DD
// ======================================================

function obterDataISO() {
  const agora =
    new Date();

  const ano =
    agora.getFullYear();

  const mes =
    String(
      agora.getMonth() +
        1
    ).padStart(
      2,
      '0'
    );

  const dia =
    String(
      agora.getDate()
    ).padStart(
      2,
      '0'
    );

  return `${ano}-${mes}-${dia}`;
}


// ======================================================
// TELA
// ======================================================

export default function PresencaScreen() {
  const { usuario } =
    useAuth();


  const [
    listItems,
    setListItems,
  ] = useState([]);


  const [
    validando,
    setValidando,
  ] = useState(false);


  const [
    ultimaMensagem,
    setUltimaMensagem,
  ] = useState(null);


  // ====================================================
  // CARREGAR HISTÓRICO
  // ====================================================

  useEffect(() => {
    carregarPresencas();
  }, [
    usuario?.matricula,
  ]);


  const carregarPresencas =
    async () => {

      try {

        if (
          !usuario ||
          usuario.tipo !==
            'aluno'
        ) {
          setListItems(
            []
          );

          return;
        }


        const storageKey =
          obterStorageKey(
            usuario.matricula
          );


        const dados =
          await AsyncStorage.getItem(
            storageKey
          );


        if (dados) {

          setListItems(
            JSON.parse(
              dados
            )
          );

        } else {

          setListItems(
            []
          );
        }

      } catch (error) {

        setListItems(
          []
        );

        setUltimaMensagem({
          tipo:
            'erro',

          texto:
            'Não foi possível carregar o histórico de presenças.',
        });
      }
    };


  // ====================================================
  // SALVAR HISTÓRICO
  // ====================================================

  const salvarPresencas =
    async (novaLista) => {

      try {

        if (
          !usuario?.matricula
        ) {
          return false;
        }


        const storageKey =
          obterStorageKey(
            usuario.matricula
          );


        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(
            novaLista
          )
        );


        setListItems(
          novaLista
        );


        return true;

      } catch (error) {

        setUltimaMensagem({
          tipo:
            'erro',

          texto:
            'Não foi possível salvar a presença.',
        });


        return false;
      }
    };


  // ====================================================
  // PROCESSAR QR CODE
  // ====================================================

  const processarQRCode =
    async (conteudoQR) => {

      if (validando) {
        return;
      }


      setValidando(
        true
      );

      setUltimaMensagem(
        null
      );


      try {

        // ================================================
        // USUÁRIO
        // ================================================

        if (
          !usuario ||
          usuario.tipo !==
            'aluno'
        ) {

          throw new Error(
            'Somente alunos podem registrar presença.'
          );
        }


        // ================================================
        // LER QR
        // ================================================

        let dadosQR;


        try {

          dadosQR =
            JSON.parse(
              conteudoQR
            );

        } catch (error) {

          throw new Error(
            'QR Code inválido. Leia o código exibido pelo professor.'
          );
        }


        // ================================================
        // VALIDAR TIPO
        // ================================================

        if (
          dadosQR.tipo !==
          'presenca'
        ) {

          throw new Error(
            'QR Code inválido. Leia o código exibido pelo professor.'
          );
        }


        // ================================================
        // VALIDAR CAMPOS
        // ================================================

        if (
          !dadosQR.turmaId ||
          !dadosQR.professorId ||
          !dadosQR.sessao
        ) {

          throw new Error(
            'Este QR Code não possui os dados necessários para registrar presença.'
          );
        }


        // ================================================
        // VALIDAR EXPIRAÇÃO
        // ================================================

        if (
          typeof dadosQR.expiraEm !==
          'number'
        ) {

          throw new Error(
            'Este QR Code não possui uma validade definida.'
          );
        }


        const agora =
          Date.now();


        if (
          agora >
          dadosQR.expiraEm
        ) {

          throw new Error(
            'Este QR Code expirou. Solicite ao professor um novo código.'
          );
        }


        // ================================================
        // VALIDAR DATA
        // ================================================

        const dataHoje =
          obterDataISO();


        if (
          dadosQR.data !==
          dataHoje
        ) {

          throw new Error(
            'Este QR Code não corresponde à aula de hoje.'
          );
        }


        // ================================================
        // CARREGAR BASE
        // ================================================

        const base =
          await carregarBase();


        // ================================================
        // VALIDAR TURMA
        // ================================================

        const turma =
          base.turmas.find(
            (item) =>
              item.id ===
              dadosQR.turmaId
          );


        if (!turma) {

          throw new Error(
            'Esta turma não foi encontrada.'
          );
        }


        // ================================================
        // ALUNO MATRICULADO?
        // ================================================

        const matriculado =
          base.matriculas.some(
            (item) =>
              item.matricula ===
                usuario.matricula &&
              item.turmaId ===
                turma.id
          );


        if (!matriculado) {

          throw new Error(
            'Você não está matriculado nesta turma.'
          );
        }


        // ================================================
        // PROFESSOR CORRESPONDE?
        // ================================================

        if (
          dadosQR.professorId !==
          turma.professorId
        ) {

          throw new Error(
            'Este QR Code não corresponde ao professor da turma.'
          );
        }


        // ================================================
        // DATA VISUAL
        // ================================================

        const dataAtual =
          new Date()
            .toLocaleDateString(
              'pt-BR'
            );


        // ================================================
        // EVITAR MESMA SESSÃO
        // ================================================

        const mesmaSessao =
          listItems.some(
            (item) =>
              item.sessao ===
                dadosQR.sessao &&
              item.matricula ===
                usuario.matricula
          );


        if (mesmaSessao) {

          throw new Error(
            'Sua presença nesta aula já foi registrada.'
          );
        }


        // ================================================
        // EVITAR OUTRO QR DA MESMA TURMA NO MESMO DIA
        // ================================================

        const presencaDoDia =
          listItems.some(
            (item) => {

              const mesmaTurma =
                item.turmaId ===
                turma.id;


              const mesmaData =
                item.dataISO ===
                  dataHoje ||
                (
                  !item.dataISO &&
                  item.data ===
                    dataAtual
                );


              return (
                mesmaTurma &&
                mesmaData
              );
            }
          );


        if (presencaDoDia) {

          throw new Error(
            'Sua presença nesta disciplina já foi registrada hoje.'
          );
        }


        // ================================================
        // LOCALIZAÇÃO AUTOMÁTICA
        // ================================================

        const localizacao =
          await obterLocalizacaoAtual();


        if (
          !localizacao.ok
        ) {

          throw new Error(
            localizacao.erro
          );
        }


        // ================================================
        // DISTÂNCIA
        // ================================================

        const distancia =
          calcularDistancia(
            localizacao
              .coords
              .latitude,

            localizacao
              .coords
              .longitude,

            FACULDADE_LAT,

            FACULDADE_LONG
          );


        // ================================================
        // RAIO DE 150 METROS
        // ================================================

        if (
          distancia >
          RAIO_PERMITIDO_METROS
        ) {

          throw new Error(
            `Presença não permitida. Você está a ${Math.round(
              distancia
            )} m do campus.`
          );
        }


        // ================================================
        // DISCIPLINA
        // ================================================

        const disciplina =
          base.disciplinas.find(
            (item) =>
              item.id ===
              turma.disciplinaId
          );


        if (!disciplina) {

          throw new Error(
            'Não foi possível identificar a disciplina.'
          );
        }


        // ================================================
        // PROFESSOR
        // ================================================

        const professor =
          base.professores.find(
            (item) =>
              item.identificador ===
              turma.professorId
          );


        // ================================================
        // HORA
        // ================================================

        const agoraData =
          new Date();


        const horaAtual =
          agoraData.toLocaleTimeString(
            'pt-BR',
            {
              hour:
                '2-digit',

              minute:
                '2-digit',
            }
          );


        // ================================================
        // CRIAR REGISTRO
        // ================================================

        const novoRegistro = {

          id:
            Date.now()
              .toString(),

          sessao:
            dadosQR.sessao,

          aluno:
            usuario.nome,

          matricula:
            usuario.matricula,

          turmaId:
            turma.id,

          disciplinaId:
            disciplina.id,

          disciplina:
            disciplina.nome,

          aula:
            disciplina.nome,

          professor:
            professor
              ? professor.nome
              : turma.professorId,

          sala:
            turma.sala,

          status:
            'Presença confirmada',

          distancia:
            Math.round(
              distancia
            ),

          latitude:
            localizacao
              .coords
              .latitude,

          longitude:
            localizacao
              .coords
              .longitude,

          data:
            dataAtual,

          dataISO:
            dataHoje,

          hora:
            horaAtual,

          registradoEm:
            Date.now(),
        };


        // ================================================
        // SALVAR
        // ================================================

        const novaLista = [
          novoRegistro,
          ...listItems,
        ];


        const salvo =
          await salvarPresencas(
            novaLista
          );


        if (!salvo) {
          return;
        }


        // ================================================
        // SUCESSO
        // ================================================

        setUltimaMensagem({

          tipo:
            'sucesso',

          texto:
            `Presença confirmada em ${disciplina.nome} às ${horaAtual}.`,

        });

      } catch (error) {

        setUltimaMensagem({

          tipo:
            'erro',

          texto:
            error.message,

        });

      } finally {

        setValidando(
          false
        );
      }
    };


  // ====================================================
  // TELA
  // ====================================================

  return (
    <View
      style={
        styles.container
      }
    >

      <View
        style={
          styles.cardInformacao
        }
      >

        <Text
          style={
            styles.titulo
          }
        >
          Registrar presença
        </Text>


        <Text
          style={
            styles.descricao
          }
        >
          Leia o QR Code exibido pelo professor.
          Sua localização será verificada automaticamente
          no momento da leitura.
        </Text>


        <View
          style={
            styles.alunoContainer
          }
        >

          <Text
            style={
              styles.alunoLabel
            }
          >
            Aluno
          </Text>


          <Text
            style={
              styles.alunoNome
            }
          >
            {usuario?.nome}
          </Text>


          <Text
            style={
              styles.matricula
            }
          >
            Matrícula {usuario?.matricula}
          </Text>

        </View>

      </View>


      <LeitorCamera
        onScanned={
          processarQRCode
        }
        bloqueado={
          validando
        }
      />


      {validando && (

        <View
          style={
            styles.validando
          }
        >

          <ActivityIndicator
            size="small"
            color="#a2181c"
          />


          <Text
            style={
              styles.textoValidando
            }
          >
            Verificando QR Code e localização...
          </Text>

        </View>

      )}


      {ultimaMensagem && (

        <View
          style={[
            styles.mensagem,

            ultimaMensagem.tipo ===
            'sucesso'
              ? styles.mensagemSucesso
              : styles.mensagemErro,
          ]}
        >

          <Text
            style={[
              styles.textoMensagem,

              ultimaMensagem.tipo ===
              'sucesso'
                ? styles.textoSucesso
                : styles.textoErro,
            ]}
          >
            {ultimaMensagem.texto}
          </Text>

        </View>

      )}


      <ListItem
        listItems={
          listItems
        }
      />

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

      backgroundColor:
        '#edf1f4',

      padding: 20,
    },


    cardInformacao: {
      backgroundColor:
        '#fff',

      borderRadius:
        14,

      padding:
        18,

      marginBottom:
        15,

      elevation:
        1,

      shadowColor:
        '#000',

      shadowOpacity:
        0.05,

      shadowRadius:
        3,

      shadowOffset: {
        width: 0,
        height: 1,
      },
    },


    titulo: {
      fontSize:
        21,

      fontWeight:
        'bold',

      color:
        '#222',

      marginBottom:
        6,
    },


    descricao: {
      fontSize:
        13,

      color:
        '#666',

      lineHeight:
        19,
    },


    alunoContainer: {
      marginTop:
        16,

      paddingTop:
        14,

      borderTopWidth:
        1,

      borderTopColor:
        '#eeeeee',
    },


    alunoLabel: {
      fontSize:
        12,

      color:
        '#888',
    },


    alunoNome: {
      fontSize:
        15,

      fontWeight:
        'bold',

      color:
        '#222',

      marginTop:
        2,
    },


    matricula: {
      fontSize:
        13,

      color:
        '#777',

      marginTop:
        2,
    },


    validando: {
      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#fff',

      borderRadius:
        10,

      padding:
        12,

      marginBottom:
        12,
    },


    textoValidando: {
      marginLeft:
        10,

      color:
        '#555',

      fontSize:
        13,

      fontWeight:
        '600',
    },


    mensagem: {
      borderRadius:
        10,

      padding:
        12,

      marginBottom:
        12,
    },


    mensagemSucesso: {
      backgroundColor:
        '#e7f5ef',
    },


    mensagemErro: {
      backgroundColor:
        '#fdeaea',
    },


    textoMensagem: {
      fontSize:
        13,

      fontWeight:
        '600',
    },


    textoSucesso: {
      color:
        '#27865c',
    },


    textoErro: {
      color:
        '#a2181c',
    },

  });