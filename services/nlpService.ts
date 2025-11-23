export interface PortraitFeatures {
  genero?: string | null;
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
  [key: string]: unknown;
}

export interface NlpResponse {
  rawText?: string;
  features?: PortraitFeatures;
  error?: string;
}

export const analyzeText = async (text: string): Promise<NlpResponse> => {
  const lowerText = text.toLowerCase();
  const features: PortraitFeatures = {
    genero: null,
    rostro: {},
    ojos: {},
    cejas: {},
    nariz: {},
    boca: {},
    otrasCaracteristicas: null
  };

  // Helper to check keywords
  const has = (keywords: string[]) => keywords.some(k => lowerText.includes(k));

  // Género
  if (has(["hombre", "masculino", "chico", "señor", "caballero"])) features.genero = "Hombre";
  else if (has(["mujer", "femenino", "chica", "señora", "dama"])) features.genero = "Mujer";
  else if (has(["niño"])) features.genero = "Niño";
  else if (has(["niña"])) features.genero = "Niña";

  // Rostro
  if (has(["redondo", "redonda", "cara redonda"])) features.rostro!.forma = "redondo";
  else if (has(["ovalado", "ovalada", "cara ovalada"])) features.rostro!.forma = "ovalado";
  else if (has(["cuadrado", "cuadrada", "cara cuadrada"])) features.rostro!.forma = "cuadrado";
  else if (has(["alargado", "alargada", "cara alargada"])) features.rostro!.forma = "alargado";
  else if (has(["triangular", "cara triangular"])) features.rostro!.forma = "triangular";
  else if (has(["diamante", "cara diamante"])) features.rostro!.forma = "diamante";

  if (has(["piel clara", "tez clara", "blanco", "blanca", "güero", "güera"])) features.rostro!.tonoPiel = "claro";
  else if (has(["piel oscura", "tez oscura", "negro", "negra", "afro"])) features.rostro!.tonoPiel = "oscuro";
  else if (has(["moreno", "morena", "piel morena", "tez morena"])) features.rostro!.tonoPiel = "moreno";
  else if (has(["bronceado", "bronceada"])) features.rostro!.tonoPiel = "bronceado";
  else if (has(["pálido", "pálida"])) features.rostro!.tonoPiel = "pálido";

  // Ojos
  if (has(["ojos azules", "ojo azul"])) features.ojos!.color = "azul";
  else if (has(["ojos verdes", "ojo verde"])) features.ojos!.color = "verde";
  else if (has(["ojos cafés", "ojo café", "ojos marrones", "ojo marrón", "ojos color miel"])) features.ojos!.color = "café";
  else if (has(["ojos negros", "ojo negro"])) features.ojos!.color = "negro";
  else if (has(["ojos grises", "ojo gris"])) features.ojos!.color = "gris";
  else if (has(["ojos miel", "color miel"])) features.ojos!.color = "miel";

  if (has(["ojos grandes", "ojotes"])) features.ojos!.tamaño = "grande";
  else if (has(["ojos pequeños", "ojos chicos", "ojitos"])) features.ojos!.tamaño = "pequeño";
  
  if (has(["ojos rasgados", "asiático"])) features.ojos!.forma = "rasgados";
  else if (has(["ojos almendrados"])) features.ojos!.forma = "almendrados";
  else if (has(["ojos redondos"])) features.ojos!.forma = "redondos";
  else if (has(["ojos caídos"])) features.ojos!.forma = "caídos";

  // Cejas
  if (has(["cejas pobladas", "cejas gruesas", "cejón", "cejona"])) features.cejas!.tipo = "pobladas";
  else if (has(["cejas delgadas", "cejas finas"])) features.cejas!.tipo = "delgadas";
  else if (has(["cejas arqueadas"])) features.cejas!.tipo = "arqueadas";
  else if (has(["cejas rectas"])) features.cejas!.tipo = "rectas";
  else if (has(["uniceja"])) features.cejas!.tipo = "uniceja";

  // Nariz
  if (has(["nariz grande", "narizona", "narizón"])) features.nariz!.tamaño = "grande";
  else if (has(["nariz pequeña", "nariz chica", "naricita"])) features.nariz!.tamaño = "pequeña";
  else if (has(["nariz mediana"])) features.nariz!.tamaño = "mediana";
  
  if (has(["nariz aguileña", "nariz ganchuda"])) features.nariz!.forma = "aguileña";
  else if (has(["nariz respingada", "nariz respingona"])) features.nariz!.forma = "respingada";
  else if (has(["nariz chata", "nariz ancha"])) features.nariz!.forma = "chata";
  else if (has(["nariz recta"])) features.nariz!.forma = "recta";

  // Boca
  if (has(["boca grande"])) features.boca!.tamaño = "grande";
  else if (has(["boca pequeña", "boca chica"])) features.boca!.tamaño = "pequeña";
  
  if (has(["labios gruesos", "labios carnosos"])) features.boca!.labios = "gruesos";
  else if (has(["labios delgados", "labios finos"])) features.boca!.labios = "delgados";

  // Otras características
  const extras = [];
  if (has(["barba"])) extras.push("barba");
  if (has(["bigote"])) extras.push("bigote");
  if (has(["lentes", "gafas", "anteojos"])) extras.push("usa lentes");
  if (has(["cicatriz"])) extras.push("cicatriz");
  if (has(["tatuaje"])) extras.push("tatuaje");
  if (has(["pecas"])) extras.push("pecas");
  if (has(["lunar"])) extras.push("lunar");
  if (has(["arrugas"])) extras.push("arrugas");
  if (has(["barbilla redonda"])) extras.push("barbilla redonda");
  if (has(["barbilla partida"])) extras.push("barbilla partida");
  
  // Cabello
  if (has(["cabello largo", "pelo largo"])) extras.push("cabello largo");
  if (has(["cabello corto", "pelo corto"])) extras.push("cabello corto");
  if (has(["calvo", "pelón"])) extras.push("calvo");
  if (has(["cabello rizado", "pelo chino", "rulos"])) extras.push("cabello rizado");
  if (has(["cabello lacio", "pelo lacio"])) extras.push("cabello lacio");
  if (has(["cabello ondulado", "pelo ondulado"])) extras.push("cabello ondulado");
  
  if (has(["cabello rubio", "pelo rubio", "güero"])) extras.push("cabello rubio");
  if (has(["cabello negro", "pelo negro"])) extras.push("cabello negro");
  if (has(["cabello castaño", "pelo castaño", "cabello café"])) extras.push("cabello castaño");
  if (has(["cabello rojo", "pelirrojo"])) extras.push("cabello rojo");
  if (has(["canas", "pelo canoso", "cabello canoso"])) extras.push("cabello canoso");

  if (extras.length > 0) {
    features.otrasCaracteristicas = extras.join(", ");
  }

  return {
    rawText: text,
    features
  };
};
