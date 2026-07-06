import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Send, Paperclip, BookMarked, AlertTriangle, X, Wind, Clock } from "lucide-react";
import { suggestPracticeForText } from "./_app.pause";
import {
  analyzeConversationDepth,
  type ConversationDepthId,
} from "@/domain/conversationAdaptation";
import {
  DEFAULT_CONVERSATION_MODE,
  loadConversationModePreference,
  saveConversationModePreference,
  type ConversationModePreference,
} from "@/domain/conversationPreferences";
import {
  composePromptContext,
  type PromptConversationMessage,
} from "@/domain/promptComposer";
import { extractCognitiveCandidates } from "@/domain/cognitiveExtraction";
import { useThoughts } from "@/domain/ThoughtsProvider";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
});

type Msg = { id: number; from: "me" | "ai"; text: string; refs?: string[]; level?: DepthId };
type DepthId = ConversationDepthId;
type ModeId = ConversationModePreference;

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
    description: "Spazio, attenzione e chiarimento leggero. Nessuna interpretazione.",
    guide: "Hu-Mind ascolta e aiuta a chiarire. Non scava, non conclude.",
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
    guide: "Hu-Mind propone osservazioni leggere e domande aperte. Modalità predefinita.",
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
    guide: "Hu-Mind esplora temi ricorrenti e propone collegamenti tra esperienze diverse.",
    reply:
      "C'è qualcosa che torna, qui. Potrebbe collegarsi a un filo che hai già nominato: il bisogno di rallentare prima che le cose ti chiedano qualcosa. Vivi questi due momenti come parte della stessa domanda?",
    refs: ["Memoria recente", "Filo ricorrente"],
  },
  {
    id: "autoanalisi",
    label: "Autoanalisi",
    dot: "bg-amber-500",
    ring: "ring-amber-500/40",
    tagline: "Guardiamo i pattern.",
    description: "Analisi di pattern longitudinali e collegamenti tra periodi diversi. Uso più intenso dei framework.",
    guide:
      "Hu-Mind osserva ricorrenze narrative e pattern longitudinali. Mai etichette, mai conclusioni su chi sei.",
    advanced: true,
    warning: "Questa modalità può portare a riflessioni profonde e a domande impegnative.",
    reply:
      "Provo a tenere insieme alcuni fili. Nelle cose che scrivi sembra tornare un movimento simile: ti carichi di compiti quando vuoi rendere tangibile il valore di ciò che fai. Risuona, oppure ti sembra che stia forzando il collegamento?",
    refs: ["Pattern narrativo", "Valori personali"],
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

const AUTO_MODE = {
  id: DEFAULT_CONVERSATION_MODE,
  label: "Automatica ⭐ (Consigliata)",
  description: "Hu-Mind adatta profondità, ritmo e stile in base alla scrittura.",
};

function formatThoughtRef(createdAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

function ChatPage() {
  const { addThought, thoughts } = useThoughts();
  const [modeId, setModeId] = useState<ModeId>(DEFAULT_CONVERSATION_MODE);
  const [depthId, setDepthId] = useState<DepthId>("ascolto");
  const [acknowledgedAdvanced, setAcknowledgedAdvanced] = useState<Record<string, boolean>>({});
  const [pendingDepth, setPendingDepth] = useState<Depth | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: "ai", text: "Ehi, bentornata. Scrivi quello che ti attraversa: lo conserverò nella tua memoria narrativa e potremo osservarne i fili nel tempo.", level: "ascolto" },
  ]);
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState<ReturnType<typeof suggestPracticeForText>>(null);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const [lastSuggestionAt, setLastSuggestionAt] = useState(-99);
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Restore only the user's mode preference. Conversation content stays out of localStorage.
  useEffect(() => {
    const savedMode = loadConversationModePreference();
    setModeId(savedMode);

    if (savedMode !== DEFAULT_CONVERSATION_MODE) {
      setDepthId(savedMode);
    }
  }, []);

  // TODO: Replace local preference persistence with the future conversation backend.
  useEffect(() => {
    saveConversationModePreference(modeId);
  }, [modeId]);

  const depth = DEPTHS.find((d) => d.id === depthId) ?? DEPTHS[1];
  const latestThoughtRefs = thoughts.slice(0, 2).map((thought) => formatThoughtRef(thought.createdAt));

  const requestDepth = (next: Depth) => {
    if (next.id === depth.id) {
      setModeId(next.id);
      return;
    }
    if (next.advanced && !acknowledgedAdvanced[next.id]) {
      setPendingDepth(next);
      return;
    }
    setModeId(next.id);
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
    setModeId(pendingDepth.id);
    applyDepth(pendingDepth);
    setPendingDepth(null);
  };

  const activateAutomaticMode = () => {
    setPendingDepth(null);
    setModeId(DEFAULT_CONVERSATION_MODE);
  };

  const send = () => {
    if (!input.trim()) return;
    const text = input;
    const recentConversation: PromptConversationMessage[] = [
      ...messages.slice(-6).map((message) => ({
        role: message.from === "me" ? "user" : "assistant",
        text: message.text,
      })),
      { role: "user", text },
    ];
    const promptContext = composePromptContext({
      currentUserMessage: text,
      recentConversation,
      conversationMode: modeId,
    });
    const cognitiveExtraction = extractCognitiveCandidates(promptContext);
    void cognitiveExtraction;

    addThought({ text, source: "chat", tags: ["Conversazione"] });
    setMessages((m) => [...m, { id: Date.now(), from: "me", text }]);
    setInput("");
    const nextCount = userMsgCount + 1;
    setUserMsgCount(nextCount);
    // Build rolling context: last few user messages, oldest → newest.
    const recentUserTexts = [
      ...messages.filter((mm) => mm.from === "me").slice(-3).map((mm) => mm.text),
      text,
    ];
    const adaptation =
      promptContext.conversationMode === DEFAULT_CONVERSATION_MODE
        ? analyzeConversationDepth({
            message: promptContext.currentUserMessage,
            recentUserMessages: recentUserTexts,
            currentDepth: depthId,
          })
        : null;
    const nextDepthId = adaptation?.nextDepth ?? depthId;
    const current = DEPTHS.find((d) => d.id === nextDepthId) ?? DEPTHS[1];

    if (adaptation && nextDepthId !== depthId) {
      setDepthId(nextDepthId);
    }

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, from: "ai", text: current.reply, refs: current.refs ?? latestThoughtRefs, level: current.id },
      ]);
      // Contextual practice suggestion — based on sentiment + recurring themes
      // across the last few user messages. Throttled to at most one every 4
      // user messages and never the same dismissed practice.
      const candidate = suggestPracticeForText(recentUserTexts);
      if (candidate && !dismissed.includes(candidate.id) && nextCount - lastSuggestionAt >= 4) {
        setSuggestion(candidate);
        setLastSuggestionAt(nextCount);
      }
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
              <h1 className="font-display text-2xl mt-1">Conversazione riflessiva</h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={`size-2 rounded-full ${depth.dot} animate-pulse-soft`} />
              <span>
                {modeId === DEFAULT_CONVERSATION_MODE
                  ? `automatica · ${depth.label.toLowerCase()}`
                  : `in modalità ${depth.label.toLowerCase()}`}
              </span>
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
              <button
                onClick={activateAutomaticMode}
                title={AUTO_MODE.description}
                className={[
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition",
                  modeId === DEFAULT_CONVERSATION_MODE
                    ? "bg-secondary border-border ring-2 ring-primary/30"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60",
                ].join(" ")}
              >
                <Sparkles className="size-3.5" />
                <span className={modeId === DEFAULT_CONVERSATION_MODE ? "text-foreground font-medium" : ""}>
                  {AUTO_MODE.label}
                </span>
              </button>
              {DEPTHS.map((d) => {
                const active = modeId !== DEFAULT_CONVERSATION_MODE && d.id === depth.id;
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
            <p className="mt-2 text-xs text-muted-foreground italic">
              Hu-Mind osserva il modo in cui scrivi e adatta naturalmente profondità, ritmo e stile della conversazione. Puoi sempre scegliere manualmente una modalità.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{depth.guide}</p>
          </div>

          {thoughts.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-card/60 px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Memoria recente
              </div>
              <div className="space-y-1.5">
                {thoughts.slice(0, 2).map((thought) => (
                  <p key={thought.id} className="truncate text-xs text-foreground/75">
                    {thought.text}
                  </p>
                ))}
              </div>
            </div>
          )}
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

      {/* Contextual practice suggestion */}
      {suggestion && (
        <div className="px-6 md:px-12">
          <div className="max-w-3xl mx-auto rounded-2xl border border-border/60 bg-secondary/40 p-4 flex items-start gap-3">
            <div className="size-9 shrink-0 rounded-full bg-primary/10 grid place-items-center">
              <Wind className="size-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Suggerimento gentile</div>
              <p className="mt-1 text-sm leading-relaxed">
                Potrebbe esserti utile una breve pausa guidata di {suggestion.minutes} minuti prima di continuare:{" "}
                <span className="font-medium">{suggestion.title}</span>.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  to="/pause"
                  onClick={() => setSuggestion(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary text-primary-foreground hover:opacity-90 transition"
                >
                  <Clock className="size-3" /> Apri la pausa
                </Link>
                <button
                  onClick={() => setSuggestion(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition"
                >
                  Ignora
                </button>
                <button
                  onClick={() => {
                    setDismissed((d) => [...d, suggestion.id]);
                    setSuggestion(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition"
                >
                  Non proporla più
                </button>
              </div>
            </div>
            <button
              onClick={() => setSuggestion(null)}
              className="size-7 grid place-items-center rounded-md text-muted-foreground hover:bg-muted"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

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
            placeholder={
              modeId === DEFAULT_CONVERSATION_MODE
                ? "Scrivi liberamente: Hu-Mind adatta la conversazione…"
                : `Scrivi in modalità ${depth.label.toLowerCase()}…`
            }
            className="flex-1 resize-none bg-transparent outline-none py-2.5 px-2 leading-relaxed max-h-40"
          />
          <button onClick={send} className="size-10 grid place-items-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition shadow-soft">
            <Send className="size-4" />
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-3 text-[11px] text-muted-foreground text-center">
          Nessuna fretta. Scrivi come parleresti. · Hu-Mind offre memoria narrativa, non giudizi sulla persona.
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
