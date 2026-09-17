import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProximaAula() {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>
        Próxima aula
      </Text>

      <Text style={styles.disciplina}>
        Engenharia de Software
      </Text>

      <Text style={styles.info}>
        Hoje • 19:00
      </Text>

      <Text style={styles.info}>
        Sala 204
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#a2181c',
  },

  titulo: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },

  disciplina: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },

  info: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});