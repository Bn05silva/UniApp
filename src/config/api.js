export const API_URL =
  'http://192.168.3.144:3000';


export async function verificarAPI() {
  try {

    const resposta =
      await fetch(
        API_URL
      );


    if (
      !resposta.ok
    ) {
      return {
        ok: false,
      };
    }


    const dados =
      await resposta.json();


    return {
      ok: true,
      dados,
    };

  } catch (error) {

    return {
      ok: false,
      erro:
        'Não foi possível conectar à API.',
    };
  }
}