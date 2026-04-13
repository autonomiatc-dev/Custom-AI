export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  systemPrompt: string;
  model: string;
  temperature: number;
  topK: number;
  topP: number;
  messages: Message[];
}
