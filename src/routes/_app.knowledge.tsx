import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookMarked,
  Brain,
  Heart,
  Compass,
  Zap,
  ShieldCheck,
  Users,
  Activity,
  Sparkles,
  Wind,
  Smile,
  Layers,
  ChevronDown,
  Info,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/_app/knowledge")({
  component: KnowledgePage,
});

type Framework = {
  id: string;
  name: string;
  acronym?: string;
  icon: typeof Brain;
  description: string;
  authors: string[];
  concepts: string[];
  usage: string;
  limits: string;
  sources: string[];
};

const FRAMEWORKS: Framework[] = [
  {
    id: "cbt",
    name: "Terapia Cognitivo Comportamentale",
    acronym: "CBT",
    icon: Brain,
    description:
      "Modello che osserva come pensieri, emozioni e comportamenti si influenzano reciprocamente, riconoscendo distorsioni cognitive ricorrenti.",
    authors: ["Aaron T. Beck", "Albert Ellis", "Judith S. Beck"],
    concepts: [
      "Triangolo cognitivo (pensieri-emozioni-comportamenti)",
      "Distorsioni cognitive",
      "Ristrutturazione cognitiva",
      "Esperimenti comportamentali",
    ],
    usage:
      "Hu-Mind utilizza la CBT come lente per riconoscere pattern di pensiero ricorrenti (es. pensiero tutto-o-nulla, catastrofizzazione) emersi nelle conversazioni.",
    limits:
      "Privilegia un livello cognitivo-comportamentale. Può risultare meno adatto quando emergono temi profondi di trauma, attaccamento o sofferenza relazionale prolungata.",
    sources: [
      "Beck, A. T. (1979). Cognitive Therapy of Depression.",
      "Hofmann, S. G. et al. (2012). The Efficacy of Cognitive Behavioral Therapy: A Review of Meta-analyses.",
    ],
  },
  {
    id: "dbt",
    name: "Dialectical Behavior Therapy",
    acronym: "DBT",
    icon: Heart,
    description:
      "Approccio che integra accettazione e cambiamento, sviluppando abilità per regolare emozioni intense e gestire le relazioni.",
    authors: ["Marsha M. Linehan"],
    concepts: [
      "Mindfulness",
      "Tolleranza del disagio",
      "Regolazione emotiva",
      "Efficacia interpersonale",
    ],
    usage:
      "Hu-Mind richiama la cornice DBT quando osserva oscillazioni emotive intense, difficoltà nel tollerare il disagio o tensioni interpersonali.",
    limits:
      "Le abilità sono efficaci se praticate nel tempo. Hu-Mind può segnalarle ma non sostituisce un percorso DBT strutturato condotto da un professionista qualificato.",
    sources: [
      "Linehan, M. M. (1993). Cognitive-Behavioral Treatment of Borderline Personality Disorder.",
      "Linehan, M. M. (2014). DBT Skills Training Manual (2nd ed.).",
    ],
  },
  {
    id: "act",
    name: "Acceptance and Commitment Therapy",
    acronym: "ACT",
    icon: Compass,
    description:
      "Sviluppa la flessibilità psicologica: stare in contatto con l'esperienza presente e agire in coerenza con i propri valori.",
    authors: ["Steven C. Hayes", "Kelly G. Wilson", "Kirk D. Strosahl"],
    concepts: [
      "Defusione cognitiva",
      "Accettazione",
      "Valori personali",
      "Azione impegnata",
      "Sé come contesto",
    ],
    usage:
      "Hu-Mind utilizza ACT per leggere il rapporto tra valori dichiarati e scelte quotidiane, e per riconoscere strategie di evitamento esperienziale.",
    limits:
      "Lavora su processi e non su contenuti. Le osservazioni in chiave ACT richiedono materiale narrativo sufficiente sul piano dei valori e dell'azione.",
    sources: [
      "Hayes, S. C., Strosahl, K. D., Wilson, K. G. (1999). Acceptance and Commitment Therapy.",
      "Harris, R. (2009). ACT Made Simple.",
    ],
  },
  {
    id: "adhd",
    name: "Cornice ADHD-Informata",
    icon: Zap,
    description:
      "Lente educativa che considera funzioni esecutive, regolazione dell'attenzione, percezione del tempo e regolazione emotiva.",
    authors: ["Russell A. Barkley", "Thomas E. Brown", "Edward M. Hallowell"],
    concepts: [
      "Funzioni esecutive",
      "Regolazione dell'attenzione",
      "Percezione del tempo",
      "Iperfocus",
      "Disregolazione emotiva",
    ],
    usage:
      "Hu-Mind utilizza questa cornice come lente educativa per descrivere pattern di avvio del compito, energia variabile e percezione del tempo.",
    limits:
      "Non è uno strumento diagnostico. La presenza di tratti non implica una diagnosi di ADHD, che richiede valutazione clinica specialistica.",
    sources: [
      "Barkley, R. A. (2015). Attention-Deficit Hyperactivity Disorder: A Handbook for Diagnosis and Treatment.",
      "Brown, T. E. (2013). A New Understanding of ADHD in Children and Adults.",
    ],
  },
  {
    id: "trauma",
    name: "Cornice Trauma-Informata",
    icon: ShieldCheck,
    description:
      "Approccio che riconosce l'impatto delle esperienze avverse e privilegia sicurezza, scelta, collaborazione e fiducia.",
    authors: ["Bessel van der Kolk", "Judith Herman", "Stephen Porges"],
    concepts: [
      "Sicurezza percepita",
      "Finestra di tolleranza",
      "Risposte di sopravvivenza",
      "Co-regolazione",
      "Teoria polivagale",
    ],
    usage:
      "Hu-Mind utilizza la cornice trauma-informata per riconoscere segnali di iper- o ipo-attivazione e per modulare il tono delle proprie domande.",
    limits:
      "Non sostituisce un percorso di elaborazione del trauma. Le osservazioni vengono presentate come ipotesi, mai come affermazioni cliniche.",
    sources: [
      "van der Kolk, B. (2014). The Body Keeps the Score.",
      "Porges, S. W. (2011). The Polyvagal Theory.",
    ],
  },
  {
    id: "attachment",
    name: "Teoria dell'Attaccamento",
    icon: Users,
    description:
      "Studia il modo in cui i legami precoci modellano gli schemi relazionali e la regolazione affettiva nel tempo.",
    authors: ["John Bowlby", "Mary Ainsworth", "Mary Main"],
    concepts: [
      "Modelli operativi interni",
      "Stili di attaccamento (sicuro, ansioso, evitante, disorganizzato)",
      "Base sicura",
      "Riparazione relazionale",
    ],
    usage:
      "Hu-Mind utilizza concetti di attaccamento per osservare dinamiche di ricerca di prossimità, gestione della distanza e regolazione nelle relazioni significative.",
    limits:
      "Gli stili sono tendenze, non categorie rigide. Senza valutazione specialistica restano ipotesi descrittive, non diagnosi.",
    sources: [
      "Bowlby, J. (1988). A Secure Base.",
      "Mikulincer, M., Shaver, P. R. (2007). Attachment in Adulthood.",
    ],
  },
  {
    id: "emo-reg",
    name: "Regolazione Emotiva",
    icon: Activity,
    description:
      "Insieme di processi attraverso cui le persone influenzano quali emozioni provano, quando le provano e come le esprimono.",
    authors: ["James J. Gross", "Lisa Feldman Barrett"],
    concepts: [
      "Modello processuale della regolazione (Gross)",
      "Granularità emotiva",
      "Rivalutazione cognitiva",
      "Soppressione espressiva",
    ],
    usage:
      "Hu-Mind osserva la varietà del lessico emotivo, la presenza di rivalutazioni e i momenti in cui sembra prevalere la soppressione.",
    limits:
      "Le strategie non sono né buone né cattive in assoluto: il loro valore dipende dal contesto. Hu-Mind non valuta, descrive.",
    sources: [
      "Gross, J. J. (2015). Emotion Regulation: Current Status and Future Prospects.",
      "Barrett, L. F. (2017). How Emotions Are Made.",
    ],
  },
  {
    id: "neuro",
    name: "Neuroscienze Cognitive",
    icon: Brain,
    description:
      "Studio delle basi neurali di attenzione, memoria, decisione, emozione e regolazione del comportamento.",
    authors: ["Antonio Damasio", "Joseph LeDoux", "Stanislas Dehaene"],
    concepts: [
      "Sistemi attentivi",
      "Memoria di lavoro",
      "Circuiti di regolazione emotiva",
      "Errore di predizione",
    ],
    usage:
      "Hu-Mind utilizza concetti di neuroscienze cognitive come metafore esplicative dei propri ragionamenti, mai come letture cliniche del cervello dell'utente.",
    limits:
      "Le inferenze neuroscientifiche su singole persone sulla base di comportamento sono sempre indirette e approssimative.",
    sources: [
      "Damasio, A. (2010). Self Comes to Mind.",
      "LeDoux, J. (2002). Synaptic Self.",
    ],
  },
  {
    id: "personality",
    name: "Psicologia della Personalità",
    icon: Layers,
    description:
      "Studio dei tratti, dei pattern motivazionali e delle differenze individuali stabili nel tempo.",
    authors: ["Robert McCrae", "Paul Costa", "Dan P. McAdams"],
    concepts: [
      "Big Five (OCEAN)",
      "Tratti, adattamenti caratteristici, identità narrativa",
      "Stabilità e cambiamento",
    ],
    usage:
      "Hu-Mind richiama dimensioni di personalità per descrivere tendenze ricorrenti, evitando di ridurre la persona a un punteggio.",
    limits:
      "I tratti descrivono tendenze medie, non determinano il comportamento. Hu-Mind non somministra test di personalità.",
    sources: [
      "McCrae, R. R., Costa, P. T. (2008). The Five-Factor Theory of Personality.",
      "McAdams, D. P. (2015). The Art and Science of Personality Development.",
    ],
  },
  {
    id: "positive",
    name: "Psicologia Positiva",
    icon: Smile,
    description:
      "Studio scientifico delle risorse personali, dei punti di forza, del benessere e della crescita.",
    authors: ["Martin E. P. Seligman", "Christopher Peterson", "Barbara Fredrickson"],
    concepts: [
      "Forze di carattere (VIA)",
      "Modello PERMA",
      "Emozioni positive ed espansione delle risorse",
      "Significato e scopo",
    ],
    usage:
      "Hu-Mind utilizza la psicologia positiva per nominare le risorse osservate e bilanciare la lettura, evitando una narrazione centrata solo sulle difficoltà.",
    limits:
      "Il rischio è la 'positività tossica': Hu-Mind cerca di nominare le risorse senza minimizzare la sofferenza.",
    sources: [
      "Seligman, M. E. P. (2011). Flourish.",
      "Peterson, C., Seligman, M. E. P. (2004). Character Strengths and Virtues.",
    ],
  },
  {
    id: "mindfulness",
    name: "Mindfulness basata su evidenze",
    icon: Wind,
    description:
      "Pratiche di attenzione intenzionale e non giudicante al momento presente, validate in contesti clinici e non clinici.",
    authors: ["Jon Kabat-Zinn", "Zindel Segal", "Mark Williams"],
    concepts: [
      "MBSR (Mindfulness-Based Stress Reduction)",
      "MBCT (Mindfulness-Based Cognitive Therapy)",
      "Attenzione focalizzata e monitoraggio aperto",
      "Decentramento",
    ],
    usage:
      "Hu-Mind si ispira a questa tradizione nelle Pause Guidate e nel proporre momenti di osservazione descrittiva, mai prescrittiva.",
    limits:
      "Le pratiche non sono adatte in modo indifferenziato a tutte le situazioni (es. fasi acute di trauma). Hu-Mind non sostituisce un'istruzione qualificata.",
    sources: [
      "Kabat-Zinn, J. (1990). Full Catastrophe Living.",
      "Segal, Z., Williams, M., Teasdale, J. (2012). Mindfulness-Based Cognitive Therapy for Depression.",
    ],
  },
];

