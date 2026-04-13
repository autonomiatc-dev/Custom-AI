/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useConversations } from './hooks/useConversations';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { NewChatSettings } from './components/NewChatSettings';
import { Menu } from 'lucide-react';
import { Button } from './components/ui/button';
import { Sheet, SheetContent } from './components/ui/sheet';

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

