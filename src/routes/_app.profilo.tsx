import { createFileRoute } from "@tanstack/react-router";
import { Bell, Moon, Lock, Download, Sparkles, ChevronRight, Heart, Stethoscope, MessageCircle, BookMarked, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/profilo")({
  component: ProfiloPage,
});

function ProfiloPage() {
  return (
    <div className="px-6 md:px-12 py-10 max-w-4xl mx-auto pb-32">
      {/* Hero card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-card to-accent/30 border border-border/60 p-8 md:p-10 shadow-soft">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 size-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="size-24 rounded-3xl bg-primary text-primary-foreground grid place-items-center font-display text-4xl shadow-float">
            E
          </div>
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Profilo</div>
            <h1 className="font-display text-4xl mt-1">Elena Marchetti</h1>
            <p className="text-muted-foreground mt-2 max-w-md leading-relaxed">
              "Raccolgo pensieri che mi aiutano a capire chi sono, con calma e continuità."
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-card border border-border/60 text-sm hover:bg-muted transition">
            Modifica profilo
          </button>
        </div>
      </section>

      {/* Light stats — qualitative */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
        {[
          { k: "47", l: "giorni in cui ci siamo parlate" },
          { k: "142", l: "pensieri raccolti" },
          { k: "12", l: "fili intrecciati" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl bg-card border border-border/60 p-5 text-center shadow-soft">
            <div className="font-display text-3xl text-primary">{s.k}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
          </div>
        ))}
      </section>

      {/* Cose importanti da sapere di me */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">memoria condivisa</div>
            <h2 className="font-display text-2xl md:text-3xl">Cose importanti da sapere di me</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Quello che vuoi che Synapse tenga a mente quando parliamo. Cambia, cresce, si aggiorna con te.
            </p>
          </div>
          <button className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border/60 text-xs hover:bg-muted transition">
            <Plus className="size-3.5" /> Aggiungi
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {[
            { icon: Heart, label: "Persone", title: "Giulia, sorella minore", body: "È il mio punto di riferimento. La nomino spesso quando parlo di casa." },
            { icon: Heart, label: "Persone", title: "Marco", body: "Relazione finita a marzo. È ancora un tema vivo, trattalo con cura." },
            { icon: Stethoscope, label: "Diagnosi", title: "Disturbo d'ansia generalizzato", body: "In terapia da due anni. Lo gestisco bene, ma nei periodi di stress riemerge." },
            { icon: BookMarked, label: "La mia storia", title: "Sono cresciuta tra due lingue", body: "Italiano e tedesco. Spesso il modo in cui penso cambia con la lingua." },
            { icon: MessageCircle, label: "Come preferisco parlare", title: "Senza consigli non richiesti", body: "Mi aiuta di più quando fai domande, non quando proponi soluzioni." },
            { icon: MessageCircle, label: "Come preferisco parlare", title: "Tono morbido, mai clinico", body: "Le etichette psicologiche mi mettono a disagio. Preferisco parole umane." },
          ].map((item) => (
            <article key={item.title} className="group rounded-2xl bg-card border border-border/60 p-5 hover:shadow-soft hover:border-primary/40 transition">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                <item.icon className="size-3.5 text-primary" /> {item.label}
              </div>
              <div className="font-display text-lg leading-snug">{item.title}</div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.body}</p>
            </article>
          ))}
          <button className="rounded-2xl border border-dashed border-border/80 p-5 text-left text-sm text-muted-foreground hover:bg-muted/40 transition flex items-center gap-2">
            <Plus className="size-4" /> Aggiungi qualcosa che vuoi che ricordi
          </button>
        </div>
      </section>

      {/* Practice */}
      <section className="mt-10">
        <h2 className="font-display text-2xl mb-4">La tua pratica</h2>
        <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-medium">Rituale serale</div>
              <div className="text-xs text-muted-foreground mt-1">7 minuti, ogni sera alle 22:00</div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">attivo</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 30 }).map((_, i) => {
              const done = i < 22;
              const today = i === 22;
              return (
                <div
                  key={i}
                  className={`flex-1 h-10 rounded-md ${
                    today ? "bg-primary animate-pulse-soft" : done ? "bg-primary/60" : "bg-muted"
                  }`}
                  title={`Giorno ${i + 1}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
            <span>30 giorni fa</span><span>oggi</span>
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="mt-10">
        <h2 className="font-display text-2xl mb-4">Impostazioni</h2>
        <div className="rounded-2xl bg-card border border-border/60 divide-y divide-border/60 shadow-soft overflow-hidden">
          {[
            { icon: Bell, title: "Notifiche delicate", desc: "Un promemoria al giorno, mai più di uno." },
            { icon: Moon, title: "Modalità notte", desc: "Tonalità più calde dopo il tramonto." },
            { icon: Sparkles, title: "Voce di Synapse", desc: "Riflessiva · Calma · Curiosa" },
            { icon: Lock, title: "Privacy & cifratura", desc: "I tuoi pensieri restano tuoi, sempre." },
            { icon: Download, title: "Esporta i tuoi pensieri", desc: "Scarica tutti i pensieri in Markdown." },
          ].map((r) => (
            <button key={r.title} className="w-full text-left flex items-center gap-4 px-5 py-4 hover:bg-muted/60 transition">
              <div className="size-10 rounded-xl bg-secondary grid place-items-center">
                <r.icon className="size-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>

      <p className="text-center text-[11px] text-muted-foreground mt-12">
        Synapse · versione 0.1 · costruito con cura
      </p>
    </div>
  );
}
