import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, HelpCircle } from "lucide-react";
import { createOnboardingState, shouldShowOptionalOnboardingCard } from "@/domain/onboardingState";
import { useThoughts } from "@/domain/ThoughtsProvider";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

const emergingThemes = [
  "Architettura interiore",
  "Letture lente",
  "Rituali che restituiscono energia",
];

const livingQuestion = {
  text: "Cosa ti restituisce energia quando il riposo non basta?",
  context: "Questa domanda nasce dai temi che stanno tornando più spesso nella tua storia.",
};

function HomePage() {
  const { thoughts } = useThoughts();
  const recent = thoughts.slice(0, 3);
  const onboardingState = createOnboardingState();
  const showOptionalOnboarding = shouldShowOptionalOnboardingCard(onboardingState);
  const today = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto pb-32">
      {/* Hero */}
      <section className="pt-6 md:pt-10 pb-10 md:pb-16 text-center">
        <div className="text-xs md:text-sm text-muted-foreground mb-5 tracking-wide capitalize">{today}</div>
        <h1 className="font-display text-3xl md:text-5xl leading-[1.1] text-foreground max-w-2xl mx-auto">
          Cosa ti passa per la testa oggi?
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-sm text-muted-foreground/70 leading-relaxed">
          Ogni pensiero può aiutare a comprendere meglio la tua storia.
        </p>
        <Link
          to="/chat"
          className="group block w-full max-w-2xl mx-auto mt-6 rounded-3xl border border-border/30 bg-card/70 backdrop-blur-sm p-7 md:p-10 shadow-soft transition-all duration-300 ease-out hover:bg-card hover:border-border/50 hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="font-display text-xl md:text-2xl text-muted-foreground/80 group-hover:text-foreground/70 transition-colors duration-300 leading-relaxed">
            Scrivi un pensiero...
          </span>
        </Link>
      </section>

      {showOptionalOnboarding && (
        <section className="mb-16 rounded-3xl border border-border/60 bg-card/70 p-5 md:p-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                profilo opzionale
              </div>
              <h2 className="mt-1 font-display text-2xl text-foreground">
                Puoi completarlo quando vuoi.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Hu-Mind funziona anche senza configurazione iniziale. Il profilo potra aiutare, piu avanti, a rendere la tua memoria narrativa piu ordinata.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/profilo"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90 transition"
              >
                Vai al profilo
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center justify-center rounded-xl border border-border/60 bg-background px-4 py-2 text-sm text-foreground hover:bg-muted transition"
              >
                Inizia a scrivere
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Domanda Viva — cuore della Home */}
      <section className="mb-16">
        <div className="text-center mb-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">domanda viva</div>
        </div>
        <article className="relative overflow-hidden rounded-[2rem] p-8 md:p-12 bg-gradient-to-br from-card via-secondary/40 to-accent/30 border border-border/60 shadow-soft">
          <div className="absolute -top-24 -right-20 size-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 size-64 rounded-full bg-dust/20 blur-3xl" />
          <div className="relative max-w-2xl mx-auto text-center">
            <HelpCircle className="size-5 text-primary mx-auto mb-6 opacity-80" />
            <p className="font-display text-2xl md:text-4xl leading-snug text-foreground">
              {livingQuestion.text}
            </p>
            <p className="mt-6 text-sm text-muted-foreground italic max-w-md mx-auto leading-relaxed">
              {livingQuestion.context}
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 mt-8 text-sm text-primary hover:opacity-80 transition"
            >
              Esplora questa domanda
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </article>
      </section>

      {/* Ultimi pensieri */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-xl md:text-2xl text-foreground/90">Ultimi pensieri</h2>
          <Link to="/diario" className="text-xs text-muted-foreground hover:text-primary transition">
            Apri il diario →
          </Link>
        </div>
        <div className="divide-y divide-border/50">
          {recent.length > 0 ? (
            recent.map((thought) => (
            <article key={thought.id} className="py-6 first:pt-0 last:pb-0 group">
              <p className="font-display text-lg leading-relaxed text-foreground/90">{thought.text}</p>
              <div className="mt-3 text-xs text-muted-foreground/70">{formatThoughtTime(thought.createdAt)}</div>
            </article>
            ))
          ) : (
            <div className="py-8 text-sm text-muted-foreground">
              Nessun pensiero ancora conservato. Usa “Cattura un pensiero” per iniziare la tua memoria narrativa.
            </div>
          )}
        </div>
      </section>

      {/* Temi che stanno emergendo */}
      <section>
        <h2 className="font-display text-xl md:text-2xl text-foreground/90 mb-6">Temi che stanno emergendo</h2>
        <ul className="space-y-3">
          {emergingThemes.map((t) => (
            <li key={t} className="flex items-center gap-3 text-foreground/80">
              <span className="size-1.5 rounded-full bg-primary/60" />
              <span className="font-display text-lg">{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-muted-foreground italic">
          Nuovi temi emergono lentamente, mentre continui a parlarne.
        </p>
      </section>
    </div>
  );
}

function formatThoughtTime(createdAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));
}
