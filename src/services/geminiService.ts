import { GoogleGenAI } from "@google/genai";
import { Conversation, Message } from "../types";

export async function generateChatResponse(
  conversation: Conversation,
  newMessageText: string,
  apiKey: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  
  const chatHistory = conversation.messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const chat = ai.chats.create({
    model: conversation.model,
    history: chatHistory,
    config: {
      systemInstruction: conversation.systemPrompt || undefined,
      temperature: conversation.temperature,
      topK: conversation.topK,
      topP: conversation.topP,
    }
  });

  const response = await chat.sendMessage({ message: newMessageText });
  return response.text || "";
}

export async function generateTitle(systemPrompt: string, firstMessage: string, apiKey: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: `Generate a short, concise title (max 5 words) for a conversation that starts with this message: "${firstMessage}". The system prompt is: "${systemPrompt}". Return only the title, no quotes.`,
    });
    return response.text?.trim() || "Nova Conversa";
  } catch (error) {
    console.error("Error generating title:", error);
    return "Nova Conversa";
  }
}
