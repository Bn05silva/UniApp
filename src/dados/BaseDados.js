import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_KEY = '@uniapp_base';

// Dados de demonstração para o protótipo.
// Senhas em texto puro apenas nesta versão do trabalho,
// pois tudo funciona localmente e sem servidor.
//
// Quando for necessário recriar a base no aparelho,
// aumente o número da versão.
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
    {
      id: 'ES01',
      nome: 'Engenharia de Software',
    },
    {
      id: 'BD01',
      nome: 'Banco de Dados',
    },
    {
      id: 'RC01',
      nome: 'Redes de Computadores',
    },
  ],

  // As disciplinas já ficam vinculadas aos professores.
  // O professor apenas gerencia informações da turma.
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
    {
      matricula: '202312084',
      turmaId: 'T-ES01',
    },
    {
      matricula: '202312084',
      turmaId: 'T-BD01',
    },
    {
      matricula: '202312090',
      turmaId: 'T-BD01',
    },
    {
      matricula: '202312090',
      turmaId: 'T-RC01',
    },
  ],
};


// ======================================================
// CARREGAR BASE
// ======================================================

export async function carregarBase() {
  try {
    const salvo = await AsyncStorage.getItem(BASE_KEY);

    if (salvo) {
      const base = JSON.parse(salvo);

      if (base.versao === BASE_INICIAL.versao) {
        return base;
      }
    }

    await AsyncStorage.setItem(
      BASE_KEY,
      JSON.stringify(BASE_INICIAL)
    );
  } catch (error) {
    console.log('Erro ao carregar a base de dados.');
  }

  return BASE_INICIAL;
}


// ======================================================
// SALVAR BASE
// ======================================================

export async function salvarBase(base) {
  try {
    await AsyncStorage.setItem(
      BASE_KEY,
      JSON.stringify(base)
    );

    return true;
  } catch (error) {
    console.log('Erro ao salvar a base de dados.');

    return false;
  }
}


// ======================================================
// AUTENTICAR USUÁRIO
// ======================================================

// tipo:
// 'aluno'
// 'professor'
//
// Retorna o usuário sem a senha se os dados estiverem
// corretos. Caso contrário retorna null.

export async function autenticar(
  tipo,
  identificador,
  senha
) {
  const base = await carregarBase();

  const lista =
    tipo === 'professor'
      ? base.professores
      : base.alunos;

  const campo =
    tipo === 'professor'
      ? 'identificador'
      : 'matricula';

  const procurado = identificador
    .trim()
    .toLowerCase();

  const usuario = lista.find(
    (u) =>
      u[campo].toLowerCase() === procurado &&
      u.senha === senha
  );

  if (!usuario) {
    return null;
  }

  const {
    senha: _senha,
    ...usuarioSemSenha
  } = usuario;

  return usuarioSemSenha;
}


// ======================================================
// ALTERAR SENHA
// ======================================================

export async function alterarSenhaUsuario(
  tipo,
  identificador,
  senhaAtual,
  novaSenha
) {
  try {
    const base = await carregarBase();

    const lista =
      tipo === 'professor'
        ? base.professores
        : base.alunos;

    const campo =
      tipo === 'professor'
        ? 'identificador'
        : 'matricula';

    const procurado = identificador
      .trim()
      .toLowerCase();

    const indice = lista.findIndex(
      (usuario) =>
        usuario[campo].toLowerCase() === procurado
    );

    if (indice === -1) {
      return {
        ok: false,
        erro: 'Usuário não encontrado.',
      };
    }

    // Confere a senha usada atualmente
    if (lista[indice].senha !== senhaAtual) {
      return {
        ok: false,
        erro: 'A senha atual está incorreta.',
      };
    }

    // Evita colocar a mesma senha novamente
    if (senhaAtual === novaSenha) {
      return {
        ok: false,
        erro:
          'A nova senha deve ser diferente da senha atual.',
      };
    }

    // Altera a senha dentro da base
    lista[indice].senha = novaSenha;

    const salvo = await salvarBase(base);

    if (!salvo) {
      return {
        ok: false,
        erro:
          'Não foi possível salvar a nova senha.',
      };
    }

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      erro:
        'Ocorreu um erro ao alterar a senha.',
    };
  }
}