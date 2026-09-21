import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';


export default function ProximaAula({
  aula,
}) {

  // ======================================================
  // NENHUMA AULA
  // ======================================================

  if (!aula) {
    return (
      <View style={styles.card}>
        <View style={styles.cabecalho}>
          <View style={styles.icone}>
            <Ionicons
              name="calendar-outline"
              size={21}
              color="#a2181c"
            />
          </View>

          <Text style={styles.titulo}>
            Próxima aula
          </Text>
        </View>

        <Text style={styles.semAula}>
          Nenhuma aula encontrada na sua grade.
        </Text>
      </View>
    );
  }


  // ======================================================
  // TELA
  // ======================================================

  return (
    <View style={styles.card}>

      {/* ================================================ */}
      {/* CABEÇALHO */}
      {/* ================================================ */}

      <View style={styles.cabecalho}>

        <View style={styles.icone}>
          <Ionicons
            name="calendar-outline"
            size={21}
            color="#a2181c"
          />
        </View>

        <Text style={styles.titulo}>
          Próxima aula
        </Text>

      </View>


      {/* ================================================ */}
      {/* DISCIPLINA */}
      {/* ================================================ */}

      <Text style={styles.disciplina}>
        {aula.disciplina}
      </Text>


      {/* ================================================ */}
      {/* DATA */}
      {/* ================================================ */}

      <View style={styles.linha}>

        <Ionicons
          name="calendar-clear-outline"
          size={17}
          color="#777"
        />

        <Text style={styles.info}>
          {aula.quando}
        </Text>

      </View>


      {/* ================================================ */}
      {/* HORÁRIO */}
      {/* ================================================ */}

      <View style={styles.linha}>

        <Ionicons
          name="time-outline"
          size={17}
          color="#777"
        />

        <Text style={styles.info}>
          {aula.horario}
        </Text>

      </View>


      {/* ================================================ */}
      {/* SALA */}
      {/* ================================================ */}

      <View style={styles.linha}>

        <Ionicons
          name="location-outline"
          size={17}
          color="#777"
        />

        <Text style={styles.info}>
          Sala {aula.sala}
        </Text>

      </View>


      {/* ================================================ */}
      {/* PROFESSOR */}
      {/* ================================================ */}

      {aula.professor && (
        <View style={styles.linha}>

          <Ionicons
            name="person-outline"
            size={17}
            color="#777"
          />

          <Text style={styles.info}>
            {aula.professor}
          </Text>

        </View>
      )}

    </View>
  );
}


// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#fff',

    borderRadius: 14,

    padding: 16,

    marginBottom: 14,

    borderLeftWidth: 4,

    borderLeftColor: '#a2181c',

    elevation: 1,

    shadowColor: '#000',

    shadowOpacity: 0.05,

    shadowRadius: 3,

    shadowOffset: {
      width: 0,
      height: 1,
    },
  },


  cabecalho: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 13,
  },


  icone: {
    width: 36,

    height: 36,

    borderRadius: 18,

    backgroundColor: '#f8e8e8',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 10,
  },


  titulo: {
    fontSize: 14,

    fontWeight: '600',

    color: '#777',
  },


  disciplina: {
    fontSize: 18,

    fontWeight: 'bold',

    color: '#222',

    marginBottom: 12,
  },


  linha: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 7,
  },


  info: {
    fontSize: 13,

    color: '#555',

    marginLeft: 8,

    fontWeight: '500',
  },


  semAula: {
    fontSize: 13,

    color: '#777',

    lineHeight: 19,
  },

});