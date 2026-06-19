import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, MessageCircle, Network, Sparkles, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

const recent = [
  { tag: "Riflessione", text: "Forse la creatività è solo memoria che impara a danzare.", time: "2 ore fa", color: "bg-secondary" },
  { tag: "Lettura", text: "«Camminare è il modo in cui il corpo pensa.» — Rebecca Solnit", time: "Ieri", color: "bg-accent/40" },
  { tag: "Idea", text: "Progettare un rituale di scrittura serale, 7 minuti, senza schermo.", time: "Ieri", color: "bg-muted" },
];

const activeThemes = [
  { name: "Architettura interiore", count: 24, hue: "from-sage to-sage-deep" },
  { name: "Letture lente", count: 17, hue: "from-dust to-sage" },
  { name: "Rituali quotidiani", count: 11, hue: "from-anthracite to-sage-deep" },
];

const livingQuestion = {
  text: "Cosa ti restituisce energia quando il riposo non basta?",
  context: "Questa domanda emerge dai temi più ricorrenti delle ultime settimane.",
};

const pastQuestions = [
  { theme: "Solitudine", text: "Come cambia il tuo umore quando ti senti sola.", status: "esplorata la scorsa settimana" },
  { theme: "Confini", text: "Cosa rende sostenibili i tuoi confini con gli altri.", status: "tornata due volte" },
  { theme: "Silenzi", text: "Perché alcuni silenzi pesano più di altri.", status: "emersa a maggio" },
];

function HomePage() {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto pb-32">
      {/* Primary CTA */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-secondary via-card to-accent/30 p-8 md:p-12 mb-12 shadow-soft">
        <div className="absolute -top-24 -right-16 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 size-72 rounded-full bg-dust/30 blur-3xl" />
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="text-sm text-muted-foreground mb-4">Giovedì, 11 Giugno</div>
          <h1 className="font-display text-3xl md:text-5xl leading-[1.05] text-foreground">
            Cosa ti passa per la testa oggi?
          </h1>
          <Link to="/chat" className="inline-block mt-4 text-xl md:text-2xl text-primary hover:opacity-80 transition">
            Parliamone.
          </Link>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border/60 text-sm hover:bg-muted transition">
              Scrivi un pensiero
            </button>
          </div>
        </div>
      </section>

      {/* Light stats — qualitative, no scores */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
        {[
          { k: "142", l: "pensieri raccolti" },
          { k: "23", l: "fili che si stanno intrecciando" },
          { k: "47", l: "giorni in cui ci siamo parlate" },
        ].map((s) => (
          <div key={s.l} className="glass rounded-2xl p-5 shadow-soft">
            <div className="font-display text-3xl">{s.k}</div>
            <div className="text-sm text-foreground/70 mt-1">{s.l}</div>
          </div>
        ))}
      </section>

      {/* Domanda viva */}
      <section className="mb-12">
        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">domanda viva</div>
          <h2 className="font-display text-2xl md:text-3xl">Una domanda che emerge dalla tua storia</h2>
        </div>
        <article className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-card via-secondary/40 to-accent/30 border border-border/60 shadow-soft">
          <div className="absolute -top-20 -right-16 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <HelpCircle className="size-5 text-primary mb-5" />
            <p className="font-display text-2xl md:text-4xl leading-snug text-foreground">
              {livingQuestion.text}
            </p>
            <p className="mt-6 text-sm text-muted-foreground italic max-w-xl">
              {livingQuestion.context}
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 mt-8 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm hover:opacity-90 transition"
            >
              Esplora questa domanda
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </article>
      </section>

      {/* Archivio delle domande — tracce precedenti del percorso */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">tracce del percorso</div>
            <h2 className="font-display text-lg text-muted-foreground">Domande emerse nel tempo</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-2">
          {pastQuestions.map((q) => (
            <article key={q.text} className="group rounded-xl p-3 bg-secondary/30 border border-border/40 hover:border-primary/30 transition">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                <HelpCircle className="size-3 text-primary/70" /> {q.theme}
              </div>
              <p className="text-sm leading-snug text-foreground/80">{q.text}</p>
              <div className="mt-2 text-[10px] text-muted-foreground italic">{q.status}</div>
            </article>
          ))}
        </div>
      </section>


      {/* Quick lanes */}
      <section className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          { to: "/chat", icon: MessageCircle, title: "Dialoga", desc: "Apri una conversazione con il tuo sé pensante." },
          { to: "/mappa", icon: Network, title: "Esplora la mappa", desc: "Vedi come le idee si intrecciano nel tempo." },
          { to: "/diario", icon: BookOpen, title: "Apri il diario", desc: "Sfoglia i tuoi pensieri, giorno per giorno." },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="group relative overflow-hidden rounded-2xl p-6 bg-card border border-border/60 shadow-soft hover:shadow-float hover:-translate-y-0.5 transition-all">
            <c.icon className="size-5 text-primary mb-8" />
            <div className="font-display text-2xl">{c.title}</div>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{c.desc}</p>
            <ArrowUpRight className="size-4 absolute top-6 right-6 text-muted-foreground group-hover:text-primary group-hover:rotate-12 transition" />
          </Link>
        ))}
      </section>

      {/* Two columns */}
      <div className="grid md:grid-cols-5 gap-6">
        <section className="md:col-span-3">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-2xl">Pensieri recenti</h2>
            <Link to="/diario" className="text-xs text-muted-foreground hover:text-primary">Tutti →</Link>
          </div>
          <div className="space-y-3">
            {recent.map((r, i) => (
              <article key={i} className={`group rounded-2xl p-5 border border-border/60 ${r.color} hover:shadow-soft transition`}>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {r.tag} · {r.time}
                </div>
                <p className="font-display text-lg leading-snug">{r.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="md:col-span-2">
          <h2 className="font-display text-2xl mb-4">Temi attivi</h2>
          <div className="space-y-3">
            {activeThemes.map((c) => (
              <div key={c.name} className="rounded-2xl p-5 bg-card border border-border/60 shadow-soft">
                <div className={`size-10 rounded-xl bg-gradient-to-br ${c.hue} mb-3 shadow-soft`} />
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.count} connessioni trovate</div>
              </div>
            ))}
            <div className="rounded-2xl p-5 border border-dashed border-border bg-transparent text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="size-4" /> Nuovi temi emergono con il tempo.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
