"use client";

import React, { useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import {
  analyzeTextWithWolfram,
  WolframFeatures,
} from "../services/wolframService";
import { generateGeminiPrompt } from "../utils/promptUtils";
import { ImageSelector } from "../components/ImageSelector";

type Step = "input" | "verification" | "generating" | "selection";

export default function Home() {
  const {
    text,
    setText,
    isListening,
    startListening,
    stopListening,
    resetText,
    hasRecognitionSupport,
    error: speechError,
  } = useSpeechRecognition();

  const [step, setStep] = useState<Step>("input");
  const [features, setFeatures] = useState<WolframFeatures>({});
  const [extraDescription, setExtraDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [wolframError, setWolframError] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const updateFeature = (
    section: keyof WolframFeatures,
    field: string,
    value: string
  ) => {
    setFeatures((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  const basicFieldsMissing = () => {
    const rostroForma = features.rostro?.forma;
    const ojosColor = features.ojos?.color;
    const cejasTipo = features.cejas?.tipo;

    return !rostroForma || !ojosColor || !cejasTipo;
  };

  // ---------------------------------------------------------------------------
  // 1) Texto (speech-to-text) -> Wolfram
  // ---------------------------------------------------------------------------

  const processTextToFeatures = async () => {
    setWolframError(null);
    setGenerationError(null);

    try {
      const response = await analyzeTextWithWolfram(text);
      if (response.features) {
        setFeatures(response.features);
      } else {
        setFeatures({});
      }

      // Creamos un primer prompt base (luego se puede regenerar tras editar)
      const initialPrompt = generateGeminiPrompt(response.features ?? {});
      setPrompt(initialPrompt);

      setStep("verification");
    } catch (err: any) {
      console.error("Error procesando texto en Wolfram:", err);
      setWolframError(
        err.message || "Error al procesar el texto en Wolfram Cloud"
      );
    }
  };

  // ---------------------------------------------------------------------------
  // 2) Construir prompt final y llamar a Gemini
  // ---------------------------------------------------------------------------

  const generatePortraits = async (overridePrompt?: string) => {
    const finalPrompt = overridePrompt ?? prompt;
    if (!finalPrompt) return;

    setStep("generating");
    setGenerationError(null);

    try {
      const response = await fetch("/api/generate-portrait", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      console.log("Respuesta de Gemini:", data);

      // Aseguramos compatibilidad: si algún día decides devolver "image" en lugar de "result"
      const result: string | undefined = data.result || data.image;
      let imageUrl =
        "https://placehold.co/400x400/222/fff?text=No+Image+Generated";

      if (
        result &&
        (result.startsWith("http") || result.startsWith("data:image"))
      ) {
        imageUrl = result;
      } else {
        console.warn("Gemini devolvió texto en lugar de imagen:", result);
        imageUrl =
          "https://placehold.co/400x400/222/fff?text=Texto+recibido+(ver+consola)";
      }

      setGeneratedImages([imageUrl]);
      setStep("selection");
    } catch (err: any) {
      console.error("Error generando imagen con Gemini:", err);
      setGenerationError(
        err.message || "Error desconocido al generar la imagen"
      );
      setStep("verification");
    }
  };

  const handleConfirmAndGenerate = () => {
    // Metemos la descripción extra del usuario al JSON
    const mergedFeatures: WolframFeatures = {
      ...features,
      otrasCaracteristicas:
        extraDescription || features.otrasCaracteristicas || null,
    };

    const finalPrompt = generateGeminiPrompt(mergedFeatures);
    setPrompt(finalPrompt);
    generatePortraits(finalPrompt);
  };

  const handleDownload = () => {
    if (selectedImageIndex === null) return;
    const link = document.createElement("a");
    link.href = generatedImages[selectedImageIndex];
    link.download = `retrato-hablado-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-black text-gray-100 font-sans">
      <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white">
            ForensicSketch AI
          </h1>
          <span className="text-xs text-gray-500">
            Retratos hablados asistidos por IA
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Pasos visuales simples */}
        <div className="flex justify-between text-xs text-gray-400">
          {["Captura", "Verificación", "Generación", "Selección"].map(
            (label, idx) => {
              const steps: Step[] = [
                "input",
                "verification",
                "generating",
                "selection",
              ];
              const currentIdx = steps.indexOf(step);
              const isActive = idx <= currentIdx;
              return (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={
                      isActive ? "text-blue-400" : "text-gray-600"
                    }
                  >
                    {label}
                  </span>
                </div>
              );
            }
          )}
        </div>

        {/* STEP 1: INPUT */}
        {step === "input" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Descripción del sujeto</h2>
            <p className="text-sm text-gray-400">
              Usa el micrófono o escribe manualmente la descripción física del
              sujeto.
            </p>

            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ej: Hombre joven, rostro alargado, piel morena clara, ojos almendrados cafés, cejas pobladas..."
                className="w-full h-40 bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() =>
                    setText(
                      "Hombre de unos 20 años, cara diamante, ojos almendrados cafés, cejas pobladas, nariz mediana aguileña, labios gruesos, barbilla redonda, cabello café oscuro ondulado corto."
                    )
                  }
                  className="text-xs text-gray-500 hover:text-gray-300 underline"
                >
                  Cargar ejemplo
                </button>

                <div className="flex items-center gap-2">
                  {hasRecognitionSupport ? (
                    <button
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                      className={`px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2 ${
                        isListening
                          ? "bg-red-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {isListening ? "Detener micrófono" : "Hablar"}
                    </button>
                  ) : (
                    <span className="text-xs text-red-400">
                      Sin soporte de reconocimiento de voz
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={resetText}
                    className="px-3 py-2 rounded-md text-xs border border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              {speechError && (
                <p className="text-xs text-red-400 mt-1">{speechError}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={processTextToFeatures}
                className="px-5 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-500"
                disabled={!text.trim()}
              >
                Enviar a Wolfram
              </button>
            </div>

            {wolframError && (
              <p className="text-sm text-red-400">{wolframError}</p>
            )}
          </section>
        )}

        {/* STEP 2: VERIFICATION */}
        {step === "verification" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Verificación de datos</h2>
            <p className="text-sm text-gray-400">
              Revisa y completa las características antes de generar la imagen.
            </p>

            {/* Campos básicos editables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900/60 border border-gray-800 rounded-xl p-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Forma del rostro
                </label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-gray-800 rounded px-2 py-1 text-sm text-gray-200"
                  value={features.rostro?.forma ?? ""}
                  onChange={(e) =>
                    updateFeature("rostro", "forma", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tono de piel
                </label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-gray-800 rounded px-2 py-1 text-sm text-gray-200"
                  value={features.rostro?.tonoPiel ?? ""}
                  onChange={(e) =>
                    updateFeature("rostro", "tonoPiel", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Color de ojos
                </label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-gray-800 rounded px-2 py-1 text-sm text-gray-200"
                  value={features.ojos?.color ?? ""}
                  onChange={(e) =>
                    updateFeature("ojos", "color", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tipo de cejas
                </label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-gray-800 rounded px-2 py-1 text-sm text-gray-200"
                  value={features.cejas?.tipo ?? ""}
                  onChange={(e) =>
                    updateFeature("cejas", "tipo", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tamaño de la nariz
                </label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-gray-800 rounded px-2 py-1 text-sm text-gray-200"
                  value={features.nariz?.tamaño ?? ""}
                  onChange={(e) =>
                    updateFeature("nariz", "tamaño", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Labios
                </label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-gray-800 rounded px-2 py-1 text-sm text-gray-200"
                  value={features.boca?.labios ?? ""}
                  onChange={(e) =>
                    updateFeature("boca", "labios", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Características extras */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-2">
              <label className="block text-xs text-gray-500 mb-1">
                Características especiales (cicatrices, lunares, tatuajes,
                accesorios, etc.)
              </label>
              <textarea
                className="w-full h-24 bg-black/40 border border-gray-800 rounded px-2 py-1 text-sm text-gray-200"
                value={extraDescription}
                onChange={(e) => setExtraDescription(e.target.value)}
                placeholder="Ej: Tiene una cicatriz en la ceja derecha, usa lentes rectangulares negros..."
              />

              {/* Vista del JSON crudo para debug */}
              <details className="mt-2 text-xs text-gray-500">
                <summary className="cursor-pointer">
                  Ver JSON completo de características
                </summary>
                <pre className="mt-2 p-2 bg-black rounded text-[10px] text-green-400 overflow-auto max-h-52">
                  {JSON.stringify(features, null, 2)}
                </pre>
              </details>
            </div>

            {/* Prompt que se enviará a Gemini */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-200 mb-2">
                Prompt actual:
              </h3>
              <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-black/40 rounded p-2 max-h-40 overflow-auto">
                {prompt}
              </pre>
              {basicFieldsMissing() && (
                <p className="mt-2 text-xs text-yellow-400">
                  ⚠ Faltan algunos campos básicos (por ejemplo: forma de
                  rostro, color de ojos o tipo de cejas).
                </p>
              )}
            </div>

            {generationError && (
              <p className="text-sm text-red-400">{generationError}</p>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep("input")}
                className="px-4 py-2 rounded-md border border-gray-700 text-xs text-gray-300 hover:bg-gray-800"
              >
                Volver a captura
              </button>

              <button
                type="button"
                onClick={handleConfirmAndGenerate}
                className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-500"
              >
                Confirmar y generar imagen
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: GENERATING */}
        {step === "generating" && (
          <section className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 text-center max-w-sm">
              Generando el retrato a partir de la descripción. Esto puede tardar
              unos segundos...
            </p>
          </section>
        )}

        {/* STEP 4: SELECTION */}
        {step === "selection" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Resultados generados</h2>
            <p className="text-sm text-gray-400">
              Selecciona la imagen que mejor coincida con la descripción.
            </p>

            <ImageSelector
              images={generatedImages}
              selectedImageIndex={selectedImageIndex}
              onSelect={setSelectedImageIndex}
            />

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setStep("verification")}
                className="px-4 py-2 rounded-md border border-gray-700 text-xs text-gray-300 hover:bg-gray-800"
              >
                Volver a verificación
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={selectedImageIndex === null}
                  className="px-4 py-2 rounded-md bg-green-600 disabled:bg-green-900/60 text-white text-xs font-medium"
                >
                  Descargar imagen
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
