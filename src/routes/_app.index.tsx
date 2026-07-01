import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

const recent = [
  { text: "Forse la creatività è solo memoria che impara a danzare.", time: "2 ore fa" },
  { text: "«Camminare è il modo in cui il corpo pensa.» — Rebecca Solnit", time: "Ieri" },
  { text: "Progettare un rituale di scrittura serale, sette minuti, senza schermo.", time: "Ieri" },
];

const emergingThemes = [
  "Architettura interiore",
  "Letture lente",
  "Rituali che restituiscono energia",
];

const livingQuestion = {
  text: "Cosa ti restituisce energia quando il riposo non basta?",
  context: "Questa domanda emerge dai temi più ricorrenti delle ultime settimane.",
};

function HomePage() {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto pb-32">
      {/* Hero */}
      <section className="pt-8 md:pt-16 pb-16 md:pb-24 text-center">
        <div className="text-xs md:text-sm text-muted-foreground mb-6 tracking-wide">Giovedì, 11 Giugno</div>
        <h1 className="font-display text-3xl md:text-5xl leading-[1.1] text-foreground max-w-2xl mx-auto">
          Cosa ti passa per la testa oggi?
        </h1>
        <div className="mt-10 flex flex-wrap justify-center items-center gap-3">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm shadow-soft hover:opacity-90 transition"
          >
            Parliamone
          </Link>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border/60 text-sm hover:bg-muted transition">
            Scrivi un pensiero
          </button>
        </div>
      </section>

      {/* Domanda Viva — cuore della Home */}
      <section className="mb-20">
        <div className="text-center mb-6">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">domanda viva</div>
        </div>
        <article className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 bg-gradient-to-br from-card via-secondary/40 to-accent/30 border border-border/60 shadow-soft">
          <div className="absolute -top-24 -right-20 size-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 size-64 rounded-full bg-dust/20 blur-3xl" />
          <div className="relative max-w-2xl mx-auto text-center">
            <HelpCircle className="size-5 text-primary mx-auto mb-8 opacity-80" />
            <p className="font-display text-2xl md:text-4xl leading-snug text-foreground">
              {livingQuestion.text}
            </p>
            <p className="mt-8 text-sm text-muted-foreground italic max-w-md mx-auto leading-relaxed">
              {livingQuestion.context}
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 mt-10 text-sm text-primary hover:opacity-80 transition"
            >
              Esplora questa domanda
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </article>
      </section>

      {/* Ultimi pensieri */}
      <section className="mb-20">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-xl md:text-2xl text-foreground/90">Ultimi pensieri</h2>
          <Link to="/diario" className="text-xs text-muted-foreground hover:text-primary transition">
            Apri il diario →
          </Link>
        </div>
        <div className="divide-y divide-border/50">
          {recent.map((r, i) => (
            <article key={i} className="py-5 first:pt-0 last:pb-0 group">
              <p className="font-display text-lg leading-snug text-foreground/90">{r.text}</p>
              <div className="mt-2 text-xs text-muted-foreground">{r.time}</div>
            </article>
          ))}
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
