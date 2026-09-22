import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, MoonStar } from "lucide-react";

export const Route = createFileRoute("/_app/dream-lab")({
  head: () => ({
    meta: [
      { title: "Dream Lab — HuMind" },
      { name: "description", content: "Una preview dell’esplorazione futura del materiale onirico in HuMind." },
      { property: "og:title", content: "Dream Lab — HuMind" },
      { property: "og:description", content: "Esplorare i sogni senza decidere al posto tuo cosa significano." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DreamLabPage,
});

const lenses = ["Associazione libera", "Psicodinamica", "Relazionale", "Emotiva", "Trauma-informed", "Libera"];

function DreamLabPage() {
  return (
    <div className="dream-preview min-h-screen px-6 pb-28 pt-10 md:px-14 md:py-16 lg:px-20">
      <div className="mx-auto max-w-[1040px]">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Torna alla Home
        </Link>

        <header className="mt-16 grid gap-12 md:grid-cols-[minmax(0,1fr)_15rem] md:items-end">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-primary">
              <MoonStar className="size-4" /> Work in progress
            </div>
            <h1 className="mt-7 max-w-3xl font-display text-[clamp(4rem,9vw,8rem)] leading-[0.88]">Dream Lab</h1>
            <p className="mt-9 max-w-2xl font-display text-3xl leading-tight text-foreground/75 md:text-5xl">
              Conserviamo anche ciò che la mente racconta mentre dormi.
            </p>
          </div>
          <p className="border-l border-border pl-6 text-sm leading-7 text-muted-foreground">
            Una futura area di esplorazione, non un dizionario dei simboli.
          </p>
        </header>

        <div className="threshold-mark my-20" aria-hidden="true"><span /></div>

        <section className="grid gap-14 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="editorial-kicker">Il principio</p>
            <h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">Esplorare senza decidere al posto tuo.</h2>
          </div>
          <div className="space-y-7 text-base leading-8 text-muted-foreground">
            <p>Dream Lab non attribuisce significati universali ai simboli. Un’immagine diventa un invito a fare associazioni, non una risposta pronta.</p>
            <p className="font-display text-3xl leading-snug text-foreground">“Questa immagine torna. Cosa rappresenta per te?”</p>
            <p>In futuro potrà collegare sogni, immagini, persone, luoghi, emozioni e vita da sveglia al resto della tua storia.</p>
          </div>
        </section>

        <section className="mt-28 grid gap-12 border-t border-border pt-14 md:grid-cols-[14rem_1fr]">
          <p className="editorial-kicker">Possibili lenti</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lenses.map((lens) => <div key={lens} className="py-4 font-display text-2xl text-foreground/80">{lens}</div>)}
          </div>
        </section>

        <section className="mt-24 bg-secondary/45 px-6 py-10 md:px-10">
          <p className="editorial-kicker">Confini chiari</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {["Non diagnostica attraverso i sogni", "Non presenta un sogno come prova di trauma, desiderio o ricordo", "Non pretende di recuperare ricordi repressi", "Ogni interpretazione resta un’ipotesi rifiutabile"].map((item) => (
              <p key={item} className="flex items-start gap-3 text-sm leading-6"><Check className="mt-1 size-4 shrink-0 text-primary" />{item}</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}