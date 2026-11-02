const express =
  require('express');

const cors =
  require('cors');

const fs =
  require('fs');

const path =
  require('path');


const app =
  express();

const PORT =
  3000;

const ARQUIVO_DADOS =
  path.join(
    __dirname,
    'tarefas.json'
  );


app.use(
  cors()
);

app.use(
  express.json()
);


function carregarTarefas() {
  try {

    if (
      !fs.existsSync(
        ARQUIVO_DADOS
      )
    ) {
      return [];
    }


    const conteudo =
      fs.readFileSync(
        ARQUIVO_DADOS,
        'utf8'
      );


    if (
      !conteudo.trim()
    ) {
      return [];
    }


    return JSON.parse(
      conteudo
    );

  } catch (error) {

    return [];
  }
}


function salvarTarefas(
  tarefas
) {

  fs.writeFileSync(
    ARQUIVO_DADOS,
    JSON.stringify(
      tarefas,
      null,
      2
    ),
    'utf8'
  );
}


app.get(
  '/',
  (
    req,
    res
  ) => {

    res.json({
      nome:
        'UniClass API',

      status:
        'online',
    });
  }
);


app.get(
  '/tasks',
  (
    req,
    res
  ) => {

    res.json(
      carregarTarefas()
    );
  }
);


app.get(
  '/tasks/:id',
  (
    req,
    res
  ) => {

    const tarefas =
      carregarTarefas();


    const tarefa =
      tarefas.find(
        (
          item
        ) =>
          String(
            item.id
          ) ===
          String(
            req.params.id
          )
      );


    if (
      !tarefa
    ) {

      return res
        .status(
          404
        )
        .json({
          erro:
            'Tarefa não encontrada.',
        });
    }


    res.json(
      tarefa
    );
  }
);


app.post(
  '/tasks',
  (
    req,
    res
  ) => {

    const {
      titulo,
      descricao = '',
      disciplina = '',
      dataEntrega = '',
      concluida = false,
    } =
      req.body;


    if (
      !titulo ||
      !titulo.trim()
    ) {

      return res
        .status(
          400
        )
        .json({
          erro:
            'O título é obrigatório.',
        });
    }


    const tarefas =
      carregarTarefas();


    const agora =
      new Date()
        .toISOString();


    const novaTarefa = {

      id:
        Date.now()
          .toString(),

      titulo:
        titulo.trim(),

      descricao:
        descricao.trim(),

      disciplina:
        disciplina.trim(),

      dataEntrega,

      concluida:
        Boolean(
          concluida
        ),

      criadoEm:
        agora,

      atualizadoEm:
        agora,
    };


    tarefas.push(
      novaTarefa
    );


    salvarTarefas(
      tarefas
    );


    res
      .status(
        201
      )
      .json(
        novaTarefa
      );
  }
);


app.put(
  '/tasks/:id',
  (
    req,
    res
  ) => {

    const tarefas =
      carregarTarefas();


    const indice =
      tarefas.findIndex(
        (
          item
        ) =>
          String(
            item.id
          ) ===
          String(
            req.params.id
          )
      );


    if (
      indice ===
      -1
    ) {

      return res
        .status(
          404
        )
        .json({
          erro:
            'Tarefa não encontrada.',
        });
    }


    const tarefaAtual =
      tarefas[
        indice
      ];


    const tarefaAtualizada = {

      ...tarefaAtual,

      titulo:
        req.body.titulo ??
        tarefaAtual.titulo,

      descricao:
        req.body.descricao ??
        tarefaAtual.descricao,

      disciplina:
        req.body.disciplina ??
        tarefaAtual.disciplina,

      dataEntrega:
        req.body.dataEntrega ??
        tarefaAtual.dataEntrega,

      concluida:
        req.body.concluida ??
        tarefaAtual.concluida,

      atualizadoEm:
        new Date()
          .toISOString(),
    };


    tarefas[
      indice
    ] =
      tarefaAtualizada;


    salvarTarefas(
      tarefas
    );


    res.json(
      tarefaAtualizada
    );
  }
);


app.delete(
  '/tasks/:id',
  (
    req,
    res
  ) => {

    const tarefas =
      carregarTarefas();


    const indice =
      tarefas.findIndex(
        (
          item
        ) =>
          String(
            item.id
          ) ===
          String(
            req.params.id
          )
      );


    if (
      indice ===
      -1
    ) {

      return res
        .status(
          404
        )
        .json({
          erro:
            'Tarefa não encontrada.',
        });
    }


    tarefas.splice(
      indice,
      1
    );


    salvarTarefas(
      tarefas
    );


    res.json({
      ok:
        true,
    });
  }
);


app.listen(
  PORT,
  '0.0.0.0',
  () => {

    console.log(
      `UniClass API rodando na porta ${PORT}`
    );
  }
);