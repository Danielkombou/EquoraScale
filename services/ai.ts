
/// <reference types="vite/client" />

/**
 * AI Service for Eqorascale
 * Reverted to OpenRouter API implementation via standard fetch.
 */

export const analyzeDocument = async (fileName: string, content: string) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Eqorascale Enterprise MVP"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: "You are a specialized industrial document analyzer. Extract document type (RFQ, PO, QUOTATION, INVOICE, or GENERAL), a one-sentence summary, and 3 relevant industrial tags. Respond ONLY with valid JSON."
          },
          {
            role: "user",
            content: `Task: Analyze this document for supply chain indexing.\nFile Name: ${fileName}\nText content: ${content.substring(0, 4000)}`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      documentType: result.documentType || "GENERAL",
      summary: result.summary || "Summary generation failed.",
      suggestedTags: result.suggestedTags || ["Document"]
    };
  } catch (error) {
    console.error("OpenRouter Analysis Error:", error);
    return {
      documentType: "GENERAL",
      summary: "The AI Intelligence engine is currently unresponsive via OpenRouter.",
      suggestedTags: ["System-Error"]
    };
  }
};

export const askDocumentQuestion = async (fileName: string, content: string, question: string) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Eqorascale Enterprise MVP"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: "You are an expert supply chain analyst for Eqorascale. Provide accurate, professional, and well-structured answers based on the provided document context. Use markdown (bolding and lists) for clarity. Ensure your tone is helpful and enterprise-focused."
          },
          {
            role: "user",
            content: `Document: ${fileName}\nContext: ${content.substring(0, 15000)}\n\nUser Question: ${question}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content || "No intelligence data received for this query.";
  } catch (error) {
    console.error("OpenRouter Chat Error:", error);
    return "Connectivity Issue: Unable to reach OpenRouter AI reasoning engine. Please check your API key and network status.";
  }
};
