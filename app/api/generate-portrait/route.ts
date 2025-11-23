// pages/api/generate-image.ts (Next.js / route handler)
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai"; // SDK oficial; instala: npm i @google/genai
import * as fs from "node:fs";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in env");
    }

    // Inicializa cliente según el SDK oficial
    const ai = new GoogleGenAI({ apiKey }); // según la versión del SDK podría ser new GoogleGenAI({}) y usar env var

    // Modelo de imagen correcto
    const modelName = "gemini-2.5-flash-image";

    // Generar 3 imágenes en paralelo
    const promises = Array(3)
      .fill(null)
      .map(() =>
        ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseModalities: ["Image"],
          },
        })
      );

    const results = await Promise.allSettled(promises);

    const images = results
      .map((pResult) => {
        if (pResult.status === "rejected") {
          console.error("Error in one generation:", pResult.reason);
          return null;
        }
        const result = pResult.value;
        const parts = result.candidates?.[0]?.content?.parts;
        const imageBase64 = parts?.find((p: any) => p.inlineData)?.inlineData
          ?.data;
        return imageBase64 ? `data:image/png;base64,${imageBase64}` : null;
      })
      .filter((img) => img !== null);

    if (images.length === 0) {
      console.error("No images generated. All requests failed or returned no data.");
      return NextResponse.json(
        { error: "No se pudieron generar imágenes. Intenta de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ results: images });
  } catch (err: any) {
    console.error("Error calling Gemini image API:", err);
    return NextResponse.json(
      { error: err?.message || "Error generating image with Gemini" },
      { status: 500 }
    );
  }
}
