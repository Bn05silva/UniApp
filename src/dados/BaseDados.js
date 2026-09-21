import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_KEY = '@uniapp_base';


// ======================================================
// BASE INICIAL
// ======================================================

const BASE_INICIAL = {
  versao: 5,


  // ====================================================
  // ALUNOS
  // ====================================================

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
      nome: 'Bruno',
      email: 'bruno@aluno.edu.br',
      curso: 'Engenharia de Software',
      periodo: '7º período',
    },
  ],


  // ====================================================
  // PROFESSORES
  // ====================================================

  professores: [
    {
      identificador: 'PROF001',
      senha: '123456',
      nome: 'Tássio Auad',
      email: 'tassio.auad@vassouras.edu.br',
    },

    {
      identificador: 'PROF002',
      senha: '123456',
      nome: 'Fábio Gonçalves',
      email: 'fabio.goncalves@vassouras.edu.br',
    },

    {
      identificador: 'PROF003',
      senha: '123456',
      nome: 'Anrafael Fernandes',
      email: 'anrafael.fernandes@vassouras.edu.br',
    },

    {
      identificador: 'PROF004',
      senha: '123456',
      nome: 'Marco Antonio Araujo',
      email: 'marco.antonio.araujo@vassouras.edu.br',
    },

    {
      identificador: 'PROF005',
      senha: '123456',
      nome: 'Tássio Sirqueira',
      email: 'tassio.sirqueira@vassouras.edu.br',
    },
  ],


  // ====================================================
  // DISCIPLINAS DO 7º PERÍODO
  // ====================================================

  disciplinas: [
    {
      id: 'GME01',
      nome: 'Gestão da Manutenção e Evolução de Software',
    },

    {
      id: 'DJD01',
      nome: 'Desenvolvimento de Jogos Digitais',
    },

    {
      id: 'PFC01',
      nome: 'Projeto Final de Curso I',
    },

    {
      id: 'DEC01',
      nome: 'Direito e Ética de Computação',
    },

    {
      id: 'SAS01',
      nome: 'Segurança e Auditoria de Software',
    },

    {
      id: 'GQT01',
      nome: 'Gestão da Qualidade e Teste de Software',
    },

    {
      id: 'LDAH01',
      nome: 'Laboratório de Desenvolvimento de Aplicativos Híbridos',
    },
  ],


  // ====================================================
  // GRADE DO 7º PERÍODO
  // ====================================================
  //
  // Todas as aulas:
  // 19:00 às 22:00
  // ====================================================

  turmas: [

    // SEGUNDA

    {
      id: 'T-GME01',
      disciplinaId: 'GME01',
      professorId: 'PROF001',
      dia: 'Segunda',
      horario: '19:00',
      horarioFim: '22:00',
      sala: 'Laboratório de Informática 3',
    },


    // TERÇA

    {
      id: 'T-DJD01',
      disciplinaId: 'DJD01',
      professorId: 'PROF002',
      dia: 'Terça',
      horario: '19:00',
      horarioFim: '22:00',
      sala: 'Laboratório de Informática 5',
    },


    // QUARTA

    {
      id: 'T-PFC01',
      disciplinaId: 'PFC01',
      professorId: 'PROF003',
      dia: 'Quarta',
      horario: '19:00',
      horarioFim: '22:00',
      sala: 'Digital',
    },


    // QUINTA

    {
      id: 'T-DEC01',
      disciplinaId: 'DEC01',
      professorId: 'PROF004',
      dia: 'Quinta',
      horario: '19:00',
      horarioFim: '22:00',
      sala: 'Digital',
    },

    {
      id: 'T-SAS01',
      disciplinaId: 'SAS01',
      professorId: 'PROF004',
      dia: 'Quinta',
      horario: '19:00',
      horarioFim: '22:00',
      sala: 'Digital',
    },


    // SEXTA

    {
      id: 'T-GQT01',
      disciplinaId: 'GQT01',
      professorId: 'PROF005',
      dia: 'Sexta',
      horario: '19:00',
      horarioFim: '22:00',
      sala: 'Laboratório de Informática 2',
    },


    // SÁBADO

    {
      id: 'T-LDAH01',
      disciplinaId: 'LDAH01',
      professorId: 'PROF005',
      dia: 'Sábado',
      horario: '19:00',
      horarioFim: '22:00',
      sala: 'Laboratório de Informática 2',
    },
  ],


  // ====================================================
  // MATRÍCULAS
  // ====================================================
  //
  // Richard e Bruno estão matriculados em todas
  // as disciplinas do 7º período.
  // ====================================================

  matriculas: [

    // ==================================================
    // RICHARD
    // ==================================================

    {
      matricula: '202312084',
      turmaId: 'T-GME01',
    },

    {
      matricula: '202312084',
      turmaId: 'T-DJD01',
    },

    {
      matricula: '202312084',
      turmaId: 'T-PFC01',
    },

    {
      matricula: '202312084',
      turmaId: 'T-DEC01',
    },

    {
      matricula: '202312084',
      turmaId: 'T-SAS01',
    },

    {
      matricula: '202312084',
      turmaId: 'T-GQT01',
    },

    {
      matricula: '202312084',
      turmaId: 'T-LDAH01',
    },


    // ==================================================
    // BRUNO
    // ==================================================

    {
      matricula: '202312090',
      turmaId: 'T-GME01',
    },

    {
      matricula: '202312090',
      turmaId: 'T-DJD01',
    },

    {
      matricula: '202312090',
      turmaId: 'T-PFC01',
    },

    {
      matricula: '202312090',
      turmaId: 'T-DEC01',
    },

    {
      matricula: '202312090',
      turmaId: 'T-SAS01',
    },

    {
      matricula: '202312090',
      turmaId: 'T-GQT01',
    },

    {
      matricula: '202312090',
      turmaId: 'T-LDAH01',
    },
  ],
};


