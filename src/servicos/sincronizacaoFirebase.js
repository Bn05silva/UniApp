import {
  listarPendentesFirebase,
  marcarComoSincronizadaFirebase,
} from '../banco/sqlite';

import {
  atualizarTarefaFirebase,
  criarTarefaFirebase,
  testarFirebase,
} from './firebaseTarefas';


export async function sincronizarTarefasFirebase() {
  try {

    const conexao =
      await testarFirebase();


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
      await listarPendentesFirebase();


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
          tarefa.firebaseId
        ) {

          try {

            await atualizarTarefaFirebase(
              tarefa.firebaseId,
              tarefa
            );


            const marcada =
              await marcarComoSincronizadaFirebase(
                tarefa.id,
                tarefa.firebaseId
              );


            if (
              !marcada
            ) {
              throw new Error(
                'Não foi possível atualizar o status do Firebase.'
              );
            }

          } catch (error) {

            if (
              error.code !==
              'not-found'
            ) {
              throw error;
            }


            const novaTarefa =
              await criarTarefaFirebase(
                tarefa
              );


            if (
              !novaTarefa ||
              !novaTarefa.firebaseId
            ) {
              throw new Error(
                'O Firebase não retornou um identificador.'
              );
            }


            const marcada =
              await marcarComoSincronizadaFirebase(
                tarefa.id,
                novaTarefa.firebaseId
              );


            if (
              !marcada
            ) {
              throw new Error(
                'Não foi possível salvar o novo identificador do Firebase.'
              );
            }
          }

        } else {

          const tarefaFirebase =
            await criarTarefaFirebase(
              tarefa
            );


          if (
            !tarefaFirebase ||
            !tarefaFirebase.firebaseId
          ) {
            throw new Error(
              'O Firebase não retornou um identificador.'
            );
          }


          const marcada =
            await marcarComoSincronizadaFirebase(
              tarefa.id,
              tarefaFirebase.firebaseId
            );


          if (
            !marcada
          ) {
            throw new Error(
              'Não foi possível marcar a tarefa como sincronizada no Firebase.'
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