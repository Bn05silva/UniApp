import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SaudacaoAluno({ perfil }) {
  const primeiroNome =
    perfil?.nome?.split(' ')[0] || 'Aluno';

  return (
    <View style={styles.container}>
      <Text style={styles.saudacao}>
        Olá, {primeiroNome}!
      </Text>

      <Text style={styles.curso}>
        {perfil.curso}
      </Text>

      <Text style={styles.periodo}>
        {perfil.periodo}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },

  saudacao: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },

  curso: {
    fontSize: 16,
    color: '#a2181c',
    fontWeight: 'bold',
    marginTop: 4,
  },

  periodo: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
});