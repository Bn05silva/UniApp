import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../contexto/AuthContext';

// Provisório: a Home do professor (disciplinas/turmas dele) entra na etapa 2.
export default function InicioProfessorScreen() {
  const { usuario } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.saudacao}>Olá, {usuario.nome}!</Text>
      <Text style={styles.info}>
        Suas disciplinas e turmas aparecerão aqui.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1f4',
    padding: 20,
  },

  saudacao: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },

  info: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
});