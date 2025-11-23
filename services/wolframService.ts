/**
 * Servicio para manejar la comunicación con Wolfram Cloud.
 */

// -----------------------------------------------------------------------------
// CONFIGURACIÓN
// -----------------------------------------------------------------------------

const WOLFRAM_CLOUD_URL =
  process.env.NEXT_PUBLIC_WOLFRAM_CLOUD_URL ??
  "https://www.wolframcloud.com/obj/achavezt1900/forensicSketchAPI";

// -----------------------------------------------------------------------------
// TIPOS
// -----------------------------------------------------------------------------

export interface WolframFeatures {
  rostro?: {
    forma?: string | null;
    tonoPiel?: string | null;
    texturaPiel?: string | null;
  };
  ojos?: {
    tamaño?: string | null;
    forma?: string | null;
    color?: string | null;
  };
  cejas?: {
    tipo?: string | null;
  };
  nariz?: {
    tamaño?: string | null;
    forma?: string | null;
  };
  boca?: {
    tamaño?: string | null;
    labios?: string | null;
  };
  otrasCaracteristicas?: string | null;
  [key: string]: any;
}

export interface WolframResponse {
  rawText?: string;
  tokens?: string[];
  processedText?: string;
  features?: WolframFeatures;
  error?: string;
  [key: string]: any;
}

// -----------------------------------------------------------------------------
// FUNCIÓN PRINCIPAL
// -----------------------------------------------------------------------------

export const analyzeTextWithWolfram = async (
  text: string
): Promise<WolframResponse> => {
  if (!text || text.trim() === "") {
    console.warn("Intento de enviar texto vacío a Wolfram.");
    return {};
  }

  try {
    const body = new URLSearchParams({ text });

    const response = await fetch(WOLFRAM_CLOUD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body,
    });

    const result = await response.json();

    console.log("Respuesta de Wolfram:", result); // 👈 para verificar qué llega

    if (!response.ok) {
      throw new Error(result?.error ?? "Error desconocido en Wolfram Cloud");
    }

    return result;
  } catch (error) {
    console.error("Error en la conexión con Wolfram Cloud:", error);
    return {
      error: String(error),
    };
  }
};
