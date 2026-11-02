import {
  listarPendentesSincronizacao,
  marcarComoSincronizada,
} from '../banco/sqlite';

import {
  atualizarTarefaAPI,
  criarTarefaAPI,
  testarConexaoAPI,
} from './tarefasApi';


export async function sincronizarTarefas() {
  try {

    const conexao =
      await testarConexaoAPI();


    if (
      !conexao.ok
    ) {
      return {
        ok:
          false,

        online:
          false,

        sincronizadas:
          0,

        erros:
          0,
      };
    }


    const pendentes =
      await listarPendentesSincronizacao();


    if (
      pendentes.length ===
      0
    ) {
      return {
        ok:
          true,

        online:
          true,

        sincronizadas:
          0,

        erros:
          0,
      };
    }


    let totalSincronizadas =
      0;

    let totalErros =
      0;


    for (
      const tarefa
      of pendentes
    ) {

      try {

        if (
          tarefa.remoteId
        ) {

          try {

            const tarefaRemota =
              await atualizarTarefaAPI(
                tarefa.remoteId,
                tarefa
              );


            const remoteId =
              tarefaRemota?.id ||
              tarefa.remoteId;


            const marcada =
              await marcarComoSincronizada(
                tarefa.id,
                remoteId
              );


            if (
              !marcada
            ) {
              throw new Error(
                'Não foi possível marcar a tarefa como sincronizada.'
              );
            }

          } catch (error) {

            if (
              error.status !==
              404
            ) {
              throw error;
            }


            const novaTarefaRemota =
              await criarTarefaAPI(
                tarefa
              );


            if (
              !novaTarefaRemota ||
              !novaTarefaRemota.id
            ) {
              throw new Error(
                'A API não retornou o ID da tarefa.'
              );
            }


            const marcada =
              await marcarComoSincronizada(
                tarefa.id,
                novaTarefaRemota.id
              );


            if (
              !marcada
            ) {
              throw new Error(
                'Não foi possível atualizar o identificador remoto.'
              );
            }
          }

        } else {

          const tarefaRemota =
            await criarTarefaAPI(
              tarefa
            );


          if (
            !tarefaRemota ||
            !tarefaRemota.id
          ) {
            throw new Error(
              'A API não retornou o ID da tarefa.'
            );
          }


          const marcada =
            await marcarComoSincronizada(
              tarefa.id,
              tarefaRemota.id
            );


          if (
            !marcada
          ) {
            throw new Error(
              'Não foi possível marcar a tarefa como sincronizada.'
            );
          }
        }


        totalSincronizadas +=
          1;

      } catch (error) {

        totalErros +=
          1;
      }
    }


    return {
      ok:
        totalErros ===
        0,

      online:
        true,

      sincronizadas:
        totalSincronizadas,

      erros:
        totalErros,
    };

  } catch (error) {

    return {
      ok:
        false,

      online:
        false,

      sincronizadas:
        0,

      erros:
        0,
    };
  }
}