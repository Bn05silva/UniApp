import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function ItemInformacao({
  titulo,
  valor,
  ultimo,
}) {
  return (
    <View
      style={[
        styles.item,
        ultimo && styles.ultimoItem,
      ]}
    >
      <Text style={styles.tituloItem}>
        {titulo}
      </Text>

      <Text style={styles.valor}>
        {valor}
      </Text>
    </View>
  );
}

export default function InformacoesAcademicas({
  perfil,
  onEditar,
  onAlterarSenha,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>
          Informações acadêmicas
        </Text>

        <TouchableOpacity onPress={onEditar}>
          <Text style={styles.editar}>
            Editar
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <ItemInformacao
          titulo="Nome completo"
          valor={perfil.nome}
        />

        <ItemInformacao
          titulo="Matrícula"
          valor={perfil.matricula}
        />

        <ItemInformacao
          titulo="E-mail acadêmico"
          valor={perfil.email}
        />

        <ItemInformacao
          titulo="Curso"
          valor={perfil.curso}
        />

        <ItemInformacao
          titulo="Período atual"
          valor={perfil.periodo}
          ultimo
        />
      </View>

      <TouchableOpacity
        style={styles.botaoSenha}
        onPress={onAlterarSenha}
      >
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#a2181c"
        />

        <Text style={styles.textoSenha}>
          Alterar senha
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 30,
  },

  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  titulo: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
  },

  editar: {
    color: '#a2181c',
    fontSize: 15,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    elevation: 1,
  },

  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },

  ultimoItem: {
    borderBottomWidth: 0,
  },

  tituloItem: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },

  valor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  botaoSenha: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#ddd',
  },

  textoSenha: {
    marginLeft: 8,
    color: '#a2181c',
    fontWeight: 'bold',
    fontSize: 15,
  },
});