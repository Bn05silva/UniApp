import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

export default function ListItem({
  listItems,
  deleteItem,
}) {
  const renderItem = ({ item }) => {
    // Compatibilidade com registros antigos
    if (item.task && !item.aluno) {
      return (
        <View style={styles.itemContainer}>
          <View style={styles.content}>
            <Text style={styles.legacyText}>
              {item.task}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => deleteItem(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.itemContainer}>
        <View style={styles.content}>
          <Text style={styles.aluno}>
            {item.aluno}
          </Text>

          <View style={styles.divisor} />

          <Text style={styles.info}>
            Aula: {item.aula}
          </Text>

          <Text style={styles.status}>
            {item.status}
          </Text>

          <Text style={styles.info}>
            Distância do campus: {item.distancia} m
          </Text>

          <Text style={styles.info}>
            Data: {item.data}
          </Text>

          <Text style={styles.info}>
            Horário: {item.hora}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => deleteItem(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Histórico de Presenças
      </Text>

      <FlatList
        data={listItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma presença registrada ainda.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  itemContainer: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,

    borderLeftWidth: 4,
    borderLeftColor: '#a2181c',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  content: {
    flex: 1,
    marginRight: 10,
  },

  aluno: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a2181c',
  },

  divisor: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 8,
  },

  info: {
    fontSize: 13,
    color: '#444',
    marginBottom: 5,
  },

  status: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: 'bold',
    marginBottom: 5,
  },

  deleteButton: {
    backgroundColor: '#ffe6e6',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  deleteButtonText: {
    color: '#a2181c',
    fontWeight: 'bold',
    fontSize: 14,
  },

  legacyText: {
    fontSize: 13,
    color: '#333',
  },

  emptyContainer: {
    paddingVertical: 20,
  },

  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
});