import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AcessoRapido({ navigation }) {
  return (
    <View>
      <Text style={styles.titulo}>
        Acesso rápido
      </Text>

      <TouchableOpacity
        style={styles.botaoPrincipal}
        onPress={() =>
          navigation.navigate('Presença')
        }
      >
        <Text style={styles.textoPrincipal}>
          Registrar presença
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() =>
          navigation.navigate('Mapa')
        }
      >
        <Text style={styles.textoBotao}>
          Mapa do Campus
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() =>
          navigation.navigate('Perfil')
        }
      >
        <Text style={styles.textoBotao}>
          Meu Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  botaoPrincipal: {
    backgroundColor: '#a2181c',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 9,
  },

  textoPrincipal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  botao: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 9,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  textoBotao: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
});