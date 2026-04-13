import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { HelpCircle, Send } from 'lucide-react';

interface NewChatSettingsProps {
  onCreate: (
    systemPrompt: string,
    model: string,
    temperature: number,
    topK: number,
    topP: number,
    firstMessage: string
  ) => void;
}

const MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Rápido e versátil)' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (Raciocínio complexo)' },
];

export function NewChatSettings({ onCreate }: NewChatSettingsProps) {
  const [systemPrompt, setSystemPrompt] = useState('Você é um assistente prestativo e amigável.');
  const [model, setModel] = useState(MODELS[0].id);
  const [temperature, setTemperature] = useState([0.7]);
  const [topK, setTopK] = useState([40]);
  const [topP, setTopP] = useState([0.95]);
  const [firstMessage, setFirstMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(systemPrompt, model, temperature[0], topK[0], topP[0], firstMessage);
  };

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col max-w-3xl mx-auto p-4 md:p-8">
        <div className="flex-1 overflow-y-auto pr-2 pb-24">
          <h2 className="text-2xl font-bold mb-6">Configurar Nova Conversa</h2>
          
          <div className="space-y-8">
            {/* System Prompt */}
            <div className="space-y-2">
              <div className="flex items-center gap-0">
                <Label htmlFor="systemPrompt" className="text-base font-semibold">Prompt do Sistema</Label>
                <Tooltip>
                  <TooltipTrigger render={<button type="button" className="inline-flex items-center justify-center h-11 w-11 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />}>
                    <HelpCircle className="h-5 w-5 text-zinc-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Define a personalidade, regras e o contexto geral de como a IA deve se comportar durante toda a conversa.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="min-h-[100px] resize-y"
                placeholder="Ex: Você é um especialista em React que explica conceitos complexos de forma simples."
              />
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-0">
                <Label htmlFor="model" className="text-base font-semibold">Modelo</Label>
                <Tooltip>
                  <TooltipTrigger render={<button type="button" className="inline-flex items-center justify-center h-11 w-11 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />}>
                    <HelpCircle className="h-5 w-5 text-zinc-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>O modelo de inteligência artificial a ser usado. Flash é mais rápido, Pro é melhor para tarefas complexas.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Temperature */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0">
                  <Label className="text-base font-semibold">Temperatura: {temperature[0]}</Label>
                  <Tooltip>
                    <TooltipTrigger render={<button type="button" className="inline-flex items-center justify-center h-11 w-11 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />}>
                      <HelpCircle className="h-5 w-5 text-zinc-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Controla a aleatoriedade. Valores menores (ex: 0.2) tornam as respostas mais focadas e determinísticas. Valores maiores (ex: 0.8) tornam as respostas mais criativas.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Slider
                value={temperature}
                onValueChange={(val) => setTemperature(val as number[])}
                max={2}
                step={0.1}
                className="py-2"
              />
            </div>

            {/* Top K */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0">
                  <Label className="text-base font-semibold">Top K: {topK[0]}</Label>
                  <Tooltip>
                    <TooltipTrigger render={<button type="button" className="inline-flex items-center justify-center h-11 w-11 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />}>
                      <HelpCircle className="h-5 w-5 text-zinc-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Limita o vocabulário da IA às K palavras mais prováveis em cada passo. Valores menores reduzem a aleatoriedade.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Slider
                value={topK}
                onValueChange={(val) => setTopK(val as number[])}
                max={100}
                min={1}
                step={1}
                className="py-2"
              />
            </div>

            {/* Top P */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0">
                  <Label className="text-base font-semibold">Top P: {topP[0]}</Label>
                  <Tooltip>
                    <TooltipTrigger render={<button type="button" className="inline-flex items-center justify-center h-11 w-11 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />}>
                      <HelpCircle className="h-5 w-5 text-zinc-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Altera a probabilidade cumulativa das palavras escolhidas. 0.9 significa que apenas as palavras que compõem os 90% mais prováveis serão consideradas.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Slider
                value={topP}
                onValueChange={(val) => setTopP(val as number[])}
                max={1}
                step={0.05}
                className="py-2"
              />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent dark:from-zinc-950 dark:via-zinc-950">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <Input
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                placeholder="Envie uma mensagem para iniciar a conversa..."
                className="pr-12 py-6 rounded-2xl shadow-sm border-zinc-300 dark:border-zinc-700 focus-visible:ring-zinc-400"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!firstMessage.trim()}
                className="absolute right-2 rounded-xl h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
