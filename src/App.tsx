/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useConversations } from './hooks/useConversations';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { NewChatSettings } from './components/NewChatSettings';
import { Menu, Key } from 'lucide-react';
import { Button } from './components/ui/button';
import { Sheet, SheetContent } from './components/ui/sheet';
import { Input } from './components/ui/input';

export default function App() {
  const {
    conversations,
    activeId,
    setActiveId,
    activeConversation,
    createConversation,
    updateConversation,
    addMessage,
    deleteConversation
  } = useConversations();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // API Key State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('custom_ai_api_key') || '');
  const [isEditingKey, setIsEditingKey] = useState(!localStorage.getItem('custom_ai_api_key'));
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempKey.trim()) {
      localStorage.setItem('custom_ai_api_key', tempKey.trim());
      setApiKey(tempKey.trim());
      setIsEditingKey(false);
    }
  };

  if (isEditingKey || !apiKey) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-4">
        <div className="max-w-md w-full p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-6">
            <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Configurar API Key</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm leading-relaxed">
            Para usar o Custom AI, insira sua chave de API do Google Gemini. Ela ficará salva <strong>apenas localmente no seu navegador</strong>.
          </p>
          <form onSubmit={handleSaveKey} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Cole sua API Key aqui..."
                className="py-6"
              />
            </div>
            <Button type="submit" className="w-full py-6 text-base" disabled={!tempKey.trim()}>
              Salvar e Continuar
            </Button>
            {apiKey && (
              <Button type="button" variant="ghost" className="w-full" onClick={() => {
                setTempKey(apiKey);
                setIsEditingKey(false);
              }}>
                Cancelar
              </Button>
            )}
          </form>
          <div className="mt-6 text-center">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Não tem uma chave? Obtenha uma no Google AI Studio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
        <Sidebar 
          conversations={conversations} 
          activeId={activeId} 
          onSelect={(id) => setActiveId(id)} 
          onNewChat={() => setActiveId(null)}
          onDelete={deleteConversation}
          onChangeApiKey={() => {
            setTempKey(apiKey);
            setIsEditingKey(true);
          }}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 border-r-0">
          <Sidebar 
            conversations={conversations} 
            activeId={activeId} 
            onSelect={(id) => {
              setActiveId(id);
              setIsSidebarOpen(false);
            }} 
            onNewChat={() => {
              setActiveId(null);
              setIsSidebarOpen(false);
            }}
            onDelete={deleteConversation}
            onChangeApiKey={() => {
              setTempKey(apiKey);
              setIsEditingKey(true);
              setIsSidebarOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <header className="md:hidden flex items-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-lg">Custom AI</h1>
        </header>

        <main className="flex-1 overflow-hidden relative">
          {activeConversation ? (
            <ChatArea 
              conversation={activeConversation} 
              apiKey={apiKey}
              onSendMessage={addMessage}
              onUpdateConversation={updateConversation}
            />
          ) : (
            <NewChatSettings 
              onCreate={(prompt, model, temp, topK, topP, firstMessage) => {
                const conv = createConversation(prompt, model, temp, topK, topP);
                if (firstMessage) {
                  addMessage(conv.id, { role: 'user', text: firstMessage });
                }
              }} 
            />
          )}
        </main>
      </div>
    </div>
  );
}

