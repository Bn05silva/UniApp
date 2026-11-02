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
        ok: false,
        online: false,
        sincronizadas: 0,
      };
    }


    const pendentes =
      await listarPendentesSincronizacao();


    if (
      pendentes.length === 0
    ) {
      return {
        ok: true,
        online: true,
        sincronizadas: 0,
      };
    }


    let totalSincronizadas =
      0;


    for (
      const tarefa
      of pendentes
    ) {

      try {

        if (
          tarefa.remoteId
        ) {

          await atualizarTarefaAPI(
            tarefa.remoteId,
            tarefa
          );


          await marcarComoSincronizada(
            tarefa.id,
            tarefa.remoteId
          );

        } else {

          const tarefaRemota =
            await criarTarefaAPI(
              tarefa
            );


          await marcarComoSincronizada(
            tarefa.id,
            tarefaRemota.id
          );
        }


        totalSincronizadas +=
          1;

      } catch (error) {

        continue;
      }
    }


    return {
      ok: true,
      online: true,
      sincronizadas:
        totalSincronizadas,
    };

  } catch (error) {

    return {
      ok: false,
      online: false,
      sincronizadas: 0,
    };
  }
}