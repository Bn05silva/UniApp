# UniApp 

Aplicativo acadêmico desenvolvido em React Native com Expo para demonstrar um fluxo de validação de presença utilizando biometria, localização GPS e leitura de QR Code.

## Funcionalidades da P1

- Navegação por abas.
- Autenticação local com biometria.
- Captura da localização atual do aluno.
- Visualização do campus com `react-native-maps`.
- Leitura de QR Code pela câmera.
- Registro e histórico de presenças.
- Persistência local com AsyncStorage.

## Fluxo de presença


Biometria → GPS → QR Code → Validação de distância → Registro → AsyncStorage


## Executar o projeto


npm install
npx expo start



