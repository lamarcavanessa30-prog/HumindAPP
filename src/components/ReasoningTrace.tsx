import { useState } from "react";
import { ChevronDown, MessageCircle, BookOpen, Activity, Sparkles, Layers, ShieldAlert, BookMarked } from "lucide-react";

export type Confidence = "low" | "moderate" | "high" | "very-high";

export type ReasoningSource = {
  type: "chat" | "journal" | "theme" | "pattern" | "milestone" | "behavior";
  label: string;
  date?: string;
};

export type ReasoningEvidence = {
  count: number;
  distribution: string;
  continuity: string;
  recurrence: string;
};

export type ReasoningTraceData = {
  observation: string;
  sources: ReasoningSource[];
  evidence: ReasoningEvidence;
  frameworks: string[];
  confidence: Confidence;
  limits: string;
};

const CONFIDENCE_META: Record<Confidence, { label: string; tone: string; pct: number }> = {
  "low": { label: "Bassa", tone: "bg-muted text-muted-foreground border-border", pct: 25 },
  "moderate": { label: "Moderata", tone: "bg-dust/20 text-foreground border-dust/40", pct: 50 },
  "high": { label: "Alta", tone: "bg-primary/15 text-primary border-primary/30", pct: 75 },
  "very-high": { label: "Molto Alta", tone: "bg-primary/25 text-primary border-primary/40", pct: 95 },
};

const SOURCE_ICON: Record<ReasoningSource["type"], typeof MessageCircle> = {
  chat: MessageCircle,
  journal: BookOpen,
  theme: Layers,
  pattern: Activity,
  milestone: Sparkles,
  behavior: Activity,
};

const SOURCE_LABEL: Record<ReasoningSource["type"], string> = {
  chat: "Conversazione",
  journal: "Pensiero / Diario",
  theme: "Tema attivo",
  pattern: "Pattern osservato",
  milestone: "Pietra miliare",
  behavior: "Comportamento",
};

export function ReasoningTrace({ data }: { data: ReasoningTraceData }) {
  const [open, setOpen] = useState(false);
  const conf = CONFIDENCE_META[data.confidence];

  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-secondary/30">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/50 transition rounded-2xl"
      >
        <div className="size-8 rounded-lg bg-primary/10 grid place-items-center shrink-0">
          <BookMarked className="size-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground">Come siamo arrivati a questa osservazione?</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-widest ${conf.tone}`}>
              Affidabilità · {conf.label}
            </span>
            <span>·</span>
            <span>{data.frameworks.join(" + ")}</span>
            <span>·</span>
            <span>{data.evidence.count} evidenze</span>
          </div>
        </div>
        <ChevronDown className={`size-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-border/60 p-5 space-y-5">
          {/* Reasoning path */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Percorso del ragionamento</div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {["Conversazioni", "Temi", "Pattern", "Evidenze", "Framework", "Osservazione"].map((s, i, arr) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-card border border-border/60 text-foreground/80">{s}</span>
                  {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Osservazioni utilizzate</div>
            <ul className="space-y-2">
              {data.sources.map((s, i) => {
                const Icon = SOURCE_ICON[s.type];
                return (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="size-7 rounded-lg bg-card border border-border/60 grid place-items-center shrink-0">
                      <Icon className="size-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-foreground/90">{s.label}</div>
                      <div className="text-[11px] text-muted-foreground">{SOURCE_LABEL[s.type]}{s.date ? ` · ${s.date}` : ""}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Evidence */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Elementi di supporto</div>
            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              <EvidenceCell label="Quantità" value={`${data.evidence.count} elementi`} />
              <EvidenceCell label="Distribuzione temporale" value={data.evidence.distribution} />
              <EvidenceCell label="Continuità" value={data.evidence.continuity} />
              <EvidenceCell label="Ricorrenza" value={data.evidence.recurrence} />
            </div>
          </div>

          {/* Frameworks */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Framework utilizzati come lente</div>
            <div className="flex flex-wrap gap-2">
              {data.frameworks.map((f) => (
                <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{f}</span>
              ))}
            </div>
          </div>

          {/* Confidence detail */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Livello di affidabilità</div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sage to-sage-deep rounded-full transition-all" style={{ width: `${conf.pct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>Bassa</span><span>Moderata</span><span>Alta</span><span>Molto alta</span>
            </div>
          </div>

          {/* Limits */}
          <div className="rounded-xl border border-border/60 bg-card p-3 flex gap-3">
            <ShieldAlert className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Limiti dell'osservazione</div>
              <p className="text-xs text-foreground/75 leading-relaxed">{data.limits}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EvidenceCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-card border border-border/60 p-2.5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-foreground/85 mt-0.5">{value}</div>
    </div>
  );
}
