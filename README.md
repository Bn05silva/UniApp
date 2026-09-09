# UniApp — P1

Aplicativo acadêmico desenvolvido em React Native com Expo para demonstrar um fluxo de validação de presença utilizando biometria, localização GPS e leitura de QR Code.

## Funcionalidades da P1

- Navegação por abas.
- Autenticação local com biometria.
- Captura da localização atual do aluno.
- Visualização do campus com `react-native-maps`.
- Leitura de QR Code pela câmera.
- Validação da distância entre o aluno e o Campus Vassouras.
- Registro e histórico de presenças.
- Persistência local com AsyncStorage.

## Componentização

```text
src/
├── biometria/
│   └── biometria.js
├── camera/
│   └── camera.js
├── componentes/
│   ├── add.js
│   └── list.js
├── gps/
│   └── gps.js
└── telas/
    ├── Mapa.js
    └── Presenca.js
```

A tela `Presenca.js` coordena o fluxo principal, enquanto biometria, GPS, câmera, formulário e lista ficam separados em componentes com responsabilidades específicas.

## Fluxo de presença

```text
Biometria → GPS → QR Code → Validação de distância → Registro → AsyncStorage
```

## Executar o projeto

```bash
npm install
npx expo start
```

Para testar biometria, GPS e câmera, é recomendado executar o aplicativo em um dispositivo compatível com esses recursos.
