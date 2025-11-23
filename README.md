# Generador de Rostros por Descripción Hablada  
**Next.js + Speech-to-Text + Wolfram NLP + Gemini + Procesamiento Digital de Imágenes**

Este proyecto es un **generador de rostros** que recibe **descripciones habladas de personas**, las procesa mediante técnicas de **transformación de voz a texto**, **análisis en lenguaje natural**, y finalmente produce un **retrato dibujado** construido a partir de inteligencia artificial y procesamiento digital.

Su flujo completo va desde la voz del usuario → texto → extracción de rasgos → generación del rostro → estilización artística.

---

## Características principales

- **Entrada por voz** usando APIs de reconocimiento de voz.
- **Conversión voz → texto** integrada en el front-end.
- **Análisis del texto** y extracción de rasgos físicos con Wolfram Language (NLP).
- **Generación de JSON estructurado** con las características detectadas.
- **Generación del rostro** usando **Gemini 3.0**.
- **Post-procesamiento digital** para transformar retratos realistas en retratos tipo dibujo.
- **Interfaz moderna** construida con Next.js.
- Flujo optimizado: voz → texto → JSON → retrato → estilo artístico.

---

## Tecnologías utilizadas

### **Frontend**
- Next.js
- React
- Speech-to-Text API
- TailwindCSS

### **Backend / Procesamiento**
- Wolfram:
  - TextCases
  - Entity extraction
  - NLP para rasgos físicos
  - Exportación de JSON
- Gemini 3.0 (es necesaria una clave de API de Gemini)
- Procesamiento digital:
  - Conversión a estilo dibujo

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Antxnszn/hackathon-UPIITA.git
cd hackathon-UPIITA 
```
### 2. Instalar dependencias (node/Next.js)
```
npm i
```
### 3. Ejecutar el entorno
```
npm run dev
```
## Nota:
Es importante tener en cuenta que se debe tener una API_KEY previamente adquirida. Puedes obtenerla desde: https://aistudio.google.com/, en el apartado de generación de imagen. 
Te pedirá una cuenta bancaria, pero se te otorgarán créditos completamente gratuitos de prueba.
