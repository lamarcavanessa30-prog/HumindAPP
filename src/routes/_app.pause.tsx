import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Play, Pause, Heart, ThumbsUp, ChevronLeft, Clock, Search, Filter } from "lucide-react";

export const Route = createFileRoute("/_app/pause")({
  component: PausePage,
});

type Category =
  | "Regolazione emotiva"
  | "Auto-compassione"
  | "Confini personali"
  | "Ansia e preoccupazione"
  | "Sonno e decompressione"
  | "Sovraccarico mentale"
  | "ADHD e attenzione"
  | "Relazioni"
  | "Lutto e perdita"
  | "Grounding";

type Practice = {
  id: string;
  title: string;
  category: Category;
  minutes: number;
  short: string;
  script: string[];
  triggers: string[]; // contextual keywords
};

const CATEGORIES: Category[] = [
  "Regolazione emotiva",
  "Auto-compassione",
  "Confini personali",
  "Ansia e preoccupazione",
  "Sonno e decompressione",
  "Sovraccarico mentale",
  "ADHD e attenzione",
  "Relazioni",
  "Lutto e perdita",
  "Grounding",
];

const PRACTICES: Practice[] = [
  {
    id: "reg-1",
    title: "Onda dell'emozione",
    category: "Regolazione emotiva",
    minutes: 4,
    short: "Osservare un'emozione intensa lasciandola salire e scendere come un'onda.",
    triggers: ["rabbia", "tristezza", "frustrazione", "emozione"],
    script: [
      "Trova una posizione comoda. Lascia che le spalle si abbassino.",
      "Riconosci l'emozione presente. Dalle un nome semplice, senza giudicarla.",
      "Immagina che questa emozione sia un'onda: ora sta salendo.",
      "Resta con la sensazione, senza spingerla via. Non sei l'onda, sei chi la osserva.",
      "Nota come, lentamente, l'intensità inizia a diminuire.",
      "Concludi con tre respiri lenti, riportando l'attenzione al corpo.",
    ],
  },
  {
    id: "auto-1",
    title: "Una mano sul cuore",
    category: "Auto-compassione",
    minutes: 3,
    short: "Gesto di gentilezza verso se stessi nei momenti difficili.",
    triggers: ["colpa", "vergogna", "errore", "non sono abbastanza"],
    script: [
      "Posa una mano sul cuore e una sul ventre.",
      "Riconosci: 'Questo è un momento difficile.'",
      "Ricorda: 'La difficoltà fa parte dell'essere umano. Non sono sola.'",
      "Offri a te stessa parole gentili, come faresti con una persona cara.",
      "Resta qualche respiro così, accogliendo ciò che senti.",
    ],
  },
  {
    id: "conf-1",
    title: "Il mio spazio",
    category: "Confini personali",
    minutes: 4,
    short: "Visualizzare lo spazio personale e i propri sì e no.",
    triggers: ["confini", "dire no", "limiti", "invasione"],
    script: [
      "Immagina intorno a te uno spazio circolare, della dimensione che senti giusta.",
      "Questo è il tuo spazio. Tu decidi cosa entra e cosa resta fuori.",
      "Pensa a una richiesta recente. Dove la collocheresti?",
      "Nota cosa cambia nel corpo quando immagini di dire un sì autentico, o un no rispettoso.",
      "Torna al respiro e al contatto con la sedia.",
    ],
  },
  {
    id: "ans-1",
    title: "Respiro 4-7-8",
    category: "Ansia e preoccupazione",
    minutes: 3,
    short: "Tecnica di respirazione per attenuare l'attivazione fisiologica.",
    triggers: ["ansia", "preoccupazione", "panico", "agitazione"],
    script: [
      "Inspira lentamente dal naso contando fino a 4.",
      "Trattieni il respiro per 7.",
      "Espira dalla bocca, lentamente, per 8.",
      "Ripeti per quattro cicli, senza forzare.",
      "Concludi notando se qualcosa, nel corpo, si è ammorbidito.",
    ],
  },
  {
    id: "son-1",
    title: "Decompressione serale",
    category: "Sonno e decompressione",
    minutes: 6,
    short: "Pratica per rilasciare la tensione accumulata e prepararsi al sonno.",
    triggers: ["sonno", "stanchezza", "insonnia", "sera"],
    script: [
      "Stenditi o accomodati in posizione comoda. Luci basse.",
      "Parti dai piedi: contrai per tre secondi, poi rilascia.",
      "Sali lentamente: polpacci, cosce, addome, mani, braccia, spalle, viso.",
      "A ogni rilascio, lascia che il corpo affondi un po' di più.",
      "Lascia che i pensieri passino, senza trattenerli.",
      "Resta nel silenzio finché ne senti il bisogno.",
    ],
  },
  {
    id: "sov-1",
    title: "Posa la valigia",
    category: "Sovraccarico mentale",
    minutes: 4,
    short: "Riconoscere ciò che si sta portando e scegliere cosa posare.",
    triggers: ["sovraccarico", "troppo", "stanca", "burnout"],
    script: [
      "Immagina di tenere in mano una valigia molto pesante.",
      "Dentro ci sono i compiti, le richieste, le aspettative di oggi.",
      "Uno alla volta, tirali fuori e dai loro un nome.",
      "Per ciascuno, chiediti: devo portarlo io, ora?",
      "Lascia a terra ciò che può aspettare, o ciò che non ti appartiene.",
      "Riprendi la valigia, più leggera, e respira.",
    ],
  },
  {
    id: "adhd-1",
    title: "Reset di tre minuti",
    category: "ADHD e attenzione",
    minutes: 3,
    short: "Micro-pausa per ricomporre l'attenzione tra un compito e l'altro.",
    triggers: ["distrazione", "concentrazione", "adhd", "salto", "task switching"],
    script: [
      "Chiudi gli occhi o abbassa lo sguardo.",
      "Senti i piedi a terra e il peso del corpo sulla sedia.",
      "Nomina mentalmente tre cose che senti adesso (suoni, contatti, temperatura).",
      "Riapri gli occhi. Identifica il prossimo, singolo passo concreto.",
      "Riparti da quello, senza pretendere di vedere oltre.",
    ],
  },
  {
    id: "rel-1",
    title: "Prima di rispondere",
    category: "Relazioni",
    minutes: 3,
    short: "Pausa per scegliere come rispondere invece di reagire.",
    triggers: ["conflitto", "litigio", "relazione", "fraintendimento"],
    script: [
      "Fai un respiro lungo. Non devi rispondere subito.",
      "Chiediti: cosa sto sentendo, sotto la prima reazione?",
      "Chiediti: cosa è importante per me, in questa relazione?",
      "Formula mentalmente una risposta che onori entrambe le cose.",
      "Quando sei pronta, parla. O scegli il silenzio, se è più vero.",
    ],
  },
  {
    id: "lut-1",
    title: "Spazio per la mancanza",
    category: "Lutto e perdita",
    minutes: 5,
    short: "Accogliere la mancanza senza doverla risolvere.",
    triggers: ["lutto", "perdita", "mancanza", "addio"],
    script: [
      "Trova una posizione comoda. Permetti al respiro di essere come è.",
      "Riconosci la mancanza che è qui oggi. Non c'è bisogno di sistemarla.",
      "Se vuoi, porta alla mente un'immagine, un suono, un odore legato a chi non c'è.",
      "Lascia che le emozioni si muovano. Tutto ciò che arriva è benvenuto.",
      "Ringrazia te stessa per aver tenuto questo spazio.",
    ],
  },
  {
    id: "gro-1",
    title: "5 sensi qui",
    category: "Grounding",
    minutes: 3,
    short: "Riportarsi al presente attraverso i cinque sensi.",
    triggers: ["dissociazione", "lontananza", "confusione", "grounding", "panico"],
    script: [
      "Guarda intorno e nomina 5 cose che vedi.",
      "Nomina 4 cose che puoi toccare.",
      "Nomina 3 suoni che senti.",
      "Nomina 2 odori, anche immaginati.",
      "Nomina 1 sapore presente in bocca.",
      "Chiudi con un respiro lento. Sei qui.",
    ],
  },
];

