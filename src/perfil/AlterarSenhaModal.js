import React, { useState } from 'react';

import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AlterarSenhaModal({
  visible,
  onClose,
  onSalvar,
}) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');

  const limparCampos = () => {
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    setErro('');
  };

  const fecharModal = () => {
    limparCampos();
    onClose();
  };

  const alterarSenha = async () => {
    setErro('');

    if (
      !senhaAtual ||
      !novaSenha ||
      !confirmarSenha
    ) {
      setErro('Preencha todos os campos.');
      return;
    }

    if (novaSenha.length < 6) {
      setErro(
        'A nova senha deve possuir pelo menos 6 caracteres.'
      );
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro(
        'A confirmação da senha não corresponde à nova senha.'
      );
      return;
    }

    if (senhaAtual === novaSenha) {
      setErro(
        'A nova senha deve ser diferente da senha atual.'
      );
      return;
    }

    const resultado = await onSalvar(
      senhaAtual,
      novaSenha
    );

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    limparCampos();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={fecharModal}
    >
      <View style={styles.fundo}>
        <View style={styles.card}>
          <Text style={styles.titulo}>
            Alterar senha
          </Text>

          <Text style={styles.subtitulo}>
            Informe sua senha atual e escolha uma nova senha.
          </Text>

          <Text style={styles.label}>
            Senha atual
          </Text>

          <TextInput
            style={styles.input}
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>
            Nova senha
          </Text>

          <TextInput
            style={styles.input}
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>
            Confirmar nova senha
          </Text>

          <TextInput
            style={styles.input}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {erro !== '' && (
            <Text style={styles.erro}>
              {erro}
            </Text>
          )}

          <View style={styles.botoes}>
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={fecharModal}
            >
              <Text style={styles.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoAlterar}
              onPress={alterarSenha}
            >
              <Text style={styles.textoAlterar}>
                Alterar senha
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },

  titulo: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },

  subtitulo: {
    fontSize: 13,
    color: '#777',
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    marginBottom: 15,
  },

  erro: {
    color: '#c0392b',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 15,
  },

  botoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },

  botaoCancelar: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 8,
  },

  textoCancelar: {
    color: '#666',
    fontWeight: '600',
  },

  botaoAlterar: {
    backgroundColor: '#a2181c',
    borderRadius: 9,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  textoAlterar: {
    color: '#fff',
    fontWeight: 'bold',
  },
});