import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Search, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_app/diario")({
  component: DiarioPage,
});

const entries = [
  {
    date: "Giovedì 11 giugno",
    day: "11",
    items: [
      { tag: "Riflessione", time: "08:14", text: "Mi sveglio con l'idea che la lentezza non sia un ritmo, ma una forma di ascolto. Forse è così che si impara a leggere il giorno.", links: ["Lentezza", "Attenzione"] },
      { tag: "Lettura", time: "09:32", text: "«Camminare è il modo in cui il corpo pensa.» Rebecca Solnit, Wanderlust. Sottolineo e respiro.", links: ["Camminare"] },
    ],
  },
  {
    date: "Mercoledì 10 giugno",
    day: "10",
    items: [
      { tag: "Idea", time: "22:01", text: "E se progettassi un rituale serale di sette minuti, senza schermo, solo carta e respiro?", links: ["Rituali serali", "Scrittura a mano"] },
      { tag: "Sogno", time: "06:48", text: "Sognavo una biblioteca infinita, con i libri che si scrivevano da soli mentre li sfogliavo.", links: ["Memoria"] },
    ],
  },
  {
    date: "Lunedì 8 giugno",
    day: "08",
    items: [
      { tag: "Emozione", time: "19:20", text: "Una gratitudine improvvisa, davanti alla finestra. Senza ragione, e quindi pura.", links: ["Silenzio"] },
    ],
  },
];

function DiarioPage() {
  const [view, setView] = useState<"timeline" | "calendar">("timeline");

  return (
    <div className="px-6 md:px-12 py-8 max-w-5xl mx-auto pb-32">
      <header className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Diario</div>
          <h1 className="font-display text-4xl md:text-5xl mt-2">La cronaca dei tuoi pensieri</h1>
          <p className="text-muted-foreground mt-2">142 pensieri · 47 giorni di pratica · 12 costellazioni attive</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Cerca…" className="bg-card border border-border/60 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30 w-56" />
          </div>
          <div className="flex rounded-lg bg-card border border-border/60 p-0.5">
            <button onClick={() => setView("timeline")} className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 ${view === "timeline" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <BookOpen className="size-4" /> Timeline
            </button>
            <button onClick={() => setView("calendar")} className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 ${view === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <Calendar className="size-4" /> Calendario
            </button>
          </div>
        </div>
      </header>

      {view === "timeline" ? (
        <div className="relative">
          <div className="absolute left-[14px] md:left-[28px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-10">
            {entries.map((group) => (
              <section key={group.date} className="relative pl-12 md:pl-20">
                <div className="absolute left-0 top-0 flex flex-col items-center">
                  <div className="size-8 md:size-14 rounded-full bg-primary text-primary-foreground grid place-items-center font-display text-sm md:text-lg shadow-soft">
                    {group.day}
                  </div>
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{group.date}</div>
                <div className="space-y-3">
                  {group.items.map((it, i) => (
                    <article key={i} className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft hover:shadow-float transition-all">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                        <span className="size-1.5 rounded-full bg-primary" />
                        {it.tag} · {it.time}
                      </div>
                      <p className="font-display text-xl leading-relaxed">{it.text}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {it.links.map((l) => (
                          <span key={l} className="text-xs px-3 py-1 rounded-full bg-secondary/70 text-secondary-foreground border border-border/60">
                            ↳ {l}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {["L", "M", "M", "G", "V", "S", "D"].map((d, i) => (
            <div key={i} className="text-center text-[11px] uppercase tracking-widest text-muted-foreground py-2">{d}</div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 2;
            const has = [3, 5, 6, 8, 10, 11, 13, 15, 18, 21, 22, 24].includes(day);
            const today = day === 11;
            return (
              <div
                key={i}
                className={`aspect-square rounded-xl border p-2 flex flex-col justify-between ${
                  today ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60"
                } ${day < 1 || day > 30 ? "opacity-30" : ""}`}
              >
                <div className="text-xs">{day >= 1 && day <= 30 ? day : ""}</div>
                {has && day >= 1 && day <= 30 && (
                  <div className="flex gap-1">
                    <span className={`size-1.5 rounded-full ${today ? "bg-primary-foreground" : "bg-primary"}`} />
                    <span className={`size-1.5 rounded-full ${today ? "bg-primary-foreground/60" : "bg-accent"}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
