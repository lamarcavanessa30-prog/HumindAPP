import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Send, Paperclip, BookMarked, AlertTriangle, X, Wind, Clock } from "lucide-react";
import { suggestPracticeForText } from "./_app.pause";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
});

type Msg = { id: number; from: "me" | "ai"; text: string; refs?: string[]; level?: DepthId };
type DepthId = "ascolto" | "riflessione" | "esplorazione" | "autoanalisi" | "specchio";

type Depth = {
  id: DepthId;
  label: string;
  dot: string;
  ring: string;
  tagline: string;
  description: string;
  guide: string;
  reply: string;
  refs?: string[];
  advanced?: boolean;
  warning?: string;
};

const DEPTHS: Depth[] = [
  {
    id: "ascolto",
    label: "Ascolto",
    dot: "bg-emerald-500",
    ring: "ring-emerald-500/40",
    tagline: "Ti ascolto.",
    description: "Spazio, validazione emotiva, supporto leggero. Nessuna interpretazione.",
    guide: "L'AI ascolta, valida e chiarisce. Non scava, non analizza pattern.",
    reply:
      "Resto qui con te. Quello che mi stai dicendo ha senso, e non c'è bisogno di andare oltre adesso. Vuoi raccontarmi ancora un po' come la stai vivendo?",
  },
  {
    id: "riflessione",
    label: "Riflessione",
    dot: "bg-sky-500",
    ring: "ring-sky-500/40",
    tagline: "Riflettiamo insieme.",
    description: "Osservazioni leggere, collegamenti semplici, domande aperte. Profondità moderata.",
    guide: "L'AI propone osservazioni leggere e domande aperte. Modalità predefinita.",
    reply:
      "Mm, resto un attimo qui con te su questa cosa. Posso chiederti — cosa cambierebbe, se invece di trattenerla la lasciassi semplicemente stare?",
  },
  {
    id: "esplorazione",
    label: "Esplorazione",
    dot: "bg-violet-500",
    ring: "ring-violet-500/40",
    tagline: "Cerchiamo significati.",
    description: "Più curiosità, ricerca di significati, collegamenti tra eventi, Domande Vive più frequenti.",
    guide: "L'AI esplora temi ricorrenti e propone collegamenti tra esperienze diverse.",
    reply:
      "C'è qualcosa che torna, qui. Mi ricorda una cosa che mi avevi raccontato a maggio, sul bisogno di rallentare prima che le cose ti chiedano qualcosa. Vivi questi due momenti come parte della stessa domanda?",
    refs: ["Letture lente", "Maggio · 02"],
  },
  {
    id: "autoanalisi",
    label: "Autoanalisi",
    dot: "bg-amber-500",
    ring: "ring-amber-500/40",
    tagline: "Guardiamo i pattern.",
    description: "Analisi di pattern longitudinali e collegamenti tra periodi diversi. Uso più intenso dei framework.",
    guide:
      "L'AI usa CBT, ACT, DBT, ADHD-informed e Relazioni per leggere pattern longitudinali. Mai diagnosi, mai etichette.",
    advanced: true,
    warning: "Questa modalità può portare a riflessioni profonde e a domande impegnative.",
    reply:
      "Provo a tenere insieme alcuni fili. In più periodi — gennaio, aprile, queste settimane — torna un movimento simile: ti carichi di compiti quando ti senti incerta sul valore di ciò che fai. Da un punto di vista ACT, sembrerebbe un tentativo di restare ancorata a qualcosa di tangibile. Risuona, oppure ti sembra che stia forzando il collegamento?",
    refs: ["Pattern · sovraccarico", "ACT · valori"],
  },
  {
    id: "specchio",
    label: "Specchio",
    dot: "bg-zinc-700",
    ring: "ring-zinc-500/40",
    tagline: "Ti restituisco ciò che osservo.",
    description: "Restituzione di pattern, contraddizioni e contrasti tra dichiarazioni e comportamenti. Nessuna interpretazione.",
    guide:
      "Lo Specchio osserva e restituisce. Non interpreta, non giudica, non conclude.",
    advanced: true,
    warning: "Questa modalità restituisce osservazioni dirette. Può risultare confrontante.",
    reply:
      "Nelle ultime settimane hai espresso il desiderio di maggiore vicinanza, ma hai raccontato anche diversi episodi in cui hai preso distanza quando qualcuno si è avvicinato. Te lo restituisco così, senza conclusioni.",
  },
];

const STORAGE_KEY = "humind.chat.depth";

