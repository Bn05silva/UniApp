import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_KEY = '@uniapp_base';


// ======================================================
// BASE INICIAL
// ======================================================
//
// Versão 6:
//
// - adiciona primeiro acesso;
// - adiciona um terceiro aluno;
// - substitui PROF001...PROF005 por matrículas
//   funcionais fictícias;
// - mantém Richard e Bruno já ativados;
// - deixa Lucas e Tássio Sirqueira em primeiro acesso.
// ======================================================

const BASE_INICIAL = {
  versao: 6,


  // ====================================================
  // ALUNOS
  // ====================================================

  alunos: [

    // ==================================================
    // RICHARD - CONTA JÁ ATIVADA
    // ==================================================

    {
      matricula: '202312084',
      senha: '123456',
      primeiroAcesso: false,

      nome: 'Richard Rodrigues',

      email:
        'richard.rodrigues@aluno.edu.br',

      curso:
        'Engenharia de Software',

      periodo:
        '7º período',
    },


    // ==================================================
    // BRUNO - CONTA JÁ ATIVADA
    // ==================================================

    {
      matricula: '202312090',
      senha: '123456',
      primeiroAcesso: false,

      nome: 'Bruno',

      email:
        'bruno@aluno.edu.br',

      curso:
        'Engenharia de Software',

      periodo:
        '7º período',
    },


    // ==================================================
    // LUCAS - PRIMEIRO ACESSO
    // ==================================================
    //
    // O aluno já existe na base institucional,
    // porém ainda não definiu sua senha.
    // ==================================================

    {
      matricula: '202312096',
      senha: null,
      primeiroAcesso: true,

      nome: 'Lucas Almeida',

      email:
        'lucas.almeida@aluno.edu.br',

      curso:
        'Engenharia de Software',

      periodo:
        '7º período',
    },
  ],


  // ====================================================
  // PROFESSORES
  // ====================================================

  professores: [

    // ==================================================
    // TÁSSIO AUAD
    // ==================================================

    {
      identificador: '20260001',
      senha: '123456',
      primeiroAcesso: false,

      nome: 'Tássio Auad',

      email:
        'tassio.auad@vassouras.edu.br',
    },


    // ==================================================
    // FÁBIO GONÇALVES
    // ==================================================

    {
      identificador: '20260002',
      senha: '123456',
      primeiroAcesso: false,

      nome: 'Fábio Gonçalves',

      email:
        'fabio.goncalves@vassouras.edu.br',
    },


    // ==================================================
    // ANRAFAEL FERNANDES
    // ==================================================

    {
      identificador: '20260003',
      senha: '123456',
      primeiroAcesso: false,

      nome: 'Anrafael Fernandes',

      email:
        'anrafael.fernandes@vassouras.edu.br',
    },


    // ==================================================
    // MARCO ANTONIO ARAUJO
    // ==================================================

    {
      identificador: '20260004',
      senha: '123456',
      primeiroAcesso: false,

      nome: 'Marco Antonio Araujo',

      email:
        'marco.antonio.araujo@vassouras.edu.br',
    },


    // ==================================================
    // TÁSSIO SIRQUEIRA - PRIMEIRO ACESSO
    // ==================================================
    //
    // Professor responsável pelas aulas de
    // sexta-feira e sábado.
    //
    // Não possui senha inicialmente.
    // ==================================================

    {
      identificador: '20260005',
      senha: null,
      primeiroAcesso: true,

      nome: 'Tássio Sirqueira',

      email:
        'tassio.sirqueira@vassouras.edu.br',
    },
  ],


  // ====================================================
  // DISCIPLINAS DO 7º PERÍODO
  // ====================================================

  disciplinas: [

    {
      id: 'GME01',

      nome:
        'Gestão da Manutenção e Evolução de Software',
    },


    {
      id: 'DJD01',

      nome:
        'Desenvolvimento de Jogos Digitais',
    },


    {
      id: 'PFC01',

      nome:
        'Projeto Final de Curso I',
    },


    {
      id: 'DEC01',

      nome:
        'Direito e Ética de Computação',
    },


    {
      id: 'SAS01',

      nome:
        'Segurança e Auditoria de Software',
    },


    {
      id: 'GQT01',

      nome:
        'Gestão da Qualidade e Teste de Software',
    },


    {
      id: 'LDAH01',

      nome:
        'Laboratório de Desenvolvimento de Aplicativos Híbridos',
    },
  ],


  // ====================================================
  // GRADE DO 7º PERÍODO
  // ====================================================

  turmas: [

    // ==================================================
    // SEGUNDA-FEIRA
    // Tássio Auad
    // ==================================================

    {
      id: 'T-GME01',

      disciplinaId:
        'GME01',

      professorId:
        '20260001',

      dia:
        'Segunda',

      horario:
        '19:00',

      horarioFim:
        '22:00',

      sala:
        'Laboratório de Informática 3',
    },


    // ==================================================
    // TERÇA-FEIRA
    // Fábio Gonçalves
    // ==================================================

    {
      id: 'T-DJD01',

      disciplinaId:
        'DJD01',

      professorId:
        '20260002',

      dia:
        'Terça',

      horario:
        '19:00',

      horarioFim:
        '22:00',

      sala:
        'Laboratório de Informática 5',
    },


    // ==================================================
    // QUARTA-FEIRA
    // Anrafael Fernandes
    // ==================================================

    {
      id: 'T-PFC01',

      disciplinaId:
        'PFC01',

      professorId:
        '20260003',

      dia:
        'Quarta',

      horario:
        '19:00',

      horarioFim:
        '22:00',

      sala:
        'Digital',
    },


    // ==================================================
    // QUINTA-FEIRA
    // Marco Antonio Araujo
    // ==================================================

    {
      id: 'T-DEC01',

      disciplinaId:
        'DEC01',

      professorId:
        '20260004',

      dia:
        'Quinta',

      horario:
        '19:00',

      horarioFim:
        '22:00',

      sala:
        'Digital',
    },


    {
      id: 'T-SAS01',

      disciplinaId:
        'SAS01',

      professorId:
        '20260004',

      dia:
        'Quinta',

      horario:
        '19:00',

      horarioFim:
        '22:00',

      sala:
        'Digital',
    },


    // ==================================================
    // SEXTA-FEIRA
    // Tássio Sirqueira
    // ==================================================

    {
      id: 'T-GQT01',

      disciplinaId:
        'GQT01',

      professorId:
        '20260005',

      dia:
        'Sexta',

      horario:
        '19:00',

      horarioFim:
        '22:00',

      sala:
        'Laboratório de Informática 2',
    },


    // ==================================================
    // SÁBADO
    // Tássio Sirqueira
    // ==================================================

    {
      id: 'T-LDAH01',

      disciplinaId:
        'LDAH01',

      professorId:
        '20260005',

      dia:
        'Sábado',

      horario:
        '19:00',

      horarioFim:
        '22:00',

      sala:
        'Laboratório de Informática 2',
    },
  ],


  // ====================================================
  // MATRÍCULAS DOS ALUNOS
  // ====================================================
  //
  // Richard, Bruno e Lucas pertencem às mesmas
  // disciplinas do 7º período.
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


    // ==================================================
    // LUCAS
    // ==================================================

    {
      matricula: '202312096',
      turmaId: 'T-GME01',
    },

    {
      matricula: '202312096',
      turmaId: 'T-DJD01',
    },

    {
      matricula: '202312096',
      turmaId: 'T-PFC01',
    },

    {
      matricula: '202312096',
      turmaId: 'T-DEC01',
    },

    {
      matricula: '202312096',
      turmaId: 'T-SAS01',
    },

    {
      matricula: '202312096',
      turmaId: 'T-GQT01',
    },

    {
      matricula: '202312096',
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


    // ==================================================
    // BASE NOVA OU VERSÃO DESATUALIZADA
    // ==================================================

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
// OBTER LISTA E CAMPO DE IDENTIFICAÇÃO
// ======================================================

function obterDadosTipo(
  base,
  tipo
) {

  if (
    tipo ===
    'professor'
  ) {

    return {
      lista:
        base.professores,

      campo:
        'identificador',
    };
  }


  return {
    lista:
      base.alunos,

    campo:
      'matricula',
  };
}


// ======================================================
// VERIFICAR PRIMEIRO ACESSO
// ======================================================
//
// Apenas verifica se:
//
// 1. o usuário existe;
// 2. ainda está aguardando ativação.
//
// Não altera a base.
// ======================================================

export async function verificarPrimeiroAcesso(
  tipo,
  identificador
) {

  try {

    const base =
      await carregarBase();


    const {
      lista,
      campo,
    } =
      obterDadosTipo(
        base,
        tipo
      );


    const procurado =
      identificador
        .trim()
        .toLowerCase();


    const usuario =
      lista.find(
        (item) =>
          item[campo]
            .toLowerCase() ===
          procurado
      );


    if (!usuario) {

      return {
        ok: false,

        erro:
          tipo === 'professor'
            ? 'Matrícula funcional não encontrada.'
            : 'Matrícula não encontrada.',
      };
    }


    if (
      usuario.primeiroAcesso !==
      true
    ) {

      return {
        ok: false,

        erro:
          'Este cadastro já foi ativado. Utilize o login normal.',
      };
    }


    const {
      senha: _senha,
      ...usuarioSemSenha
    } =
      usuario;


    return {
      ok: true,

      usuario:
        usuarioSemSenha,
    };

  } catch (error) {

    return {
      ok: false,

      erro:
        'Não foi possível verificar o cadastro.',
    };
  }
}


// ======================================================
// DEFINIR SENHA DO PRIMEIRO ACESSO
// ======================================================
//
// Essa função deve ser chamada somente depois das
// verificações realizadas pelo fluxo de primeiro acesso.
// ======================================================

export async function definirSenhaPrimeiroAcesso(
  tipo,
  identificador,
  novaSenha
) {

  try {

    const base =
      await carregarBase();


    const {
      lista,
      campo,
    } =
      obterDadosTipo(
        base,
        tipo
      );


    const procurado =
      identificador
        .trim()
        .toLowerCase();


    const indice =
      lista.findIndex(
        (item) =>
          item[campo]
            .toLowerCase() ===
          procurado
      );


    if (
      indice ===
      -1
    ) {

      return {
        ok: false,

        erro:
          'Cadastro não encontrado.',
      };
    }


    if (
      lista[indice]
        .primeiroAcesso !==
      true
    ) {

      return {
        ok: false,

        erro:
          'Este cadastro já foi ativado.',
      };
    }


    if (
      !novaSenha ||
      novaSenha.length < 6
    ) {

      return {
        ok: false,

        erro:
          'A senha deve possuir pelo menos 6 caracteres.',
      };
    }


    lista[indice].senha =
      novaSenha;


    lista[indice]
      .primeiroAcesso =
      false;


    const salvo =
      await salvarBase(
        base
      );


    if (!salvo) {

      return {
        ok: false,

        erro:
          'Não foi possível ativar o cadastro.',
      };
    }


    const {
      senha: _senha,
      ...usuarioSemSenha
    } =
      lista[indice];


    return {
      ok: true,

      usuario:
        usuarioSemSenha,
    };

  } catch (error) {

    return {
      ok: false,

      erro:
        'Ocorreu um erro ao ativar o cadastro.',
    };
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


  const {
    lista,
    campo,
  } =
    obterDadosTipo(
      base,
      tipo
    );


  const procurado =
    identificador
      .trim()
      .toLowerCase();


  // ====================================================
  // PROCURAR USUÁRIO
  // ====================================================

  const usuario =
    lista.find(
      (item) =>
        item[campo]
          .toLowerCase() ===
        procurado
    );


  if (!usuario) {

    return {
      ok: false,

      erro:
        'Login ou senha incorretos.',
    };
  }


  // ====================================================
  // PRIMEIRO ACESSO AINDA NÃO REALIZADO
  // ====================================================

  if (
    usuario.primeiroAcesso ===
    true
  ) {

    return {
      ok: false,

      primeiroAcesso: true,

      erro:
        'Este cadastro ainda não foi ativado. Utilize a opção Primeiro acesso.',
    };
  }


  // ====================================================
  // VALIDAR SENHA
  // ====================================================

  if (
    usuario.senha !==
    senha
  ) {

    return {
      ok: false,

      erro:
        'Login ou senha incorretos.',
    };
  }


  const {
    senha: _senha,
    ...usuarioSemSenha
  } =
    usuario;


  return {
    ok: true,

    usuario:
      usuarioSemSenha,
  };
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


    const {
      lista,
      campo,
    } =
      obterDadosTipo(
        base,
        tipo
      );


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


    if (
      indice ===
      -1
    ) {

      return {
        ok: false,

        erro:
          'Usuário não encontrado.',
      };
    }


    // ==================================================
    // USUÁRIO AINDA NÃO REALIZOU PRIMEIRO ACESSO
    // ==================================================

    if (
      lista[indice]
        .primeiroAcesso ===
      true
    ) {

      return {
        ok: false,

        erro:
          'Este cadastro ainda não foi ativado.',
      };
    }


    // ==================================================
    // SENHA ATUAL
    // ==================================================

    if (
      lista[indice].senha !==
      senhaAtual
    ) {

      return {
        ok: false,

        erro:
          'A senha atual está incorreta.',
      };
    }


    // ==================================================
    // TAMANHO DA NOVA SENHA
    // ==================================================

    if (
      !novaSenha ||
      novaSenha.length < 6
    ) {

      return {
        ok: false,

        erro:
          'A nova senha deve possuir pelo menos 6 caracteres.',
      };
    }


    // ==================================================
    // NÃO REPETIR SENHA
    // ==================================================

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


    // ==================================================
    // ALTERAR
    // ==================================================

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