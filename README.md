# UniClass

O UniClass é um aplicativo acadêmico desenvolvido em React Native com Expo para auxiliar alunos e professores no gerenciamento de presença, aulas e tarefas acadêmicas.

O projeto utiliza recursos do dispositivo, banco de dados local, API própria e Firebase para oferecer funcionamento online e offline.

## Tecnologias

- React Native
- Expo SDK 58
- JavaScript
- React Navigation
- AsyncStorage
- SQLite
- Node.js
- Express
- CORS
- Firebase
- Cloud Firestore
- Expo Camera
- Expo Location
- Expo Local Authentication
- Expo Image Picker

## Funcionalidades

### Aluno

- Login por matrícula e senha
- Primeiro acesso
- Autenticação biométrica
- Perfil do aluno
- Foto de perfil pela câmera ou galeria
- Registro de presença
- Leitura de QR Code
- Validação de localização por GPS
- Validação de distância até o campus
- Histórico de presenças
- Visualização do mapa
- Gerenciamento de tarefas acadêmicas
- Criação, edição, conclusão e exclusão de tarefas
- Armazenamento local com SQLite
- Sincronização com API
- Sincronização com Firebase
- Funcionamento offline

### Professor

- Login por matrícula funcional e senha
- Primeiro acesso
- Autenticação biométrica
- Visualização das próprias disciplinas
- Início de aula
- Geração de QR Code para presença

## Fluxo de presença

```text
Login
↓
Biometria
↓
Tela inicial
↓
Registrar presença
↓
QR Code
↓
GPS
↓
Validação da aula
↓
Validação da matrícula
↓
Validação da data
↓
Validação da expiração do QR Code
↓
Validação da distância
↓
Presença registrada
```

O raio configurado para registro de presença é de 150 metros em relação ao campus.

## Tarefas acadêmicas

O módulo de tarefas utiliza três camadas:

```text
Aplicativo
↓
SQLite
↓
Backend API / Firebase
```

O SQLite é utilizado como banco local do aplicativo.

Cada tarefa pode possuir vínculo independente com:

```text
remote_id
→ Backend API

firebase_id
→ Firebase Firestore
```

Isso permite manter o aplicativo funcional mesmo quando não há conexão com a internet.

## Funcionamento offline

Quando uma tarefa é criada sem conexão:

```text
Usuário cria a tarefa
↓
SQLite salva localmente
↓
Tarefa fica pendente
```

A tarefa permanece disponível mesmo que o usuário navegue entre as telas do aplicativo.

Quando a conexão retorna:

```text
Usuário solicita sincronização
↓
Backend API recebe a tarefa
↓
Firebase recebe a tarefa
↓
SQLite recebe os identificadores remotos
↓
Tarefa passa para o estado Online
```

Na interface:

```text
Amarelo
→ Pendente

Verde
→ Online
```

Também são exibidos individualmente os estados da API e do Firebase.

## SQLite

O banco local utilizado é:

```text
uniclass.db
```

A tabela principal do módulo é:

```text
tarefas
```

Principais campos:

```text
id
remote_id
firebase_id
titulo
descricao
disciplina
data_entrega
concluida
sincronizado
firebase_sincronizado
criado_em
atualizado_em
```

## Backend

O backend está localizado na pasta:

```text
backend
```

Tecnologias utilizadas:

- Node.js
- Express
- CORS
- JSON para persistência da API

### Executar backend

```powershell
cd backend
npm start
```

A API utiliza por padrão a porta:

```text
3000
```

## Endpoints

### Verificar API

```text
GET /
```

### Listar tarefas

```text
GET /tasks
```

### Buscar tarefa

```text
GET /tasks/:id
```

### Criar tarefa

```text
POST /tasks
```

### Atualizar tarefa

```text
PUT /tasks/:id
```

### Excluir tarefa

```text
DELETE /tasks/:id
```

## Configuração da API

O endereço utilizado pelo aplicativo está em:

```text
src/config/api.js
```

Exemplo:

```js
export const API_URL =
  'http://IP_DO_COMPUTADOR:3000';
```

O celular e o computador devem estar na mesma rede local durante o uso da API local.

## Firebase

O projeto utiliza Cloud Firestore para armazenamento online das tarefas acadêmicas.

Configuração:

```text
src/config/firebase.js
```

Serviço de tarefas:

```text
src/servicos/firebaseTarefas.js
```

Sincronização:

```text
src/servicos/sincronizacaoFirebase.js
```

A coleção criada no Firestore é:

```text
tarefas
```

Os documentos são criados automaticamente pelo aplicativo durante a sincronização.

## Sincronização

A sincronização da API está em:

```text
src/servicos/sincronizacao.js
```

A sincronização do Firebase está em:

```text
src/servicos/sincronizacaoFirebase.js
```

Fluxo:

```text
SQLite
├── Backend API
└── Firebase Firestore
```

Uma tarefa só aparece completamente online quando a sincronização necessária foi concluída.

## Estrutura principal

```text
UniApp
├── assets
├── backend
│   ├── package.json
│   ├── server.js
│   └── tarefas.json
├── src
│   ├── banco
│   │   └── sqlite.js
│   ├── config
│   │   ├── api.js
│   │   └── firebase.js
│   ├── dados
│   ├── servicos
│   │   ├── firebaseTarefas.js
│   │   ├── sincronizacao.js
│   │   ├── sincronizacaoFirebase.js
│   │   └── tarefasApi.js
│   └── telas
│       └── Tarefas.js
├── App.js
├── app.json
├── package.json
└── README.md
```

## Executar o aplicativo

Instale as dependências:

```powershell
npm install
```

Inicie o Expo:

```powershell
npx expo start -c
```

Abra o projeto pelo Expo Go.

## Executar aplicativo e backend

Terminal 1:

```powershell
cd C:\Users\richa\Downloads\UniApp-GitHub
npx expo start -c
```

Terminal 2:

```powershell
cd C:\Users\richa\Downloads\UniApp-GitHub\backend
npm start
```

## Teste offline realizado

O funcionamento offline foi validado da seguinte forma:

```text
Internet desligada
↓
Nova tarefa criada
↓
Tarefa salva no SQLite
↓
Estado Pendente
↓
Navegação entre telas
↓
Tarefa permaneceu armazenada
↓
Internet religada
↓
Sincronização manual
↓
API e Firebase sincronizados
↓
Estado Online
```

## Situação atual

Implementado:

- SQLite
- Backend API de tarefas
- Configuração de API URL
- CRUD de tarefas
- Firebase Firestore
- Sincronização com Firebase
- Funcionamento offline
- Sincronização após recuperação da conexão

Próximas etapas da atividade:

- Testes automatizados com Jest
- Configuração do AdMob