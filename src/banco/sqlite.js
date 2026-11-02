import * as SQLite from 'expo-sqlite';


let banco = null;


async function obterBanco() {
  if (!banco) {
    banco =
      await SQLite.openDatabaseAsync(
        'uniclass.db'
      );
  }

  return banco;
}


export async function inicializarBanco() {
  const db =
    await obterBanco();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      remote_id TEXT,
      titulo TEXT NOT NULL,
      descricao TEXT,
      disciplina TEXT,
      data_entrega TEXT,
      concluida INTEGER NOT NULL DEFAULT 0,
      sincronizado INTEGER NOT NULL DEFAULT 0,
      criado_em TEXT NOT NULL,
      atualizado_em TEXT NOT NULL
    );
  `);

  return true;
}


export async function criarTarefa({
  titulo,
  descricao = '',
  disciplina = '',
  dataEntrega = '',
}) {
  const db =
    await obterBanco();

  const agora =
    new Date().toISOString();

  const resultado =
    await db.runAsync(
      `
        INSERT INTO tarefas (
          titulo,
          descricao,
          disciplina,
          data_entrega,
          concluida,
          sincronizado,
          criado_em,
          atualizado_em
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        titulo.trim(),
        descricao.trim(),
        disciplina.trim(),
        dataEntrega,
        0,
        0,
        agora,
        agora,
      ]
    );

  return {
    id:
      resultado.lastInsertRowId,
    titulo:
      titulo.trim(),
    descricao:
      descricao.trim(),
    disciplina:
      disciplina.trim(),
    dataEntrega,
    concluida:
      false,
    sincronizado:
      false,
    criadoEm:
      agora,
    atualizadoEm:
      agora,
  };
}


export async function listarTarefas() {
  const db =
    await obterBanco();

  const registros =
    await db.getAllAsync(`
      SELECT *
      FROM tarefas
      ORDER BY concluida ASC, criado_em DESC
    `);

  return registros.map(
    (item) => ({
      id:
        item.id,
      remoteId:
        item.remote_id,
      titulo:
        item.titulo,
      descricao:
        item.descricao,
      disciplina:
        item.disciplina,
      dataEntrega:
        item.data_entrega,
      concluida:
        item.concluida === 1,
      sincronizado:
        item.sincronizado === 1,
      criadoEm:
        item.criado_em,
      atualizadoEm:
        item.atualizado_em,
    })
  );
}


export async function buscarTarefaPorId(
  id
) {
  const db =
    await obterBanco();

  const item =
    await db.getFirstAsync(
      `
        SELECT *
        FROM tarefas
        WHERE id = ?
      `,
      [
        id,
      ]
    );

  if (!item) {
    return null;
  }

  return {
    id:
      item.id,
    remoteId:
      item.remote_id,
    titulo:
      item.titulo,
    descricao:
      item.descricao,
    disciplina:
      item.disciplina,
    dataEntrega:
      item.data_entrega,
    concluida:
      item.concluida === 1,
    sincronizado:
      item.sincronizado === 1,
    criadoEm:
      item.criado_em,
    atualizadoEm:
      item.atualizado_em,
  };
}


export async function atualizarTarefa(
  id,
  {
    titulo,
    descricao = '',
    disciplina = '',
    dataEntrega = '',
  }
) {
  const db =
    await obterBanco();

  const agora =
    new Date().toISOString();

  const resultado =
    await db.runAsync(
      `
        UPDATE tarefas
        SET
          titulo = ?,
          descricao = ?,
          disciplina = ?,
          data_entrega = ?,
          sincronizado = 0,
          atualizado_em = ?
        WHERE id = ?
      `,
      [
        titulo.trim(),
        descricao.trim(),
        disciplina.trim(),
        dataEntrega,
        agora,
        id,
      ]
    );

  return (
    resultado.changes >
    0
  );
}


export async function alterarStatusTarefa(
  id,
  concluida
) {
  const db =
    await obterBanco();

  const agora =
    new Date().toISOString();

  const resultado =
    await db.runAsync(
      `
        UPDATE tarefas
        SET
          concluida = ?,
          sincronizado = 0,
          atualizado_em = ?
        WHERE id = ?
      `,
      [
        concluida
          ? 1
          : 0,
        agora,
        id,
      ]
    );

  return (
    resultado.changes >
    0
  );
}


export async function removerTarefa(
  id
) {
  const db =
    await obterBanco();

  const resultado =
    await db.runAsync(
      `
        DELETE FROM tarefas
        WHERE id = ?
      `,
      [
        id,
      ]
    );

  return (
    resultado.changes >
    0
  );
}


export async function listarPendentesSincronizacao() {
  const db =
    await obterBanco();

  const registros =
    await db.getAllAsync(`
      SELECT *
      FROM tarefas
      WHERE sincronizado = 0
      ORDER BY criado_em ASC
    `);

  return registros.map(
    (item) => ({
      id:
        item.id,
      remoteId:
        item.remote_id,
      titulo:
        item.titulo,
      descricao:
        item.descricao,
      disciplina:
        item.disciplina,
      dataEntrega:
        item.data_entrega,
      concluida:
        item.concluida === 1,
      sincronizado:
        false,
      criadoEm:
        item.criado_em,
      atualizadoEm:
        item.atualizado_em,
    })
  );
}


export async function marcarComoSincronizada(
  id,
  remoteId = null
) {
  const db =
    await obterBanco();

  const resultado =
    await db.runAsync(
      `
        UPDATE tarefas
        SET
          remote_id = ?,
          sincronizado = 1
        WHERE id = ?
      `,
      [
        remoteId,
        id,
      ]
    );

  return (
    resultado.changes >
    0
  );
}


export async function limparTarefas() {
  const db =
    await obterBanco();

  await db.runAsync(
    'DELETE FROM tarefas'
  );

  return true;
}