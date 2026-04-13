import { useState, useRef, useEffect } from 'react';
import { Conversation, Message } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, Settings2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateChatResponse, generateTitle } from '../services/geminiService';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ChatAreaProps {
  conversation: Conversation;
  onSendMessage: (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => void;
  onUpdateConversation: (id: string, updates: Partial<Conversation>) => void;
}

export function ChatArea({ conversation, onSendMessage, onUpdateConversation }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages, isLoading]);

  // Generate title if it's the first message and title is default
  useEffect(() => {
    if (conversation.messages.length === 2 && conversation.title === 'Nova Conversa') {
      const firstUserMsg = conversation.messages.find(m => m.role === 'user')?.text;
      if (firstUserMsg) {
        generateTitle(conversation.systemPrompt, firstUserMsg).then(title => {
          onUpdateConversation(conversation.id, { title });
        });
      }
    }
  }, [conversation.messages.length, conversation.id, conversation.title, conversation.systemPrompt, onUpdateConversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    onSendMessage(conversation.id, { role: 'user', text: userText });

    try {
      // We need to pass the updated conversation to the service, 
      // so we construct a temporary one with the new message included.
      const tempConv = {
        ...conversation,
        messages: [...conversation.messages, { role: 'user' as const, text: userText, id: 'temp', createdAt: Date.now() }]
      };
      
      const responseText = await generateChatResponse(tempConv, userText);
      onSendMessage(conversation.id, { role: 'model', text: responseText });
    } catch (error) {
      console.error("Error generating response:", error);
      onSendMessage(conversation.id, { role: 'model', text: "Desculpe, ocorreu um erro ao processar sua solicitação." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header with settings info */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-end z-10 pointer-events-none">
        <Popover>
          <PopoverTrigger render={<Button variant="outline" size="sm" className="pointer-events-auto bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm shadow-sm gap-2 rounded-full" />}>
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">Configurações Atuais</span>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-4 pointer-events-auto">
            <h4 className="font-semibold mb-2">Configurações desta Conversa</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Modelo:</span>
                <span className="font-medium truncate ml-2">{conversation.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Temperatura:</span>
                <span className="font-medium">{conversation.temperature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Top K:</span>
                <span className="font-medium">{conversation.topK}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Top P:</span>
                <span className="font-medium">{conversation.topP}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500 block mb-1">Prompt do Sistema:</span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-3" title={conversation.systemPrompt}>
                  {conversation.systemPrompt || "Nenhum"}
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <ScrollArea className="flex-1 px-4 pt-16 pb-24">
        <div className="max-w-3xl mx-auto space-y-6 flex flex-col">
          {conversation.messages.map((msg, index) => (
            <div 
              key={msg.id || index} 
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
              )}
              
              <div 
                className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-sm' 
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-tl-sm shadow-sm'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="markdown-body prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-800">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-4" />
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent dark:from-zinc-950 dark:via-zinc-950">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="pr-12 py-6 rounded-2xl shadow-sm border-zinc-300 dark:border-zinc-700 focus-visible:ring-zinc-400 bg-white dark:bg-zinc-950"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isLoading}
              className="absolute right-2 rounded-xl h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-xs text-zinc-500">A IA pode cometer erros. Considere verificar informações importantes.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
