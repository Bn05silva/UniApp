# UniClass

## 1. Apresentação do projeto

O UniApp é um aplicativo acadêmico desenvolvido em React Native com Expo com o objetivo de auxiliar no processo de registro de presença dos alunos.

A proposta do projeto é tornar esse processo mais seguro e organizado utilizando recursos disponíveis em dispositivos móveis, como biometria, câmera e localização GPS.

O sistema possui dois tipos de acesso: aluno e professor. Cada usuário possui funções diferentes dentro do aplicativo, de acordo com o seu perfil acadêmico.

Nesta versão, o projeto funciona de forma local e utiliza o AsyncStorage para armazenar as informações necessárias para a demonstração das funcionalidades.


## 2. Objetivo

O principal objetivo do UniApp é permitir que o registro de presença seja realizado somente quando determinadas condições forem atendidas.

Para registrar a presença, o aluno precisa estar matriculado na turma correspondente, utilizar um QR Code válido gerado pelo professor e estar fisicamente próximo ao campus.

Dessa forma, o aplicativo combina diferentes recursos do dispositivo para criar um fluxo de presença mais confiável.


## 3. Autenticação

Ao abrir o aplicativo, o usuário pode selecionar o tipo de acesso entre aluno e professor.

O primeiro passo é informar a matrícula e a senha cadastrada no sistema.

Após a validação dessas informações, o aplicativo solicita a autenticação biométrica disponível no dispositivo.

A biometria funciona como uma segunda etapa de confirmação antes de liberar o acesso ao sistema.

O fluxo de entrada é:

Matrícula e senha → Biometria → Área do usuário


## 4. Área do aluno

Após realizar o login, o aluno possui acesso à sua área acadêmica.

Na tela inicial são apresentadas informações relacionadas ao próprio aluno, como curso, período e próxima aula.

A próxima aula é calculada automaticamente utilizando a grade de disciplinas cadastrada no sistema.

O aplicativo identifica as turmas em que o aluno está matriculado e compara os dias e horários para determinar qual será a próxima aula.

Também é apresentado um resumo das presenças já registradas pelo aluno.


## 5. Perfil do aluno

Na área de perfil são apresentadas as informações acadêmicas do estudante.

Dados como nome, matrícula, e-mail acadêmico, curso e período são considerados informações institucionais e, por isso, não podem ser alterados pelo aluno.

O aluno pode alterar apenas sua foto de perfil e sua senha.

Quando a senha é modificada, a nova informação é armazenada localmente por meio do AsyncStorage.


## 6. Área do professor

O professor também possui uma área específica dentro do aplicativo.

Após realizar o login e confirmar a biometria, o sistema apresenta somente as turmas vinculadas à sua conta.

Em cada turma são exibidas informações como disciplina, dia da semana, horário, sala e alunos matriculados.

Essas informações representam a grade acadêmica definida pela instituição.

Por esse motivo, o professor pode visualizar esses dados, mas não possui permissão para modificar a grade ou adicionar e remover alunos das turmas.


## 7. Início da aula

Para iniciar o processo de presença, o professor seleciona uma de suas turmas e utiliza a opção de iniciar aula.

Nesse momento, o aplicativo gera um QR Code específico para aquela sessão.

O QR Code contém informações necessárias para a validação da presença, como turma, professor, data, identificação da sessão e período de validade.

Nesta versão do projeto, cada QR Code permanece válido durante 180 minutos.

Após esse período, o código não pode mais ser utilizado para registrar presença.


## 8. Registro de presença

O aluno registra sua presença utilizando a câmera do dispositivo para ler o QR Code exibido pelo professor.

Após a leitura, o sistema realiza automaticamente diversas verificações antes de confirmar o registro.

Primeiramente, o aplicativo verifica se o QR Code pertence ao sistema, se ainda está dentro do período de validade e se corresponde ao dia atual.

Depois disso, é verificado se a turma existe, se o aluno está matriculado nela e se o professor presente no QR Code corresponde ao professor vinculado à turma.

