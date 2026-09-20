import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../contexto/AuthContext';

const TIPOS = [
  { id: 'aluno', rotulo: 'Aluno', campo: 'Matrícula' },
  { id: 'professor', rotulo: 'Professor', campo: 'Identificador' },
];

export default function LoginScreen() {
  const { entrar } = useAuth();

  const [tipo, setTipo] = useState('aluno');
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const tipoAtual = TIPOS.find((t) => t.id === tipo);

  const trocarTipo = (novoTipo) => {
    setTipo(novoTipo);
    setIdentificador('');
    setSenha('');
    setErro('');
  };

  const handleEntrar = async () => {
    setErro('');
    setCarregando(true);

    const resultado = await entrar(tipo, identificador, senha);

    // Se deu certo, esta tela sai de cena; só reabilita o botão em caso de erro.
    if (!resultado.ok) {
      setErro(resultado.erro);
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.marca}>
          <Text style={styles.titulo}>UniApp</Text>
          <Text style={styles.subtitulo}>Universidade de Vassouras</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.seletor}>
            {TIPOS.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.opcao,
                  tipo === t.id && styles.opcaoAtiva,
                ]}
                onPress={() => trocarTipo(t.id)}
                disabled={carregando}
              >
                <Text
                  style={[
                    styles.textoOpcao,
                    tipo === t.id && styles.textoOpcaoAtivo,
                  ]}
                >
                  {t.rotulo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{tipoAtual.campo}</Text>

          <TextInput
            style={styles.input}
            value={identificador}
            onChangeText={setIdentificador}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={tipo === 'aluno' ? 'number-pad' : 'default'}
            editable={!carregando}
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            editable={!carregando}
            onSubmitEditing={handleEntrar}
          />

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesabilitado]}
            onPress={handleEntrar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBotao}>Entrar</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.ajuda}>
            Depois da senha, o aparelho pede sua biometria.
          </Text>
        </View>

        {/* Remover antes da entrega: credenciais de demonstração */}
        <Text style={styles.demo}>
          Teste — aluno: 202312084 / professor: PROF001 (senha 123456)
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1f4',
  },

  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  marca: {
    alignItems: 'center',
    marginBottom: 28,
  },

  titulo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#a2181c',
    letterSpacing: 1,
  },

  subtitulo: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  seletor: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
  },

  opcao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  opcaoAtiva: {
    backgroundColor: '#a2181c',
  },

  textoOpcao: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },

  textoOpcaoAtivo: {
    color: '#fff',
    fontWeight: 'bold',
  },

  label: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
    marginBottom: 5,
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

  erro: {
    color: '#c0392b',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },

  botao: {
    backgroundColor: '#a2181c',
    borderRadius: 9,
    padding: 14,
    alignItems: 'center',
  },

  botaoDesabilitado: {
    opacity: 0.7,
  },

  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  ajuda: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
  },

  demo: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});