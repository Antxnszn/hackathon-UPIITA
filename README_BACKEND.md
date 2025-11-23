# Guía de Integración del Backend

Esta landing page está diseñada para funcionar con un backend que maneje la lógica de Wolfram Language y Gemini API. Aquí te explico dónde y cómo conectar tu backend.

## 1. Procesamiento de Texto (Wolfram NLP)

En el archivo `app/page.tsx`, busca la función `processTextToFeatures`.

Actualmente simula la extracción:
```typescript
const processTextToFeatures = async () => {
  // TODO: Reemplazar con llamada real a tu API
  /*
  const response = await fetch('/api/analyze-text', {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  setFeatures(data.features);
  */
  
  // Código actual simulado...
};
```

Tu endpoint `/api/analyze-text` debería recibir el texto y devolver un objeto JSON con las claves: `nose`, `eyebrows`, `eyes`, `lips`, `additional`.

## 2. Generación de Imágenes (Gemini + Wolfram PDI)

En el archivo `app/page.tsx`, busca la función `generatePortraits`.

Actualmente usa `setTimeout` para simular espera:
```typescript
const generatePortraits = async () => {
  setStep('generating');
  
  // TODO: Reemplazar con llamada real a tu API
  /*
  const response = await fetch('/api/generate-portraits', {
    method: 'POST',
    body: JSON.stringify({ features }), // Enviar las características verificadas
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  setGeneratedImages(data.imageUrls); // Array de URLs de las imágenes generadas
  */

  // Código actual simulado...
};
```

Tu endpoint `/api/generate-portraits` debería:
1. Recibir las características.
2. Construir el prompt para Gemini.
3. Obtener las imágenes de Gemini.
4. Procesarlas con Wolfram para el efecto sketch.
5. Devolver las URLs de las imágenes resultantes.

## Notas Adicionales

- **Voice to Text**: Se utiliza la Web Speech API nativa del navegador. Funciona mejor en Chrome/Edge.
- **Estilos**: Se utiliza Tailwind CSS. Puedes personalizar los colores en `app/globals.css` o directamente en las clases de los componentes.
