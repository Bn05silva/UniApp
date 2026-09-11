import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditarPerfilModal({
  visible,
  perfil,
  onClose,
  onSalvar,
}) {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('');
  const [periodo, setPeriodo] = useState('');

  useEffect(() => {
    if (visible) {
      setNome(perfil.nome);
      setMatricula(perfil.matricula);
      setEmail(perfil.email);
      setCurso(perfil.curso);
      setPeriodo(perfil.periodo);
    }
  }, [visible]);

  const salvar = () => {
    if (
      !nome.trim() ||
      !matricula.trim() ||
      !email.trim()
    ) {
      Alert.alert(
        'Atenção',
        'Preencha os dados obrigatórios.'
      );

      return;
    }

    onSalvar({
      ...perfil,
      nome: nome.trim(),
      matricula: matricula.trim(),
      email: email.trim(),
      curso: curso.trim(),
      periodo: periodo.trim(),
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.fundo}>
        <View style={styles.modal}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.titulo}>
              Editar perfil
            </Text>

            <Text style={styles.label}>
              Nome completo
            </Text>

            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>
              Matrícula
            </Text>

            <TextInput
              style={styles.input}
              value={matricula}
              onChangeText={setMatricula}
            />

            <Text style={styles.label}>
              E-mail acadêmico
            </Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>
              Curso
            </Text>

            <TextInput
              style={styles.input}
              value={curso}
              onChangeText={setCurso}
            />

            <Text style={styles.label}>
              Período
            </Text>

            <TextInput
              style={styles.input}
              value={periodo}
              onChangeText={setPeriodo}
            />

            <TouchableOpacity
              style={styles.botaoSalvar}
              onPress={salvar}
            >
              <Text style={styles.textoSalvar}>
                Salvar alterações
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={onClose}
            >
              <Text style={styles.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#fff',

    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,

    padding: 22,

    maxHeight: '85%',
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#f5f5f5',

    borderRadius: 9,

    paddingHorizontal: 12,
    paddingVertical: 11,

    fontSize: 15,

    marginBottom: 15,

    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  botaoSalvar: {
    backgroundColor: '#a2181c',

    borderRadius: 9,

    padding: 14,

    alignItems: 'center',

    marginTop: 5,
  },

  textoSalvar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  botaoCancelar: {
    padding: 14,
    alignItems: 'center',
  },

  textoCancelar: {
    color: '#777',
    fontWeight: '600',
  },
});