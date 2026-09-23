# UniClass

O UniClass é um aplicativo acadêmico desenvolvido em React Native com Expo para auxiliar no registro de presença dos alunos.

O projeto utiliza recursos de dispositivos móveis, como biometria, câmera e localização GPS, para criar um fluxo de presença mais seguro e organizado.

## Funcionalidades

O sistema possui dois tipos de acesso:

- Aluno
- Professor

### Primeiro acesso

Alunos e professores já possuem cadastro institucional no sistema.

No primeiro acesso, o usuário informa sua matrícula, define uma senha e confirma sua identidade utilizando a autenticação disponível no dispositivo.

Depois da ativação, os próximos acessos são realizados com matrícula, senha e biometria.

### Área do aluno

O aluno pode:

- visualizar curso e período;
- consultar a próxima aula;
- visualizar suas presenças;
- registrar presença por QR Code;
- visualizar o mapa do campus;
- consultar seus dados acadêmicos;
- alterar foto e senha.

As informações institucionais, como nome, matrícula, curso e período, não podem ser alteradas pelo aluno.

### Área do professor

O professor visualiza apenas as turmas vinculadas à sua matrícula funcional.

Em cada turma são apresentados:

- disciplina;
- dia e horário;
- sala;
- alunos matriculados.

O professor pode iniciar uma aula e gerar um QR Code temporário para o registro de presença.

Também existe um histórico organizado por disciplina e data com os alunos que registraram presença.

## Registro de presença

O fluxo funciona da seguinte forma:

Professor inicia a aula  
→ QR Code é gerado  
→ aluno lê o QR Code  
→ sistema valida turma, professor e matrícula  
→ verifica a validade do QR Code  
→ captura a localização do aluno  
→ verifica o raio do campus  
→ registra a presença

O aluno precisa estar dentro de um raio máximo de **150 metros do campus**.

O QR Code possui validade de **180 minutos**.

O sistema também impede que o mesmo aluno registre mais de uma presença na mesma disciplina no mesmo dia.

## Dados de demonstração

### Login já ativado

Aluno:

- Matrícula: `202312084`
- Senha: `123456`

Professor:

- Matrícula funcional: `20260001`
- Senha: `123456`

### Primeiro acesso

Aluno:

- Matrícula: `202312096`

Professor:

- Matrícula funcional: `20260005`
- Professor: Tássio Sirqueira

Nos usuários de primeiro acesso, a senha é criada durante a ativação da conta.

## Tecnologias

- React Native
- Expo
- React Navigation
- AsyncStorage
- Expo Camera
- Expo Location
- Expo Local Authentication
- React Native Maps
- React Native QR Code SVG

## Armazenamento

Nesta versão, os dados são armazenados localmente utilizando o AsyncStorage.

Por isso, o protótipo não possui sincronização entre aparelhos diferentes.

Em uma versão de produção, o sistema poderia utilizar uma API e um banco de dados centralizado para sincronizar informações entre alunos, professores e instituição.

## Executando o projeto

Instale as dependências:

```bash
npm install
