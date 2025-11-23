import { WolframFeatures } from "../services/wolframService";

/**
 * Genera un prompt detallado para Gemini basado en las características extraídas.
 */
export const generateGeminiPrompt = (features: WolframFeatures): string => {
  const getFeature = (
    value: string | null | undefined,
    fallback: string = "No especificado"
  ) => {
    return value && value !== "null" ? value : fallback;
  };

  const extras =
    features.otrasCaracteristicas && features.otrasCaracteristicas.trim().length
      ? features.otrasCaracteristicas.trim()
      : null;

  return `
Genera un retrato realista basado en la siguiente descripción física.

Rostro:
- Forma del rostro: ${getFeature(features.rostro?.forma)}
- Tono de piel: ${getFeature(features.rostro?.tonoPiel)}
- Textura de la piel: ${getFeature(features.rostro?.texturaPiel)}

Ojos:
- Tamaño: ${getFeature(features.ojos?.tamaño)}
- Forma: ${getFeature(features.ojos?.forma)}
- Color: ${getFeature(features.ojos?.color)}

Cejas:
- Tipo: ${getFeature(features.cejas?.tipo)}

Nariz:
- Tamaño: ${getFeature(features.nariz?.tamaño)}
- Forma: ${getFeature(features.nariz?.forma)}

Boca:
- Tamaño: ${getFeature(features.boca?.tamaño)}
- Labios: ${getFeature(features.boca?.labios)}

${
  extras
    ? `Características especiales o detalles adicionales:\n- ${extras}\n`
    : ""
}

Fondo e iluminación:
- Fondo blanco o neutro.
- Iluminación suave tipo estudio, sin sombras duras.

Estilo:
- Retrato realista, estilo retrato forense.
- Proporciones humanas correctas.
- Enfocado en el rostro y parte superior del torso.
`.trim();
};
