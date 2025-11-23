import { PortraitFeatures } from "../services/nlpService";

/**
 * Genera un prompt detallado para Gemini basado en las características extraídas.
 */
export const generateGeminiPrompt = (features: PortraitFeatures): string => {
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

Género: ${getFeature(features.genero)}

Rostro:
- Forma del rostro: ${getFeature(features.rostro?.forma)}
- Tono de piel: ${getFeature(features.rostro?.tonoPiel)}
- Textura de la piel: ${getFeature(features.rostro?.texturaPiel)}

Ojos:
- Espacio entre los ojos: ${getFeature(features.ojos?.espacio)}
- Tamaño: ${getFeature(features.ojos?.tamaño)}
- Forma: ${getFeature(features.ojos?.forma)}
- Color: ${getFeature(features.ojos?.color)}

Cejas:
- Densidad: ${getFeature(features.cejas?.densidad)}
- Tipo: ${getFeature(features.cejas?.tipo)}

Nariz:
- Tamaño: ${getFeature(features.nariz?.tamaño)}
- Forma: ${getFeature(features.nariz?.forma)}

Boca:
- Tamaño: ${getFeature(features.boca?.tamaño)}
- Labios: ${getFeature(features.boca?.labios)}

Cabello: 
- Color: ${getFeature(features.cabello?.color)}
- Largo: ${getFeature(features.cabello?.largo)}
- Densidad: ${getFeature(features.cabello?.densidad)}
- Estilo o peinado: ${getFeature(features.cabello?.estilo)}

Cuerpo: 
- Complexión: ${getFeature(features.cuerpo?.complexion)}
- Postura: ${getFeature(features.cuerpo?.postura)}
- Tono de piel: ${getFeature(features.cuerpo?.tono)}
- Peso: ${getFeature(features.cuerpo?.peso)}

Vestimenta: 
- Tipo de ropa: ${getFeature(features.ropa)}

${
  extras
    ? `Características especiales o detalles adicionales:\n- ${extras}\n`
    : ""
}

Fondo e iluminación:
- Fondo blanco o neutro.
- Iluminación suave tipo estudio, sin sombras duras.

Estilo:
- Retrato realista.
- Proporciones humanas correctas.
- Enfocado en el rostro y parte superior del torso.
- Retrato tipo sketch

`.trim();
};