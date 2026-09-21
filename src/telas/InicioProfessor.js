import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useAuth,
} from '../contexto/AuthContext';

import {
  carregarBase,
} from '../dados/BaseDados';

import TurmaProfessorCard
  from '../professor/TurmaProfessorCard';

export default function InicioProfessorScreen() {
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


  // ======================================================
  // CARREGAR TURMAS
  // ======================================================

  useEffect(() => {
    carregarTurmasProfessor();
  }, []);


  const carregarTurmasProfessor =
    async () => {
      try {
        setCarregando(true);

        const base =
          await carregarBase();


        // ================================================
        // FILTRAR TURMAS DO PROFESSOR
        // ================================================

        const turmasProfessor =
          base.turmas.filter(
            (turma) =>
              turma.professorId ===
              usuario.identificador
          );


        // ================================================
        // ADICIONAR NOME DA DISCIPLINA
        // E QUANTIDADE DE ALUNOS
        // ================================================

        const turmasCompletas =
          turmasProfessor.map(
            (turma) => {
              const disciplina =
                base.disciplinas.find(
                  (item) =>
                    item.id ===
                    turma.disciplinaId
                );

              const quantidadeAlunos =
                base.matriculas.filter(
                  (matricula) =>
                    matricula.turmaId ===
                    turma.id
                ).length;

              return {
                ...turma,

                disciplina:
                  disciplina
                    ? disciplina.nome
                    : 'Disciplina não encontrada',

                quantidadeAlunos,
              };
            }
          );


        setTurmas(
          turmasCompletas
        );

      } catch (error) {
        console.log(
          'Erro ao carregar turmas do professor.'
        );

      } finally {
        setCarregando(false);
      }
    };


  // ======================================================
  // CARREGANDO
  // ======================================================

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator
          size="large"
          color="#a2181c"
        />

        <Text style={styles.textoCarregando}>
          Carregando suas turmas...
        </Text>
      </View>
    );
  }


  // ======================================================
  // TELA
  // ======================================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.conteudo
      }
      showsVerticalScrollIndicator={
        false
      }
    >

      {/* ================================================ */}
      {/* SAUDAÇÃO */}
      {/* ================================================ */}

      <View style={styles.cabecalho}>
        <Text style={styles.saudacao}>
          Olá, {usuario.nome}!
        </Text>

        <Text style={styles.subtitulo}>
          Estas são as turmas vinculadas à sua conta.
        </Text>
      </View>


      {/* ================================================ */}
      {/* RESUMO */}
      {/* ================================================ */}

      <View style={styles.resumo}>
        <View style={styles.resumoItem}>
          <Text style={styles.numero}>
            {turmas.length}
          </Text>

          <Text style={styles.resumoTexto}>
            {turmas.length === 1
              ? 'turma'
              : 'turmas'}
          </Text>
        </View>

        <View style={styles.divisorResumo} />

        <View style={styles.resumoItem}>
          <Text style={styles.numero}>
            {turmas.reduce(
              (
                total,
                turma
              ) =>
                total +
                turma.quantidadeAlunos,
              0
            )}
          </Text>

          <Text style={styles.resumoTexto}>
            alunos vinculados
          </Text>
        </View>
      </View>


      {/* ================================================ */}
      {/* MINHAS TURMAS */}
      {/* ================================================ */}

      <Text style={styles.tituloSecao}>
        Minhas turmas
      </Text>


      {turmas.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTitulo}>
            Nenhuma turma encontrada
          </Text>

          <Text style={styles.vazioTexto}>
            Não existem turmas vinculadas
            a este professor.
          </Text>
        </View>
      ) : (
        turmas.map(
          (turma) => (
            <TurmaProfessorCard
              key={turma.id}
              turma={turma}
            />
          )
        )
      )}

    </ScrollView>
  );
}


// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:
      '#edf1f4',
  },


  conteudo: {
    padding: 20,

    paddingBottom: 30,
  },


  // ====================================================
  // CABEÇALHO
  // ====================================================

  cabecalho: {
    marginBottom: 20,
  },


  saudacao: {
    fontSize: 24,

    fontWeight: 'bold',

    color: '#222',
  },


  subtitulo: {
    fontSize: 14,

    color: '#777',

    marginTop: 5,

    lineHeight: 20,
  },


  // ====================================================
  // RESUMO
  // ====================================================

  resumo: {
    backgroundColor: '#fff',

    borderRadius: 14,

    paddingVertical: 16,

    paddingHorizontal: 20,

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 25,

    elevation: 1,

    shadowColor: '#000',

    shadowOpacity: 0.05,

    shadowRadius: 3,

    shadowOffset: {
      width: 0,
      height: 1,
    },
  },


  resumoItem: {
    flex: 1,

    alignItems: 'center',
  },


  numero: {
    fontSize: 22,

    fontWeight: 'bold',

    color: '#a2181c',
  },


  resumoTexto: {
    fontSize: 12,

    color: '#777',

    marginTop: 3,

    textAlign: 'center',
  },


  divisorResumo: {
    width: 1,

    height: 40,

    backgroundColor:
      '#eeeeee',

    marginHorizontal: 15,
  },


  // ====================================================
  // TURMAS
  // ====================================================

  tituloSecao: {
    fontSize: 19,

    fontWeight: 'bold',

    color: '#222',

    marginBottom: 14,
  },


  // ====================================================
  // VAZIO
  // ====================================================

  vazio: {
    backgroundColor: '#fff',

    borderRadius: 14,

    padding: 25,

    alignItems: 'center',
  },


  vazioTitulo: {
    fontSize: 15,

    fontWeight: 'bold',

    color: '#555',
  },


  vazioTexto: {
    fontSize: 13,

    color: '#888',

    textAlign: 'center',

    marginTop: 5,
  },


  // ====================================================
  // CARREGANDO
  // ====================================================

  carregando: {
    flex: 1,

    backgroundColor:
      '#edf1f4',

    alignItems: 'center',

    justifyContent: 'center',
  },


  textoCarregando: {
    marginTop: 12,

    color: '#666',

    fontSize: 14,
  },
});