import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function TurmaProfessorCard({
  turma,
}) {
  return (
    <View style={styles.card}>

      <View style={styles.cabecalho}>
        <View style={styles.icone}>
          <Ionicons
            name="school-outline"
            size={22}
            color="#a2181c"
          />
        </View>

        <View style={styles.tituloContainer}>
          <Text style={styles.disciplina}>
            {turma.disciplina}
          </Text>

          <Text style={styles.codigo}>
            Turma {turma.id}
          </Text>
        </View>
      </View>


      <View style={styles.divisor} />


      <View style={styles.linha}>
        <View style={styles.item}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color="#777"
          />

          <View style={styles.info}>
            <Text style={styles.label}>
              Dia
            </Text>

            <Text style={styles.valor}>
              {turma.dia}
            </Text>
          </View>
        </View>


        <View style={styles.item}>
          <Ionicons
            name="time-outline"
            size={18}
            color="#777"
          />

          <View style={styles.info}>
            <Text style={styles.label}>
              Horário
            </Text>

            <Text style={styles.valor}>
              {turma.horario}
            </Text>
          </View>
        </View>
      </View>


      <View style={styles.linhaInferior}>
        <Ionicons
          name="location-outline"
          size={18}
          color="#777"
        />

        <View style={styles.info}>
          <Text style={styles.label}>
            Sala
          </Text>

          <Text style={styles.valor}>
            {turma.sala}
          </Text>
        </View>
      </View>


      <View style={styles.rodape}>
        <Text style={styles.alunos}>
          {turma.quantidadeAlunos}{' '}
          {turma.quantidadeAlunos === 1
            ? 'aluno matriculado'
            : 'alunos matriculados'}
        </Text>
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',

    borderRadius: 14,

    padding: 16,

    marginBottom: 14,

    elevation: 2,

    shadowColor: '#000',

    shadowOpacity: 0.06,

    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },


  cabecalho: {
    flexDirection: 'row',

    alignItems: 'center',
  },


  icone: {
    width: 44,

    height: 44,

    borderRadius: 22,

    backgroundColor: '#f8e8e8',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 12,
  },


  tituloContainer: {
    flex: 1,
  },


  disciplina: {
    fontSize: 16,

    fontWeight: 'bold',

    color: '#222',
  },


  codigo: {
    fontSize: 12,

    color: '#888',

    marginTop: 3,
  },


  divisor: {
    height: 1,

    backgroundColor: '#eeeeee',

    marginVertical: 14,
  },


  linha: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 14,
  },


  item: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',
  },


  linhaInferior: {
    flexDirection: 'row',

    alignItems: 'center',
  },


  info: {
    marginLeft: 8,
  },


  label: {
    fontSize: 11,

    color: '#888',
  },


  valor: {
    fontSize: 13,

    fontWeight: '600',

    color: '#333',

    marginTop: 2,
  },


  rodape: {
    marginTop: 14,

    paddingTop: 12,

    borderTopWidth: 1,

    borderTopColor: '#eeeeee',
  },


  alunos: {
    fontSize: 12,

    color: '#666',

    fontWeight: '600',
  },
});