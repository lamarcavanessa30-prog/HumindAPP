import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Layers, Filter } from "lucide-react";

export const Route = createFileRoute("/_app/mappa")({
  component: MapPage,
});

type Node = { id: string; label: string; x: number; y: number; r: number; cluster: "sage" | "dust" | "anthracite" };
type Edge = [string, string];

const nodes: Node[] = [
  { id: "a", label: "Lentezza", x: 50, y: 45, r: 26, cluster: "sage" },
  { id: "b", label: "Attenzione", x: 32, y: 30, r: 20, cluster: "sage" },
  { id: "c", label: "Calvino", x: 22, y: 55, r: 16, cluster: "sage" },
  { id: "d", label: "Leggerezza", x: 38, y: 68, r: 18, cluster: "sage" },
  { id: "e", label: "Rituali serali", x: 68, y: 32, r: 22, cluster: "dust" },
  { id: "f", label: "Scrittura a mano", x: 82, y: 22, r: 14, cluster: "dust" },
  { id: "g", label: "Camminare", x: 75, y: 58, r: 18, cluster: "dust" },
  { id: "h", label: "Memoria", x: 60, y: 80, r: 16, cluster: "anthracite" },
  { id: "i", label: "Creatività", x: 48, y: 88, r: 20, cluster: "anthracite" },
  { id: "j", label: "Silenzio", x: 14, y: 80, r: 14, cluster: "sage" },
];

const edges: Edge[] = [
  ["a", "b"], ["a", "c"], ["a", "d"], ["b", "e"], ["c", "d"], ["d", "i"],
  ["e", "f"], ["e", "g"], ["g", "h"], ["h", "i"], ["b", "g"], ["c", "j"], ["d", "j"], ["a", "e"],
];

const colorFor = (c: Node["cluster"]) => c === "sage" ? "var(--sage-deep)" : c === "dust" ? "var(--dust)" : "var(--anthracite)";

function MapPage() {
  const [hover, setHover] = useState<string | null>(null);
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), []);

  return (
    <div className="h-screen flex flex-col">
      <div className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-border/60 glass">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Mappa</div>
          <h1 className="font-display text-2xl mt-1">Albero delle connessioni</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-card border border-border/60 hover:bg-muted">
            <Filter className="size-4" /> Filtra
          </button>
          <button className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-card border border-border/60 hover:bg-muted">
            <Layers className="size-4" /> Livelli
          </button>
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Cerca un nodo…" className="bg-card border border-border/60 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30 w-56" />
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--sage-deep)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--sage-deep)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#halo)" />

          {edges.map(([a, b], i) => {
            const A = byId[a], B = byId[b];
            const active = hover === a || hover === b;
            return (
              <line
                key={i}
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke={active ? "var(--sage-deep)" : "var(--border)"}
                strokeWidth={active ? 0.4 : 0.2}
                strokeLinecap="round"
                opacity={hover && !active ? 0.2 : 0.7}
                style={{ transition: "all 200ms ease" }}
              />
            );
          })}

          {nodes.map((n) => {
            const active = hover === n.id;
            return (
              <g key={n.id} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
                <circle cx={n.x} cy={n.y} r={n.r / 8 + 1.5} fill={colorFor(n.cluster)} opacity={0.18} />
                <circle
                  cx={n.x} cy={n.y} r={n.r / 10 + 0.8}
                  fill={colorFor(n.cluster)}
                  opacity={hover && !active ? 0.4 : 1}
                  style={{ transition: "all 200ms ease" }}
                />
                <text
                  x={n.x} y={n.y + n.r / 10 + 2.4}
                  textAnchor="middle"
                  fontSize="1.6"
                  fontFamily="Fraunces, serif"
                  fill="var(--anthracite)"
                  opacity={hover && !active ? 0.4 : 0.9}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-24 md:bottom-8 left-8 glass rounded-2xl p-4 shadow-soft text-xs space-y-2">
          <div className="uppercase tracking-widest text-[10px] text-muted-foreground mb-2">Temi attivi</div>
          {[
            { c: "var(--sage-deep)", l: "Architettura interiore", n: 24 },
            { c: "var(--dust)", l: "Rituali quotidiani", n: 11 },
            { c: "var(--anthracite)", l: "Memoria & creatività", n: 17 },
          ].map((x) => (
            <div key={x.l} className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: x.c }} />
              <span>{x.l}</span>
              <span className="text-muted-foreground ml-auto pl-4">{x.n}</span>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="absolute top-6 right-6 w-72 glass rounded-2xl p-5 shadow-soft hidden md:block">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Nodo selezionato</div>
          <div className="font-display text-2xl mt-1">{hover ? byId[hover].label : "Lentezza"}</div>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Un tema che collega 14 pensieri e 6 altri argomenti. Si è definito ad aprile, dopo una lunga riflessione.
          </p>
          <div className="mt-4 pt-4 border-t border-border/60 flex justify-between text-xs text-muted-foreground">
            <span>14 nodi</span><span>6 connessioni</span><span>aprile 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
