import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ResumoPresenca({
  quantidade,
  ultimaPresenca,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>
        Resumo de presença
      </Text>

      <Text style={styles.numero}>
        {quantidade}
      </Text>

      <Text style={styles.descricao}>
        presenças registradas
      </Text>

      {ultimaPresenca && (
        <View style={styles.ultima}>
          <Text style={styles.subtitulo}>
            Última presença
          </Text>

          <Text style={styles.info}>
            {ultimaPresenca.data} • {ultimaPresenca.hora}
          </Text>

          <Text style={styles.status}>
            {ultimaPresenca.status}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },

  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  numero: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a2181c',
    marginTop: 10,
  },

  descricao: {
    fontSize: 13,
    color: '#777',
  },

  ultima: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  subtitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  info: {
    fontSize: 13,
    color: '#555',
  },

  status: {
    fontSize: 13,
    color: '#27865c',
    fontWeight: 'bold',
    marginTop: 3,
  },
});