function ChatPage() {
  const [depthId, setDepthId] = useState<DepthId>("riflessione");
  const [acknowledgedAdvanced, setAcknowledgedAdvanced] = useState<Record<string, boolean>>({});
  const [pendingDepth, setPendingDepth] = useState<Depth | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: "ai", text: "Ehi, bentornata. L'ultima volta mi stavi raccontando di quella sensazione di lentezza che ti faceva bene. Vuoi riprendere da lì, o c'è altro che ti gira in testa oggi?", level: "riflessione" },
    { id: 2, from: "me", text: "Riprendiamola. Mi accorgo che quando vado di fretta perdo i dettagli — e poi mi manca qualcosa." },
    { id: 3, from: "ai", text: "Eh, ti capisco. Mi sono ricordata una cosa che avevi scritto ad aprile, su Calvino e la leggerezza — credo si parlino tra loro. Te la mostro?", refs: ["Letture lente", "Aprile · 14"], level: "riflessione" },
  ]);
  const [input, setInput] = useState("");

  // Restore depth from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && DEPTHS.some((d) => d.id === saved)) {
      setDepthId(saved as DepthId);
    }
  }, []);

  // Persist depth
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, depthId);
  }, [depthId]);

  const depth = DEPTHS.find((d) => d.id === depthId) ?? DEPTHS[1];

  const requestDepth = (next: Depth) => {
    if (next.id === depth.id) return;
    if (next.advanced && !acknowledgedAdvanced[next.id]) {
      setPendingDepth(next);
      return;
    }
    applyDepth(next);
  };

  const applyDepth = (next: Depth) => {
    setDepthId(next.id);
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        from: "ai",
        text: `Cambio di profondità — ora siamo in modalità ${next.label}. ${next.tagline}`,
        level: next.id,
      },
    ]);
  };

  const confirmAdvanced = () => {
    if (!pendingDepth) return;
    setAcknowledgedAdvanced((a) => ({ ...a, [pendingDepth.id]: true }));
    applyDepth(pendingDepth);
    setPendingDepth(null);
  };

  const send = () => {
    if (!input.trim()) return;
    const text = input;
    setMessages((m) => [...m, { id: Date.now(), from: "me", text }]);
    setInput("");
    const current = DEPTHS.find((d) => d.id === depthId) ?? DEPTHS[1];
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, from: "ai", text: current.reply, refs: current.refs, level: current.id },
      ]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 md:px-12 py-5 border-b border-border/60 glass sticky top-0 z-10">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Conversazione</div>
              <h1 className="font-display text-2xl mt-1">Lentezza come attenzione</h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={`size-2 rounded-full ${depth.dot} animate-pulse-soft`} />
              <span>in modalità {depth.label.toLowerCase()}</span>
            </div>
          </div>

          {/* Depth selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Profondità della conversazione
              </div>
              <div className="text-[11px] text-muted-foreground hidden md:block">
                Puoi cambiarla in qualsiasi momento.
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEPTHS.map((d) => {
                const active = d.id === depth.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => requestDepth(d)}
                    title={d.description}
                    className={[
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition",
                      active
                        ? `bg-secondary border-border ring-2 ${d.ring}`
                        : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    ].join(" ")}
                  >
                    <span className={`size-2 rounded-full ${d.dot}`} />
                    <span className={active ? "text-foreground font-medium" : ""}>{d.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground italic">{depth.guide}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((m) => {
            const msgDepth = m.level ? DEPTHS.find((d) => d.id === m.level) : null;
            return (
              <div key={m.id} className={m.from === "me" ? "flex justify-end" : "flex gap-4"}>
                {m.from === "ai" && (
                  <div className="size-9 shrink-0 rounded-full bg-primary/10 grid place-items-center mt-1 relative">
                    <Sparkles className="size-4 text-primary" />
                    {msgDepth && (
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ${msgDepth.dot} ring-2 ring-background`}
                      />
                    )}
                  </div>
                )}
                {m.from === "me" ? (
                  <div className="max-w-[78%] rounded-2xl rounded-tr-sm px-5 py-3 bg-primary text-primary-foreground shadow-soft">
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                ) : (
                  <div className="max-w-[78%]">
                    {msgDepth && (
                      <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                        {msgDepth.label}
                      </div>
                    )}
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
            );
          })}
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
            placeholder={`Scrivi in modalità ${depth.label.toLowerCase()}…`}
            className="flex-1 resize-none bg-transparent outline-none py-2.5 px-2 leading-relaxed max-h-40"
          />
          <button onClick={send} className="size-10 grid place-items-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition shadow-soft">
            <Send className="size-4" />
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-3 text-[11px] text-muted-foreground text-center">
          Nessuna fretta. Scrivi come parleresti. · Hu-Mind non fornisce diagnosi né valutazioni cliniche.
        </div>
      </div>

      {/* Advanced mode confirmation */}
      {pendingDepth && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/20 backdrop-blur-sm p-6">
          <div className="max-w-md w-full rounded-2xl bg-card border border-border shadow-soft p-6">
            <div className="flex items-start gap-3">
              <div className={`size-9 shrink-0 rounded-full grid place-items-center ${pendingDepth.dot}/20`}>
                <AlertTriangle className="size-4 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${pendingDepth.dot}`} />
                  <h2 className="font-display text-lg">Modalità {pendingDepth.label}</h2>
                </div>
                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{pendingDepth.warning}</p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{pendingDepth.guide}</p>
              </div>
              <button
                onClick={() => setPendingDepth(null)}
                className="size-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setPendingDepth(null)}
                className="px-4 py-2 rounded-xl text-sm hover:bg-muted transition"
              >
                Annulla
              </button>
              <button
                onClick={confirmAdvanced}
                className="px-4 py-2 rounded-xl text-sm bg-primary text-primary-foreground shadow-soft hover:opacity-90 transition"
              >
                Attiva {pendingDepth.label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
