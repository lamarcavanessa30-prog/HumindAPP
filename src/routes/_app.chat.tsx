import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Send, Paperclip, BookMarked } from "lucide-react";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
});

type Msg = { id: number; from: "me" | "ai"; text: string; refs?: string[] };

const initial: Msg[] = [
  { id: 1, from: "ai", text: "Bentornata, Elena. La tua ultima riflessione parlava di lentezza come forma di attenzione. Vuoi riprenderla, o iniziare da un pensiero nuovo?" },
  { id: 2, from: "me", text: "Riprendiamola. Mi accorgo che la fretta mi fa perdere le sfumature." },
  { id: 3, from: "ai", text: "C'è un filo, nei tuoi appunti di aprile, che collega questo a un'idea di Calvino sulla leggerezza. Vuoi che ti mostri la connessione?", refs: ["Letture lente", "Aprile · 14"] },
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), from: "me", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: "ai", text: "Lascio sedimentare questa idea con te. Cosa cambierebbe, se invece di trattenerla la lasciassi crescere?" }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 md:px-12 py-6 border-b border-border/60 glass sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Conversazione</div>
            <h1 className="font-display text-2xl mt-1">Lentezza come attenzione</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-primary animate-pulse-soft" /> in ascolto
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((m) => (
            <div key={m.id} className={m.from === "me" ? "flex justify-end" : "flex gap-4"}>
              {m.from === "ai" && (
                <div className="size-9 shrink-0 rounded-full bg-primary/10 grid place-items-center mt-1">
                  <Sparkles className="size-4 text-primary" />
                </div>
              )}
              {m.from === "me" ? (
                <div className="max-w-[78%] rounded-2xl rounded-tr-sm px-5 py-3 bg-primary text-primary-foreground shadow-soft">
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ) : (
                <div className="max-w-[78%]">
                  <p className="font-display text-lg leading-relaxed text-foreground">{m.text}</p>
                  {m.refs && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.refs.map((r) => (
                        <span key={r} className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/60">
                          <BookMarked className="size-3" /> {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="px-6 md:px-12 pb-8 pt-4">
        <div className="max-w-3xl mx-auto glass rounded-2xl shadow-soft p-3 flex items-end gap-2">
          <button className="size-10 grid place-items-center rounded-xl hover:bg-muted transition text-muted-foreground">
            <Paperclip className="size-4" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1}
            placeholder="Scrivi al tuo sé pensante…"
            className="flex-1 resize-none bg-transparent outline-none py-2.5 px-2 leading-relaxed max-h-40"
          />
          <button onClick={send} className="size-10 grid place-items-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition shadow-soft">
            <Send className="size-4" />
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-3 text-[11px] text-muted-foreground text-center">
          Synapse risponde con calma. Premi Invio per inviare, Shift+Invio per andare a capo.
        </div>
      </div>
    </div>
  );
}
