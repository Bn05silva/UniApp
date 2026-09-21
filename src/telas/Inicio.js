import React, {
  useCallback,
  useState,
} from 'react';

import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  useAuth,
} from '../contexto/AuthContext';

import {
  carregarBase,
} from '../dados/BaseDados';

import SaudacaoAluno
  from '../inicio/SaudacaoAluno';

import ProximaAula
  from '../inicio/ProximaAula';

import ResumoPresenca
  from '../inicio/ResumoPresenca';

import AcessoRapido
  from '../inicio/AcessoRapido';


const PERFIL_KEY =
  '@uniapp_perfil';

const PRESENCAS_KEY =
  '@uniapp_presencas';


const PERFIL_PADRAO = {
  nome: 'Aluno',
  curso: 'Engenharia de Software',
  periodo: '7º período',
};


// ======================================================
// DIAS DA SEMANA
// ======================================================

const DIAS_SEMANA = {
  Domingo: 0,
  Segunda: 1,
  Terça: 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
  Sábado: 6,
};


// ======================================================
// CALCULAR PRÓXIMA OCORRÊNCIA DA AULA
// ======================================================

function calcularDataProximaAula(
  dia,
  horario
) {
  const agora =
    new Date();

  const diaTurma =
    DIAS_SEMANA[dia];

  if (
    diaTurma === undefined
  ) {
    return null;
  }


  const partesHorario =
    horario.split(':');

  const hora =
    Number(
      partesHorario[0]
    );

  const minuto =
    Number(
      partesHorario[1]
    );


  if (
    Number.isNaN(hora) ||
    Number.isNaN(minuto)
  ) {
    return null;
  }


  const diaAtual =
    agora.getDay();


  let diferencaDias =
    diaTurma -
    diaAtual;


  // Se o dia já passou nesta semana,
  // pula para a próxima semana.
  if (
    diferencaDias < 0
  ) {
    diferencaDias += 7;
  }


  const proximaData =
    new Date(agora);


  proximaData.setDate(
    agora.getDate() +
    diferencaDias
  );


  proximaData.setHours(
    hora,
    minuto,
    0,
    0
  );


  // Se a aula é hoje, mas o horário já passou,
  // considera a aula da próxima semana.
  if (
    proximaData <= agora
  ) {
    proximaData.setDate(
      proximaData.getDate() +
      7
    );
  }


  return proximaData;
}


// ======================================================
// TEXTO "HOJE", "AMANHÃ" OU DIA DA SEMANA
// ======================================================

function obterTextoQuando(
  dataAula
) {
  const hoje =
    new Date();

  const inicioHoje =
    new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    );


  const inicioAula =
    new Date(
      dataAula.getFullYear(),
      dataAula.getMonth(),
      dataAula.getDate()
    );


  const diferenca =
    Math.round(
      (
        inicioAula -
        inicioHoje
      ) /
      (
        1000 *
        60 *
        60 *
        24
      )
    );


  if (
    diferenca === 0
  ) {
    return 'Hoje';
  }


  if (
    diferenca === 1
  ) {
    return 'Amanhã';
  }


  const dias = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];


  return dias[
    dataAula.getDay()
  ];
}


// ======================================================
// TELA
// ======================================================

