import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import {
  db,
} from '../config/firebase';


const COLECAO =
  'tarefas';


export async function listarTarefasFirebase() {
  const referencia =
    collection(
      db,
      COLECAO
    );


  const resultado =
    await getDocs(
      referencia
    );


  return resultado.docs.map(
    (item) => ({
      firebaseId:
        item.id,

      ...item.data(),
    })
  );
}


export async function buscarTarefaFirebase(
  firebaseId
) {
  const referencia =
    doc(
      db,
      COLECAO,
      firebaseId
    );


  const resultado =
    await getDoc(
      referencia
    );


  if (
    !resultado.exists()
  ) {
    return null;
  }


  return {
    firebaseId:
      resultado.id,

    ...resultado.data(),
  };
}


export async function criarTarefaFirebase(
  tarefa
) {
  const referencia =
    collection(
      db,
      COLECAO
    );


  const resultado =
    await addDoc(
      referencia,
      {
        localId:
          tarefa.id
            ? String(
                tarefa.id
              )
            : null,

        apiRemoteId:
          tarefa.remoteId
            ? String(
                tarefa.remoteId
              )
            : null,

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

        criadoEm:
          serverTimestamp(),

        atualizadoEm:
          serverTimestamp(),
      }
    );


  return {
    firebaseId:
      resultado.id,
  };
}


export async function atualizarTarefaFirebase(
  firebaseId,
  tarefa
) {
  const referencia =
    doc(
      db,
      COLECAO,
      firebaseId
    );


  await updateDoc(
    referencia,
    {
      localId:
        tarefa.id
          ? String(
              tarefa.id
            )
          : null,

      apiRemoteId:
        tarefa.remoteId
          ? String(
              tarefa.remoteId
            )
          : null,

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

      atualizadoEm:
        serverTimestamp(),
    }
  );


  return true;
}


export async function removerTarefaFirebase(
  firebaseId
) {
  const referencia =
    doc(
      db,
      COLECAO,
      firebaseId
    );


  await deleteDoc(
    referencia
  );


  return true;
}


export async function testarFirebase() {
  try {

    const referencia =
      collection(
        db,
        COLECAO
      );


    await getDocs(
      referencia
    );


    return {
      ok:
        true,
    };

  } catch (error) {

    return {
      ok:
        false,

      erro:
        error.message,
    };
  }
}