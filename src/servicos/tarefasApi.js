import {
  API_URL,
} from '../config/api';


async function tratarResposta(
  resposta
) {
  let dados = null;

  try {
    dados =
      await resposta.json();
  } catch (error) {
    dados = null;
  }

  if (
    !resposta.ok
  ) {
    throw new Error(
      dados?.erro ||
      'Erro ao acessar a API.'
    );
  }

  return dados;
}


export async function listarTarefasAPI() {
  const resposta =
    await fetch(
      `${API_URL}/tasks`
    );

  return tratarResposta(
    resposta
  );
}


export async function criarTarefaAPI(
  tarefa
) {
  const resposta =
    await fetch(
      `${API_URL}/tasks`,
      {
        method:
          'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify({
            titulo:
              tarefa.titulo,

            descricao:
              tarefa.descricao ||
              '',

            disciplina:
              tarefa.disciplina ||
              '',

            dataEntrega:
              tarefa.dataEntrega ||
              '',

            concluida:
              Boolean(
                tarefa.concluida
              ),
          }),
      }
    );

  return tratarResposta(
    resposta
  );
}


export async function atualizarTarefaAPI(
  remoteId,
  tarefa
) {
  const resposta =
    await fetch(
      `${API_URL}/tasks/${remoteId}`,
      {
        method:
          'PUT',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify({
            titulo:
              tarefa.titulo,

            descricao:
              tarefa.descricao ||
              '',

            disciplina:
              tarefa.disciplina ||
              '',

            dataEntrega:
              tarefa.dataEntrega ||
              '',

            concluida:
              Boolean(
                tarefa.concluida
              ),
          }),
      }
    );

  return tratarResposta(
    resposta
  );
}


export async function removerTarefaAPI(
  remoteId
) {
  const resposta =
    await fetch(
      `${API_URL}/tasks/${remoteId}`,
      {
        method:
          'DELETE',
      }
    );

  return tratarResposta(
    resposta
  );
}


export async function testarConexaoAPI() {
  try {

    const resposta =
      await fetch(
        API_URL
      );


    if (
      !resposta.ok
    ) {
      return {
        ok:
          false,
      };
    }


    const dados =
      await resposta.json();


    return {
      ok:
        true,

      dados,
    };

  } catch (error) {

    return {
      ok:
        false,

      erro:
        'API indisponível.',
    };
  }
}
