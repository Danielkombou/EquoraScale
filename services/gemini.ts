
import { GoogleGenAI, Type } from "@google/genai";

// Initialize with a named parameter object for the API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Analyzes a document fragment for classification and summary using gemini-3-flash-preview.
 */
export const analyzeDocument = async (fileName: string, content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Classify document. 
      File: ${fileName}
      Text Fragment: ${content.substring(0, 2000)}`,
      config: {
        systemInstruction: "You are a specialized industrial document analyzer. Respond ONLY with valid JSON containing: documentType (RFQ, PO, QUOTATION, INVOICE, or GENERAL), summary, and 3 relevant industrial tags.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentType: { type: Type.STRING, enum: ['RFQ', 'PO', 'QUOTATION', 'INVOICE', 'GENERAL'] },
            summary: { type: Type.STRING },
            suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['documentType', 'summary', 'suggestedTags']
        }
      }
    });
    
    // Use .text property instead of .text() method
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};

/**
 * Handles document-specific Q&A interactions with high accuracy.
 */
export const askDocumentQuestion = async (fileName: string, content: string, question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `File: ${fileName}\nContent: ${content}\n\nQuestion: ${question}`,
      config: {
        systemInstruction: "You are an expert supply chain analyst. Answer concisely and accurately based on the provided text.",
        temperature: 0.1
      }
    });
    // Use .text property
    return response.text || "I am unable to provide an answer at this time.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error processing request.";
  }
};
