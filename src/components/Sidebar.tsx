import { Conversation } from '../types';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Plus, MessageSquare, Trash2, Key } from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onChangeApiKey: () => void;
}

export function Sidebar({ conversations, activeId, onSelect, onNewChat, onDelete, onChangeApiKey }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button onClick={onNewChat} className="w-full justify-start gap-2" variant="default">
          <Plus className="h-4 w-4" />
          Nova Conversa
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {conversations.length === 0 && (
            <p className="text-sm text-zinc-500 text-center py-4">Nenhuma conversa ainda.</p>
          )}
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer transition-colors ${
                activeId === conv.id
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
              }`}
              onClick={() => onSelect(conv.id)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{conv.title}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
              >
                <Trash2 className="h-3 w-3 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button variant="ghost" className="w-full justify-start gap-2 text-zinc-600 dark:text-zinc-400" onClick={onChangeApiKey}>
          <Key className="h-4 w-4" />
          Configurar API Key
        </Button>
      </div>
    </div>
  );
}