// ======================================================
// CARREGAR BASE
// ======================================================

export async function carregarBase() {
  try {
    const salvo =
      await AsyncStorage.getItem(
        BASE_KEY
      );


    if (salvo) {
      const base =
        JSON.parse(
          salvo
        );


      if (
        base.versao ===
        BASE_INICIAL.versao
      ) {
        return base;
      }
    }


    await AsyncStorage.setItem(
      BASE_KEY,
      JSON.stringify(
        BASE_INICIAL
      )
    );

  } catch (error) {
    console.log(
      'Erro ao carregar a base de dados.'
    );
  }


  return BASE_INICIAL;
}


// ======================================================
// SALVAR BASE
// ======================================================

export async function salvarBase(
  base
) {
  try {
    await AsyncStorage.setItem(
      BASE_KEY,
      JSON.stringify(
        base
      )
    );


    return true;

  } catch (error) {
    console.log(
      'Erro ao salvar a base de dados.'
    );


    return false;
  }
}


// ======================================================
// AUTENTICAR USUÁRIO
// ======================================================

export async function autenticar(
  tipo,
  identificador,
  senha
) {
  const base =
    await carregarBase();


  const lista =
    tipo === 'professor'
      ? base.professores
      : base.alunos;


  const campo =
    tipo === 'professor'
      ? 'identificador'
      : 'matricula';


  const procurado =
    identificador
      .trim()
      .toLowerCase();


  const usuario =
    lista.find(
      (u) =>
        u[campo]
          .toLowerCase() ===
          procurado &&
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
    const base =
      await carregarBase();


    const lista =
      tipo === 'professor'
        ? base.professores
        : base.alunos;


    const campo =
      tipo === 'professor'
        ? 'identificador'
        : 'matricula';


    const procurado =
      identificador
        .trim()
        .toLowerCase();


    const indice =
      lista.findIndex(
        (usuario) =>
          usuario[campo]
            .toLowerCase() ===
          procurado
      );


    if (indice === -1) {
      return {
        ok: false,
        erro: 'Usuário não encontrado.',
      };
    }


    if (
      lista[indice].senha !==
      senhaAtual
    ) {
      return {
        ok: false,
        erro: 'A senha atual está incorreta.',
      };
    }


    if (
      senhaAtual ===
      novaSenha
    ) {
      return {
        ok: false,
        erro:
          'A nova senha deve ser diferente da senha atual.',
      };
    }


    lista[indice].senha =
      novaSenha;


    const salvo =
      await salvarBase(
        base
      );


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