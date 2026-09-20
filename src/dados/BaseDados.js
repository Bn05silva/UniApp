import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_KEY = '@uniapp_base';

// Dados de demonstração para o protótipo.
// Senhas em texto puro apenas nesta versão do trabalho (tudo local, sem servidor).
// Ao alterar esta base, aumente "versao" para ela ser recriada no aparelho.
const BASE_INICIAL = {
  versao: 1,

  alunos: [
    {
      matricula: '202312084',
      senha: '123456',
      nome: 'Richard Rodrigues',
      email: 'richard.rodrigues@aluno.edu.br',
      curso: 'Engenharia de Software',
      periodo: '7º período',
    },
    {
      matricula: '202312090',
      senha: '123456',
      nome: 'Aluno Teste',
      email: 'aluno.teste@aluno.edu.br',
      curso: 'Engenharia de Software',
      periodo: '7º período',
    },
  ],

  professores: [
    {
      identificador: 'PROF001',
      senha: '123456',
      nome: 'Professor Um',
      email: 'professor.um@vassouras.edu.br',
    },
    {
      identificador: 'PROF002',
      senha: '123456',
      nome: 'Professor Dois',
      email: 'professor.dois@vassouras.edu.br',
    },
  ],

  disciplinas: [
    { id: 'ES01', nome: 'Engenharia de Software' },
    { id: 'BD01', nome: 'Banco de Dados' },
    { id: 'RC01', nome: 'Redes de Computadores' },
  ],

  // O professor não cria disciplina: a turma já nasce vinculada a ele.
  // Ele só ajusta dia, horário e sala.
  turmas: [
    {
      id: 'T-ES01',
      disciplinaId: 'ES01',
      professorId: 'PROF001',
      dia: 'Segunda',
      horario: '19:00',
      sala: '204',
    },
    {
      id: 'T-BD01',
      disciplinaId: 'BD01',
      professorId: 'PROF001',
      dia: 'Quarta',
      horario: '21:00',
      sala: '101',
    },
    {
      id: 'T-RC01',
      disciplinaId: 'RC01',
      professorId: 'PROF002',
      dia: 'Terça',
      horario: '19:00',
      sala: '310',
    },
  ],

  matriculas: [
    { matricula: '202312084', turmaId: 'T-ES01' },
    { matricula: '202312084', turmaId: 'T-BD01' },
    { matricula: '202312090', turmaId: 'T-BD01' },
    { matricula: '202312090', turmaId: 'T-RC01' },
  ],
};

export async function carregarBase() {
  try {
    const salvo = await AsyncStorage.getItem(BASE_KEY);

    if (salvo) {
      const base = JSON.parse(salvo);

      if (base.versao === BASE_INICIAL.versao) {
        return base;
      }
    }

    await AsyncStorage.setItem(BASE_KEY, JSON.stringify(BASE_INICIAL));
  } catch (error) {
    console.log('Erro ao carregar a base de dados.');
  }

  return BASE_INICIAL;
}

export async function salvarBase(base) {
  try {
    await AsyncStorage.setItem(BASE_KEY, JSON.stringify(base));
    return true;
  } catch (error) {
    return false;
  }
}

// tipo: 'aluno' (matrícula) ou 'professor' (identificador).
// Retorna o usuário sem a senha, ou null se os dados não conferirem.
export async function autenticar(tipo, identificador, senha) {
  const base = await carregarBase();

  const lista = tipo === 'professor' ? base.professores : base.alunos;
  const campo = tipo === 'professor' ? 'identificador' : 'matricula';

  const procurado = identificador.trim().toLowerCase();

  const usuario = lista.find(
    (u) => u[campo].toLowerCase() === procurado && u.senha === senha
  );

  if (!usuario) {
    return null;
  }

  const { senha: _senha, ...semSenha } = usuario;

  return semSenha;
}