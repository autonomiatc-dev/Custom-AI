import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'nexus_ai_conversations';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
      } catch (e) {
        console.error("Failed to parse conversations", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeId) || null;

  const createConversation = useCallback((
    systemPrompt: string,
    model: string,
    temperature: number,
    topK: number,
    topP: number
  ) => {
    const newConv: Conversation = {
      id: uuidv4(),
      title: 'Nova Conversa',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      systemPrompt,
      model,
      temperature,
      topK,
      topP,
      messages: []
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newConv.id);
    return newConv;
  }, []);

  const updateConversation = useCallback((id: string, updates: Partial<Conversation>) => {
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
    ));
  }, []);

  const addMessage = useCallback((conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      createdAt: Date.now()
    };
    
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          updatedAt: Date.now()
        };
      }
      return c;
    }));
    
    return newMessage;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
    }
  }, [activeId]);

  return {
    conversations,
    activeId,
    setActiveId,
    activeConversation,
    createConversation,
    updateConversation,
    addMessage,
    deleteConversation
  };
}
