import * as Location from 'expo-location';

// ======================================================
// OBTER LOCALIZAÇÃO ATUAL
// ======================================================

export async function obterLocalizacaoAtual() {
  try {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return {
        ok: false,
        erro:
          'A permissão de localização é necessária para registrar presença.',
      };
    }

    const location =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

    const {
      latitude,
      longitude,
    } = location.coords;

    return {
      ok: true,

      coords: {
        latitude,
        longitude,
      },
    };
  } catch (error) {
    return {
      ok: false,
      erro:
        'Não foi possível obter sua localização atual.',
    };
  }
}