export default function InicioScreen({
  navigation,
}) {
  const { usuario } =
    useAuth();


  const [
    perfil,
    setPerfil,
  ] = useState(
    PERFIL_PADRAO
  );


  const [
    presencas,
    setPresencas,
  ] = useState([]);


  const [
    proximaAula,
    setProximaAula,
  ] = useState(null);


  // ====================================================
  // ATUALIZAR AO ABRIR A HOME
  // ====================================================

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [usuario])
  );


  // ====================================================
  // CARREGAR DADOS
  // ====================================================

  const carregarDados =
    async () => {
      try {

        // ==============================================
        // PERFIL
        // ==============================================

        const dadosPerfil =
          await AsyncStorage.getItem(
            PERFIL_KEY
          );


        if (dadosPerfil) {
          setPerfil(
            JSON.parse(
              dadosPerfil
            )
          );
        }


        // ==============================================
        // PRESENÇAS
        // ==============================================

        const dadosPresencas =
          await AsyncStorage.getItem(
            PRESENCAS_KEY
          );


        if (dadosPresencas) {
          setPresencas(
            JSON.parse(
              dadosPresencas
            )
          );
        } else {
          setPresencas([]);
        }


        // ==============================================
        // CALCULAR PRÓXIMA AULA
        // ==============================================

        await carregarProximaAula();

      } catch (error) {

        console.log(
          'Erro ao carregar área do aluno.'
        );
      }
    };


  // ====================================================
  // PRÓXIMA AULA
  // ====================================================

  const carregarProximaAula =
    async () => {

      try {

        if (
          !usuario ||
          usuario.tipo !==
            'aluno'
        ) {
          setProximaAula(
            null
          );

          return;
        }


        const base =
          await carregarBase();


        // ==============================================
        // DESCOBRIR TURMAS DO ALUNO
        // ==============================================

        const matriculasAluno =
          base.matriculas.filter(
            (item) =>
              item.matricula ===
              usuario.matricula
          );


        const idsTurmas =
          matriculasAluno.map(
            (item) =>
              item.turmaId
          );


        const turmasAluno =
          base.turmas.filter(
            (turma) =>
              idsTurmas.includes(
                turma.id
              )
          );


        if (
          turmasAluno.length ===
          0
        ) {
          setProximaAula(
            null
          );

          return;
        }


        // ==============================================
        // CALCULAR DATA DE CADA AULA
        // ==============================================

        const aulasCalculadas =
          turmasAluno
            .map(
              (turma) => {

                const dataProxima =
                  calcularDataProximaAula(
                    turma.dia,
                    turma.horario
                  );


                if (!dataProxima) {
                  return null;
                }


                const disciplina =
                  base.disciplinas.find(
                    (item) =>
                      item.id ===
                      turma.disciplinaId
                  );


                const professor =
                  base.professores.find(
                    (item) =>
                      item.identificador ===
                      turma.professorId
                  );


                return {
                  turmaId:
                    turma.id,

                  disciplina:
                    disciplina
                      ? disciplina.nome
                      : 'Disciplina',

                  dia:
                    turma.dia,

                  horario:
                    turma.horario,

                  sala:
                    turma.sala,

                  professor:
                    professor
                      ? professor.nome
                      : null,

                  dataProxima,
                };
              }
            )
            .filter(Boolean);


        if (
          aulasCalculadas.length ===
          0
        ) {
          setProximaAula(
            null
          );

          return;
        }


        // ==============================================
        // ORDENAR DA MAIS PRÓXIMA PARA A MAIS DISTANTE
        // ==============================================

        aulasCalculadas.sort(
          (a, b) =>
            a.dataProxima -
            b.dataProxima
        );


        const aula =
          aulasCalculadas[0];


        // ==============================================
        // MONTAR OBJETO PARA O COMPONENTE
        // ==============================================

        setProximaAula({
          turmaId:
            aula.turmaId,

          disciplina:
            aula.disciplina,

          quando:
            obterTextoQuando(
              aula.dataProxima
            ),

          horario:
            aula.horario,

          sala:
            aula.sala,

          professor:
            aula.professor,
        });

      } catch (error) {

        console.log(
          'Erro ao calcular próxima aula.'
        );

        setProximaAula(
          null
        );
      }
    };


  // ====================================================
  // ÚLTIMA PRESENÇA
  // ====================================================

  const ultimaPresenca =
    presencas.length > 0
      ? presencas[0]
      : null;


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

      <SaudacaoAluno
        perfil={perfil}
      />


      <ProximaAula
        aula={proximaAula}
      />


      <ResumoPresenca
        quantidade={
          presencas.length
        }
        ultimaPresenca={
          ultimaPresenca
        }
      />


      <AcessoRapido
        navigation={
          navigation
        }
      />

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
      padding: 20,

      paddingBottom:
        35,
    },

  });