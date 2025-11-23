import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "imagegeneration@006",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const base64Image =
      result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Image) {
      return NextResponse.json(
        { error: "The model returned no image." },
        { status: 500 }
      );
    }

    // Data URL para usar directo en <img src="...">
    const imageDataUrl = `data:image/png;base64,${base64Image}`;

    // MUY IMPORTANTE: usamos "result" porque el front lee data.result
    return NextResponse.json({ result: imageDataUrl });
  } catch (err: any) {
    console.error("Error calling Gemini image API:", err);
    return NextResponse.json(
      { error: err.message || "Error generating image with Gemini" },
      { status: 500 }
    );
  }
}
