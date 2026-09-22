import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useThoughts } from "@/domain/ThoughtsProvider";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "HuMind — Uno spazio che impara a conoscerti" },
      { name: "description", content: "Uno spazio privato per conservare il filo dei pensieri e ritrovarlo nel tempo." },
      { property: "og:title", content: "HuMind — Uno spazio che impara a conoscerti" },
      { property: "og:description", content: "Pensieri, memoria e continuità, senza decidere al posto tuo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

const frameworks = [
  "CBT",
  "DBT",
  "ACT",
  "Teoria dell’attaccamento",
  "Approcci psicodinamici",
  "Trauma-informed",
  "ADHD e neurodivergenze informed",
  "Regolazione emotiva",
  "Approcci orientati alle risorse",
];

const modes = ["Ascolto", "Riflessione", "Esplorazione", "Autoanalisi", "Specchio"];

function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [leavingIntro, setLeavingIntro] = useState(false);
  const { thoughts } = useThoughts();
  const latestThought = thoughts[0];
  const today = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const enterHome = () => {
    setLeavingIntro(true);
    window.setTimeout(() => setShowIntro(false), 420);
  };

  return (
    <>
      {showIntro && <IntroScreen leaving={leavingIntro} onEnter={enterHome} />}

      <div className="home-place min-h-screen overflow-hidden pb-36 md:pb-24">
        <section className="mx-auto grid min-h-[88vh] max-w-[1120px] grid-cols-1 px-6 pb-16 pt-12 md:grid-cols-[minmax(0,1fr)_15rem] md:gap-16 md:px-14 md:pb-24 md:pt-20 lg:px-20">
          <div className="flex flex-col justify-center">
            <p className="home-reveal text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground capitalize">
              {today}
            </p>
            <p className="home-reveal home-delay-1 mt-10 text-sm text-primary">Bentornata.</p>
            <h1 className="home-reveal home-delay-2 mt-5 max-w-[760px] font-display text-[clamp(3.4rem,7vw,7rem)] leading-[0.94] text-foreground">
              Qui non devi arrivare con le parole giuste.
            </h1>
            <p className="home-reveal home-delay-3 mt-8 max-w-lg text-[15px] leading-7 text-muted-foreground md:text-base">
              Puoi cominciare da quello che c’è. Il resto può prendere forma mentre ne parliamo.
            </p>

            <div className="threshold-mark home-reveal home-delay-3 my-11" aria-hidden="true">
              <span />
            </div>

            <Link
              to="/chat"
              className="reflection-entry group home-reveal home-delay-4 flex min-h-36 w-full max-w-3xl items-center justify-between gap-6 px-6 py-7 md:min-h-44 md:px-10"
            >
              <span className="max-w-xl font-display text-2xl leading-tight text-foreground transition-colors duration-500 group-hover:text-primary md:text-4xl">
                Scrivi quello che c’è, anche se è confuso.
              </span>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 group-hover:translate-x-1 md:size-14">
                <ArrowRight className="size-5" strokeWidth={1.5} />
              </span>
            </Link>
          </div>

          <aside className="home-reveal home-delay-4 mt-16 flex items-end border-l border-border/70 pl-6 md:mt-0 md:pb-28">
            <p className="max-w-[12rem] font-display text-xl leading-snug text-foreground/65">
              “Non tutto va capito subito.”
            </p>
          </aside>
        </section>

        <section className="memory-field mx-auto max-w-[1120px] px-6 py-20 md:px-14 md:py-28 lg:px-20">
          <div className="grid gap-16 md:grid-cols-[minmax(0,1.35fr)_minmax(14rem,.65fr)] md:gap-24">
            <article>
              <p className="editorial-kicker">Una domanda è rimasta aperta</p>
              <h2 className="mt-6 max-w-2xl font-display text-4xl leading-[1.06] text-foreground md:text-6xl">
                Cosa ti restituisce energia quando il riposo non basta?
              </h2>
              <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground">
                È comparsa più di una volta, tra il desiderio di rallentare e la fatica di sentirti davvero ferma.
              </p>
              <Link to="/chat" className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-primary hover:opacity-70">
                Riprendila da qui <ArrowRight className="size-4" />
              </Link>
            </article>

            <div className="space-y-16 md:pt-2">
              <article className="editorial-note">
                <p className="editorial-kicker">L’ultimo ritorno</p>
                <p className="mt-4 font-display text-2xl leading-snug text-foreground/85">
                  {latestThought?.text ?? "Hai lasciato spazio a una domanda senza cercare subito una risposta."}
                </p>
                <Link to="/diario" className="mt-5 inline-flex text-xs font-medium text-muted-foreground hover:text-primary">
                  Ritrova il filo nel Diario
                </Link>
              </article>

              <article className="editorial-note">
                <p className="editorial-kicker">Qualcosa torna</p>
                <p className="mt-4 text-base leading-7 text-foreground/80">
                  Il bisogno di proteggere il tuo tempo, prima che diventi soltanto tempo da recuperare.
                </p>
                <Link to="/insight" className="mt-5 inline-flex text-xs font-medium text-muted-foreground hover:text-primary">
                  Guarda cosa sta prendendo forma
                </Link>
              </article>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function IntroScreen({ leaving, onEnter }: { leaving: boolean; onEnter: () => void }) {
  return (
    <div className={`intro-night fixed inset-0 z-[100] overflow-y-auto text-intro-foreground ${leaving ? "intro-leaving" : ""}`}>
      <div className="intro-stars" aria-hidden="true" />
      <header className="relative z-10 mx-auto flex max-w-[1180px] items-center justify-between px-6 py-7 md:px-12">
        <span className="font-display text-2xl">HuMind</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-intro-muted">Demo concept</span>
      </header>

      <main className="relative z-10 mx-auto max-w-[1180px] px-6 pb-20 md:px-12">
        <section className="grid min-h-[76vh] content-center gap-12 py-16 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-intro-accent">Memoria · continuità · comprensione</p>
            <h1 className="mt-7 font-display text-[clamp(5rem,12vw,10rem)] leading-[0.82]">HuMind</h1>
            <p className="mt-9 max-w-2xl font-display text-3xl leading-tight text-intro-soft md:text-5xl">
              Uno spazio che impara a conoscerti nel tempo.
            </p>
          </div>
          <div className="flex items-end border-l border-intro-line pl-6">
            <p className="text-sm leading-7 text-intro-muted">
              Non una diagnosi. Non una voce che decide per te. Un luogo dove il filo non si perde.
            </p>
          </div>
        </section>

        <div className="intro-thread" aria-hidden="true"><span /></div>

        <section className="intro-section grid gap-12 py-24 md:grid-cols-[14rem_minmax(0,1fr)]">
          <p className="intro-number">01 — Si adatta</p>
          <div>
            <h2 className="intro-heading">La conversazione non deve avere sempre la stessa profondità.</h2>
            <p className="intro-copy">HuMind può cambiare ritmo, tono e tipo di domanda. Sei tu a scegliere fin dove andare.</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-4">
              {modes.map((mode, index) => (
                <span key={mode} className="flex items-center gap-3 text-xs text-intro-soft">
                  {mode}{index < modes.length - 1 && <ArrowRight className="size-3 text-intro-accent" />}
                </span>
              ))}
            </div>
            <p className="mt-5 text-xs text-intro-muted">Modalità Automatica disponibile, sempre modificabile.</p>
          </div>
        </section>

        <section className="intro-section grid gap-12 py-24 md:grid-cols-[14rem_minmax(0,1fr)]">
          <p className="intro-number">02 — Crea continuità</p>
          <div>
            <h2 className="intro-heading">Tra un incontro e l’altro succedono molte cose.</h2>
            <blockquote className="mt-9 max-w-3xl font-display text-3xl leading-snug text-intro-soft md:text-5xl">
              “Quando arriva il momento di raccontarle, spesso una parte è già andata persa.”
            </blockquote>
            <p className="intro-copy">Con il tuo consenso, HuMind conserva pensieri, conversazioni e temi che ritornano. Non per sorvegliarti: per aiutarti a non perderne il filo.</p>
          </div>
        </section>

        <section className="intro-section grid gap-12 py-24 md:grid-cols-[14rem_minmax(0,1fr)]">
          <p className="intro-number">03 — Le fondamenta</p>
          <div>
            <h2 className="intro-heading">Non parte dal nulla.</h2>
            <p className="intro-copy">Usa principi e strumenti come lenti per organizzare riflessioni, domande e restituzioni. Non finge di svolgere psicoterapia.</p>
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-intro-line pt-8 md:grid-cols-3">
              {frameworks.map((framework) => <span key={framework} className="text-sm text-intro-soft">{framework}</span>)}
            </div>
          </div>
        </section>

        <section className="intro-section grid gap-12 py-24 md:grid-cols-[14rem_minmax(0,1fr)]">
          <p className="intro-number">04 — Il ponte</p>
          <div>
            <h2 className="intro-heading">Non al posto della terapia. Tra un incontro e l’altro.</h2>
            <p className="intro-copy">Può aiutarti a ricordare eventi, conservare domande, osservare ciò che torna e preparare ciò che vuoi portare in seduta.</p>
            <ul className="mt-9 grid gap-4 sm:grid-cols-2">
              {["Ricordare eventi e pensieri", "Conservare domande aperte", "Preparare una sintesi personale", "Condividere una sintesi solo se lo scegli"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-intro-soft"><Check className="mt-0.5 size-4 shrink-0 text-intro-accent" />{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="intro-section grid gap-12 py-24 md:grid-cols-[14rem_minmax(0,1fr)]">
          <p className="intro-number">05 — I limiti</p>
          <div>
            <h2 className="intro-heading">Il controllo resta tuo.</h2>
            <div className="mt-9 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {["Non diagnostica e non prescrive", "Non sostituisce professionisti o servizi sanitari", "Puoi correggere o rifiutare ogni restituzione", "La memoria resta sotto il tuo controllo", "Nulla viene condiviso senza una tua scelta", "Rischio, privacy e consenso richiedono limiti specifici"].map((item) => (
                <p key={item} className="border-t border-intro-line pt-4 text-sm leading-6 text-intro-soft">{item}</p>
              ))}
            </div>
            <p className="mt-12 max-w-2xl text-xs leading-6 text-intro-muted">Questa è una demo/concept. Un prodotto reale richiederebbe revisione clinica, safety, privacy e legale.</p>
          </div>
        </section>

        <section className="flex min-h-[55vh] flex-col items-center justify-center py-24 text-center">
          <p className="font-display text-4xl text-intro-soft md:text-6xl">Il tuo spazio è qui.</p>
          <button onClick={onEnter} className="intro-enter group mt-10 inline-flex items-center gap-6 rounded-full px-7 py-4 text-sm font-medium">
            Entra in HuMind <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
          <ChevronDown className="mt-12 size-4 animate-threshold text-intro-muted" />
        </section>
      </main>
    </div>
  );
}