function KnowledgePage() {
  const [openId, setOpenId] = useState<string | null>("cbt");

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto pb-32">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
          <BookMarked className="size-3.5 text-primary" /> knowledge architecture
        </div>
        <h1 className="font-display text-3xl md:text-5xl leading-[1.05]">
          Le fondamenta scientifiche di Hu-Mind.
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          Non una biblioteca, ma una mappa esplicita dei modelli teorici che Hu-Mind utilizza
          per leggere e restituire il tuo materiale. Ogni framework è descritto insieme ai suoi
          limiti, perché la fiducia nasce dalla trasparenza, non dall'apparenza di intelligenza.
        </p>
      </header>

      {/* Principle */}
      <section className="mb-10 rounded-3xl border border-border/60 bg-secondary/40 p-6 md:p-8">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">principio fondamentale</div>
        <p className="font-display text-xl md:text-2xl leading-snug text-foreground">
          Le persone non devono fidarsi di Hu-Mind perché sembra intelligente.
          Devono potersi fidare perché il suo ragionamento è trasparente.
        </p>
      </section>

      {/* Reasoning path */}
      <section className="mb-12">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">come pensa hu-mind</div>
        <div className="rounded-2xl bg-card border border-border/60 p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {["Conversazioni", "Temi", "Pattern", "Evidenze", "Framework", "Osservazione finale"].map((s, i, arr) => (
              <span key={s} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-secondary/60 border border-border/60 text-foreground/85">{s}</span>
                {i < arr.length - 1 && <ArrowRight className="size-3.5 text-muted-foreground" />}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            Ogni osservazione importante può essere espansa per mostrare quale parte di questo percorso l'ha generata.
          </p>
        </div>
      </section>

      {/* Frameworks */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="font-display text-2xl">Framework utilizzati</h2>
          <span className="text-xs text-muted-foreground">{FRAMEWORKS.length} aree</span>
        </div>
        {FRAMEWORKS.map((f) => {
          const open = openId === f.id;
          const Icon = f.icon;
          return (
            <div key={f.id} className="rounded-2xl border border-border/60 bg-card overflow-hidden">
              <button
                onClick={() => setOpenId(open ? null : f.id)}
                aria-expanded={open}
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-muted/30 transition"
              >
                <div className="size-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                  <Icon className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-display text-lg">{f.name}</h3>
                    {f.acronym && (
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-0.5 rounded-full bg-secondary border border-border/60">
                        {f.acronym}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.description}</p>
                </div>
                <ChevronDown className={`size-4 text-muted-foreground shrink-0 mt-2 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="border-t border-border/60 p-5 md:p-6 space-y-5 bg-secondary/20">
                  <Block label="Autori principali">
                    <div className="flex flex-wrap gap-2">
                      {f.authors.map((a) => (
                        <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-card border border-border/60">{a}</span>
                      ))}
                    </div>
                  </Block>

                  <Block label="Concetti chiave">
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {f.concepts.map((c) => (
                        <li key={c} className="text-sm text-foreground/85 flex gap-2">
                          <span className="size-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </Block>

                  <Block label="Quando viene utilizzato da Hu-Mind">
                    <p className="text-sm text-foreground/85 leading-relaxed">{f.usage}</p>
                  </Block>

                  <Block label="Limiti del framework">
                    <p className="text-sm text-foreground/75 leading-relaxed border-l-2 border-border pl-3">
                      {f.limits}
                    </p>
                  </Block>

                  <Block label="Fonti di riferimento">
                    <ul className="space-y-1">
                      {f.sources.map((s) => (
                        <li key={s} className="text-xs text-muted-foreground leading-relaxed">— {s}</li>
                      ))}
                    </ul>
                  </Block>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Disclaimer */}
      <div className="mt-12 rounded-2xl border border-border/60 bg-secondary/40 p-5 flex gap-3">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-foreground/75 leading-relaxed">
          Le osservazioni di Hu-Mind rappresentano ipotesi riflessive costruite a partire dal materiale
          condiviso dall'utente e da modelli psicologici riconosciuti. Non costituiscono diagnosi,
          valutazioni cliniche, pareri medici o psicoterapeutici. Hu-Mind supporta la riflessione
          personale e non sostituisce professionisti qualificati.
        </p>
      </div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
      {children}
    </div>
  );
}