Somente após essas verificações o aplicativo solicita a localização atual do aluno.


## 9. Validação por localização

A localização do aluno é obtida automaticamente no momento da leitura do QR Code.

O sistema compara a posição atual do dispositivo com a localização definida para o campus.

Para que a presença seja registrada, o aluno deve estar dentro de um raio máximo de 150 metros.

Caso o estudante esteja fora dessa área, a presença é recusada e uma mensagem é apresentada na própria tela.


## 10. Proteção contra presença duplicada

O sistema também possui validações para impedir registros duplicados.

Um aluno não pode utilizar duas vezes o mesmo QR Code para registrar presença.

Além disso, mesmo que o professor gere um novo QR Code para a mesma turma, o aluno não poderá registrar novamente a presença naquela disciplina no mesmo dia.

Essa verificação utiliza a matrícula do aluno, a turma e a data da aula.


## 11. Histórico de presenças

Depois que a presença é confirmada, o registro é salvo no AsyncStorage.

Cada aluno possui seu próprio histórico de presença, identificado pela matrícula.

Isso evita que dois estudantes utilizando o mesmo aparelho tenham seus registros misturados.

O histórico é organizado por disciplina e apresenta informações como data, horário, professor, sala e distância do campus no momento do registro.


## 12. Fluxo completo de presença

O processo principal do sistema funciona da seguinte maneira:

Professor realiza login  
→ confirma a biometria  
→ seleciona uma turma  
→ inicia a aula  
→ QR Code é gerado  

Aluno realiza login  
→ confirma a biometria  
→ abre a opção de presença  
→ lê o QR Code  
→ sistema valida o código  
→ verifica matrícula e turma  
→ verifica professor e data  
→ verifica validade do QR Code  
→ captura a localização  
→ verifica o raio de 150 metros  
→ registra a presença  
→ salva o registro no AsyncStorage


## 13. Recursos utilizados

O projeto utiliza recursos presentes em dispositivos móveis para demonstrar a proposta do sistema.

A câmera é utilizada para leitura do QR Code da aula.

O GPS é utilizado para obter a localização atual do aluno.

A biometria é utilizada como segunda etapa de autenticação no login.

O AsyncStorage é responsável pela persistência local das informações utilizadas pelo aplicativo.

O mapa permite visualizar a localização do campus e a posição atual do usuário.


## 14. Tecnologias utilizadas

O UniApp foi desenvolvido utilizando React Native com Expo.

Entre as principais bibliotecas utilizadas estão:

- React Native
- Expo
- Expo Camera
- Expo Location
- Expo Local Authentication
- Expo Image Picker
- React Navigation
- React Native Maps
- React Native QR Code SVG
- AsyncStorage


## 15. Armazenamento dos dados

Nesta versão do projeto não existe um servidor ou banco de dados externo.

Os dados necessários para a demonstração são armazenados localmente utilizando o AsyncStorage.

Essa solução atende ao objetivo acadêmico do protótipo e permite demonstrar o funcionamento das funcionalidades principais sem a necessidade de uma infraestrutura de servidor.


## 16. Limitação da versão atual

Como o armazenamento é local, diferentes dispositivos não compartilham automaticamente os registros de presença.

Por exemplo, a presença registrada no celular de um aluno não é enviada automaticamente para o celular do professor.

Em uma versão de produção, seria necessária a utilização de uma API juntamente com um banco de dados centralizado.

Dessa forma, professores, alunos e instituição poderiam acessar informações sincronizadas em diferentes dispositivos.


## 17. Estrutura geral do sistema

O projeto foi organizado em componentes e telas responsáveis por diferentes partes do aplicativo.

Existem áreas específicas para autenticação, câmera, GPS, perfil, tela inicial, turmas do professor e registro de presença.

Essa separação facilita a manutenção do código e permite que cada funcionalidade possua uma responsabilidade definida.


## 18. Executando o projeto

Primeiramente, é necessário instalar as dependências:

```bash
npm install