
import { GoogleGenAI, Type } from "@google/genai";
import { AdaptationResult } from "../types";

export const adaptResume = async (cvBase64: string, jobUrl: string): Promise<AdaptationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are a resume engineering expert. 
    Your goal is to tailor a CV (PDF) to a specific job (URL).

    STRICT OPERATIONAL RULES:
    1. ZERO REPETITION. Never repeat the same company name, job role, or specific phrase in the bullets.
    2. MAXIMUM BREVITY. The entire JSON response MUST be under 2000 tokens. 
    3. NO INFINITE LOOPS. Stop as soon as you have provided enough data for a professional 1-page resume.
    4. Provide strictly valid JSON.

    JSON SCHEMA:
    {
      "latexCode": "A clean LaTeX source string following standard resume formatting",
      "previewData": {
        "personalInfo": { "name", "email", "phone", "linkedin", "portfolio", "location" },
        "summary": "Impact-driven summary tailored to the job",
        "experience": [ { "company", "role", "duration", "location", "bullets": ["Action-oriented unique bullets"] } ],
        "education": [ { "institution", "degree", "duration", "location" } ],
        "skills": [ { "category", "items": ["Relevant skill items"] } ]
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          parts: [
            { text: `TARGET JOB LINK: ${jobUrl}\n\nAttached is the Master CV. Adapt it for this job. Keep it professional and brief. DO NOT REPEAT TEXT. Return unique bullet points only.` },
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: cvBase64
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.1, 
        maxOutputTokens: 2500, // Reduced to prevent repetition and truncation
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    const text = response.text;
    if (!text) throw new Error("AI returned empty result.");

    try {
      // Basic sanity check to prevent trying to parse madness
      if (text.length < 50) throw new Error("Response too short.");
      
      const parsed = JSON.parse(text);
      
      // Secondary validation
      if (!parsed.previewData || !parsed.previewData.personalInfo) {
        throw new Error("Missing critical resume fields.");
      }
      
      return parsed as AdaptationResult;
    } catch (parseError) {
      console.error("JSON Error:", parseError, "Response head:", text.substring(0, 100));
      throw new Error("The AI failed to format the resume correctly. Please try again with a different job link.");
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