const FAV_KEY = "humind.pause.favs";
const USEFUL_KEY = "humind.pause.useful";

function PausePage() {
  const [favs, setFavs] = useState<string[]>([]);
  const [useful, setUseful] = useState<string[]>([]);
  const [filter, setFilter] = useState<Category | "Tutte">("Tutte");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Practice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setFavs(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
      setUseful(JSON.parse(localStorage.getItem(USEFUL_KEY) || "[]"));
    } catch {
      /* noop */
    }
  }, []);

  const persist = (key: string, value: string[]) => {
    if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
  };

  const toggleFav = (id: string) => {
    setFavs((f) => {
      const next = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
      persist(FAV_KEY, next);
      return next;
    });
  };

  const markUseful = (id: string) => {
    setUseful((u) => {
      const next = u.includes(id) ? u.filter((x) => x !== id) : [...u, id];
      persist(USEFUL_KEY, next);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return PRACTICES.filter((p) => filter === "Tutte" || p.category === filter).filter(
      (p) =>
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.short.toLowerCase().includes(query.toLowerCase()),
    );
  }, [filter, query]);

  if (active) return <PracticeReader practice={active} onBack={() => setActive(null)} onFav={toggleFav} onUseful={markUseful} isFav={favs.includes(active.id)} isUseful={useful.includes(active.id)} />;

  return (
    <div className="min-h-screen px-6 md:px-12 py-10 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Strumenti di pausa</div>
          <h1 className="font-display text-4xl mt-1">Pause Guidate</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
            Brevi pratiche contestuali per accompagnare un momento, non per riempirlo. Non sono meditazioni:
            sono soste pensate per sostenere la riflessione, la regolazione e il ritorno a sé.
          </p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
          <div className="relative flex-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca una pausa…"
              className="w-full bg-muted/60 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <span>{filtered.length} pratiche</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {(["Tutte", ...CATEGORIES] as const).map((c) => {
            const active = c === filter;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              className="text-left rounded-2xl border border-border/60 bg-card p-5 hover:shadow-soft hover:-translate-y-0.5 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.category}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" /> {p.minutes} min
                </span>
              </div>
              <h3 className="font-display text-xl mt-2 leading-snug">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.short}</p>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-primary">
                  <Play className="size-3.5" /> Avvia
                </span>
                {favs.includes(p.id) && (
                  <span className="inline-flex items-center gap-1 text-rose-500">
                    <Heart className="size-3.5 fill-current" /> nei preferiti
                  </span>
                )}
                {useful.includes(p.id) && (
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <ThumbsUp className="size-3.5" /> utile
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PracticeReader({
  practice,
  onBack,
  onFav,
  onUseful,
  isFav,
  isUseful,
}: {
  practice: Practice;
  onBack: () => void;
  onFav: (id: string) => void;
  onUseful: (id: string) => void;
  isFav: boolean;
  isUseful: boolean;
}) {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!running) return;
    const perStep = Math.max(8, Math.floor((practice.minutes * 60) / practice.script.length));
    const t = setTimeout(() => {
      setStep((s) => {
        if (s >= practice.script.length - 1) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, perStep * 1000);
    return () => clearTimeout(t);
  }, [running, step, practice]);

  return (
    <div className="min-h-screen px-6 md:px-12 py-10 pb-24">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="size-4" /> Tutte le pause
        </button>

        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{practice.category}</div>
        <h1 className="font-display text-3xl md:text-4xl mt-1">{practice.title}</h1>
        <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" /> {practice.minutes} minuti
        </div>
        <p className="mt-4 text-muted-foreground leading-relaxed">{practice.short}</p>

        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 md:p-8">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Testo guidato</div>
          <ol className="space-y-4">
            {practice.script.map((line, i) => {
              const isActive = running && i === step;
              const done = running && i < step;
              return (
                <li
                  key={i}
                  className={`flex gap-3 leading-relaxed transition ${
                    isActive ? "text-foreground" : done ? "text-muted-foreground/60 line-through" : "text-foreground/80"
                  }`}
                >
                  <span
                    className={`mt-1 size-5 shrink-0 rounded-full grid place-items-center text-[10px] ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : done
                          ? "bg-muted text-muted-foreground"
                          : "border border-border text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="font-display text-lg">{line}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (running) {
                setRunning(false);
              } else {
                setStep(0);
                setRunning(true);
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground shadow-soft hover:opacity-90 transition"
          >
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
            {running ? "Pausa" : "Avvia"}
          </button>
          <button
            onClick={() => onFav(practice.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition ${
              isFav ? "border-rose-300 text-rose-500 bg-rose-50" : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Heart className={`size-4 ${isFav ? "fill-current" : ""}`} />
            {isFav ? "Nei preferiti" : "Salva nei preferiti"}
          </button>
          <button
            onClick={() => onUseful(practice.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition ${
              isUseful ? "border-emerald-300 text-emerald-600 bg-emerald-50" : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <ThumbsUp className="size-4" />
            {isUseful ? "Segnata come utile" : "Segna come utile"}
          </button>
        </div>

        <p className="mt-10 text-[11px] text-muted-foreground text-center leading-relaxed">
          Hu-Mind non offre meditazione né cure. Le pause guidate sono strumenti contestuali di supporto alla riflessione.
        </p>
      </div>
    </div>
  );
}

// Exported helper to be reused by chat suggestions
export function suggestPracticeForText(text: string): Practice | null {
  const t = text.toLowerCase();
  let best: { p: Practice; score: number } | null = null;
  for (const p of PRACTICES) {
    const score = p.triggers.reduce((acc, k) => (t.includes(k) ? acc + 1 : acc), 0);
    if (score > 0 && (!best || score > best.score)) best = { p, score };
  }
  return best?.p ?? null;
}

export { PRACTICES };
