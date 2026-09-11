import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PerfilHeader({
  perfil,
  onAlterarFoto,
}) {
  const iniciais = perfil.nome
    .split(' ')
    .slice(0, 2)
    .map((nome) => nome.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.fotoContainer}>
        {perfil.foto ? (
          <Image
            source={{ uri: perfil.foto }}
            style={styles.foto}
          />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Text style={styles.iniciais}>
              {iniciais}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.botaoCamera}
          onPress={onAlterarFoto}
        >
          <Ionicons
            name="camera"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.nome}>
        {perfil.nome}
      </Text>

      <Text style={styles.matricula}>
        Matrícula {perfil.matricula}
      </Text>

      <View style={styles.status}>
        <Ionicons
          name="checkmark-circle"
          size={18}
          color="#27865c"
        />

        <Text style={styles.statusTexto}>
          Matrícula ativa
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 25,
    alignItems: 'center',

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  fotoContainer: {
    position: 'relative',
  },

  foto: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  fotoPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#a2181c',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iniciais: {
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
  },

  botaoCamera: {
    position: 'absolute',
    right: -3,
    bottom: 0,

    width: 38,
    height: 38,
    borderRadius: 19,

    backgroundColor: '#a2181c',

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 3,
    borderColor: '#fff',
  },

  nome: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },

  matricula: {
    marginTop: 4,
    fontSize: 15,
    color: '#777',
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 14,

    backgroundColor: '#e7f5ef',

    paddingHorizontal: 13,
    paddingVertical: 7,

    borderRadius: 20,
  },

  statusTexto: {
    marginLeft: 5,
    color: '#27865c',
    fontWeight: 'bold',
  },
});