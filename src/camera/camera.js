import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Camera,
  CameraView,
} from 'expo-camera';

import { Ionicons } from '@expo/vector-icons';

export default function LeitorCamera({
  onScanned,
  bloqueado = false,
}) {
  const [hasPermission, setHasPermission] =
    useState(null);

  const [ativo, setAtivo] =
    useState(false);

  const [scanned, setScanned] =
    useState(false);

  const [cameraPronta, setCameraPronta] =
    useState(false);

  const bloqueioLeitura =
    useRef(false);


  // ======================================================
  // PERMISSÃO DA CÂMERA
  // ======================================================

  useEffect(() => {
    solicitarPermissao();
  }, []);

  const solicitarPermissao = async () => {
    try {
      const { status } =
        await Camera.requestCameraPermissionsAsync();

      setHasPermission(
        status === 'granted'
      );
    } catch (error) {
      setHasPermission(false);
    }
  };


  // ======================================================
  // ABRIR CÂMERA
  // ======================================================

  const abrirCamera = () => {
    if (bloqueado) {
      return;
    }

    bloqueioLeitura.current = false;

    setScanned(false);

    setCameraPronta(false);

    setAtivo(true);
  };


  // ======================================================
  // FECHAR CÂMERA
  // ======================================================

  const fecharCamera = () => {
    setAtivo(false);

    setScanned(false);

    setCameraPronta(false);

    bloqueioLeitura.current = false;
  };


  // ======================================================
  // CÂMERA PRONTA
  // ======================================================

  const cameraCarregada = () => {
    setCameraPronta(true);
  };


  // ======================================================
  // QR CODE LIDO
  // ======================================================

  const handleBarCodeScanned = ({
    data,
  }) => {
    if (
      !cameraPronta ||
      bloqueioLeitura.current ||
      scanned
    ) {
      return;
    }

    bloqueioLeitura.current = true;

    setScanned(true);

    setAtivo(false);

    setCameraPronta(false);

    if (onScanned) {
      onScanned(data);
    }
  };


  // ======================================================
  // VERIFICANDO PERMISSÃO
  // ======================================================

  if (hasPermission === null) {
    return (
      <View style={styles.aviso}>
        <Text style={styles.textoAviso}>
          Verificando permissão da câmera...
        </Text>
      </View>
    );
  }


  // ======================================================
  // SEM PERMISSÃO
  // ======================================================

  if (hasPermission === false) {
    return (
      <View style={styles.aviso}>
        <Text style={styles.textoErro}>
          O acesso à câmera é necessário
          para registrar sua presença.
        </Text>

        <TouchableOpacity
          style={styles.botaoPermissao}
          onPress={solicitarPermissao}
        >
          <Text style={styles.textoBotao}>
            Permitir câmera
          </Text>
        </TouchableOpacity>
      </View>
    );
  }


  // ======================================================
  // CÂMERA FECHADA
  // ======================================================

  if (!ativo) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.botaoCamera,
            bloqueado &&
              styles.botaoBloqueado,
          ]}
          onPress={abrirCamera}
          disabled={bloqueado}
        >
          <Ionicons
            name="qr-code-outline"
            size={21}
            color="#fff"
          />

          <Text style={styles.textoBotao}>
            {bloqueado
              ? 'Validando presença...'
              : 'Ler QR Code da aula'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }


  // ======================================================
  // CÂMERA ABERTA
  // ======================================================

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>

        <CameraView
          style={styles.camera}
          facing="back"
          onCameraReady={cameraCarregada}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={
            cameraPronta && !scanned
              ? handleBarCodeScanned
              : undefined
          }
        />


        {/* CABEÇALHO */}

        <View
          style={styles.cabecalhoCamera}
          pointerEvents="box-none"
        >
          <View style={styles.instrucao}>
            <Ionicons
              name="qr-code-outline"
              size={17}
              color="#fff"
            />

            <Text style={styles.textoInstrucao}>
              Aponte para o QR Code
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botaoFechar}
            onPress={fecharCamera}
          >
            <Ionicons
              name="close"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>


        {/* QUADRO DO QR */}

        <View
          style={styles.overlay}
          pointerEvents="none"
        >
          <View style={styles.areaLeitura}>

            <View
              style={[
                styles.canto,
                styles.cantoSuperiorEsquerdo,
              ]}
            />

            <View
              style={[
                styles.canto,
                styles.cantoSuperiorDireito,
              ]}
            />

            <View
              style={[
                styles.canto,
                styles.cantoInferiorEsquerdo,
              ]}
            />

            <View
              style={[
                styles.canto,
                styles.cantoInferiorDireito,
              ]}
            />

          </View>
        </View>


        {/* RODAPÉ */}

        <View
          style={styles.rodapeCamera}
          pointerEvents="none"
        >
          <Text style={styles.textoRodape}>
            A presença será validada
            automaticamente após a leitura.
          </Text>
        </View>

      </View>
    </View>
  );
}


// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },


  // ====================================================
  // BOTÃO PRINCIPAL
  // ====================================================

  botaoCamera: {
    backgroundColor: '#a2181c',

    paddingVertical: 14,

    borderRadius: 10,

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',
  },

  botaoBloqueado: {
    opacity: 0.6,
  },

  textoBotao: {
    color: '#fff',

    fontWeight: 'bold',

    fontSize: 15,

    marginLeft: 8,
  },


  // ====================================================
  // PERMISSÃO
  // ====================================================

  aviso: {
    backgroundColor: '#fff',

    borderRadius: 12,

    padding: 16,

    marginBottom: 15,
  },

  textoAviso: {
    color: '#666',

    textAlign: 'center',
  },

  textoErro: {
    color: '#a2181c',

    textAlign: 'center',

    marginBottom: 12,
  },

  botaoPermissao: {
    backgroundColor: '#a2181c',

    borderRadius: 9,

    padding: 12,

    alignItems: 'center',
  },


  // ====================================================
  // CÂMERA
  // ====================================================

  cameraContainer: {
    width: '100%',

    height: 330,

    backgroundColor: '#000',

    borderRadius: 15,

    overflow: 'hidden',

    position: 'relative',
  },

  camera: {
    flex: 1,

    width: '100%',

    height: '100%',
  },


  // ====================================================
  // PARTE SUPERIOR
  // ====================================================

  cabecalhoCamera: {
    position: 'absolute',

    top: 12,

    left: 12,

    right: 12,

    zIndex: 10,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  instrucao: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor:
      'rgba(0, 0, 0, 0.65)',

    paddingHorizontal: 12,

    paddingVertical: 7,

    borderRadius: 18,
  },

  textoInstrucao: {
    color: '#fff',

    fontSize: 12,

    fontWeight: '600',

    marginLeft: 6,
  },

  botaoFechar: {
    width: 38,

    height: 38,

    borderRadius: 19,

    backgroundColor:
      'rgba(0, 0, 0, 0.65)',

    justifyContent: 'center',

    alignItems: 'center',
  },


  // ====================================================
  // QUADRO CENTRAL
  // ====================================================

  overlay: {
    position: 'absolute',

    top: 0,

    left: 0,

    right: 0,

    bottom: 0,

    justifyContent: 'center',

    alignItems: 'center',
  },

  areaLeitura: {
    width: 205,

    height: 205,

    position: 'relative',
  },

  canto: {
    position: 'absolute',

    width: 35,

    height: 35,

    borderColor: '#fff',
  },

  cantoSuperiorEsquerdo: {
    top: 0,
    left: 0,

    borderTopWidth: 4,
    borderLeftWidth: 4,

    borderTopLeftRadius: 10,
  },

  cantoSuperiorDireito: {
    top: 0,
    right: 0,

    borderTopWidth: 4,
    borderRightWidth: 4,

    borderTopRightRadius: 10,
  },

  cantoInferiorEsquerdo: {
    bottom: 0,
    left: 0,

    borderBottomWidth: 4,
    borderLeftWidth: 4,

    borderBottomLeftRadius: 10,
  },

  cantoInferiorDireito: {
    bottom: 0,
    right: 0,

    borderBottomWidth: 4,
    borderRightWidth: 4,

    borderBottomRightRadius: 10,
  },


  // ====================================================
  // RODAPÉ DA CÂMERA
  // ====================================================

  rodapeCamera: {
    position: 'absolute',

    bottom: 12,

    left: 20,

    right: 20,

    alignItems: 'center',
  },

  textoRodape: {
    color: '#fff',

    fontSize: 11,

    textAlign: 'center',

    backgroundColor:
      'rgba(0, 0, 0, 0.65)',

    paddingHorizontal: 12,

    paddingVertical: 6,

    borderRadius: 15,

    overflow: 'hidden',
  },
});