import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  LineChart as LineChartIcon,
  Activity,
  Layers,
  Compass,
  TrendingUp,
  FileText,
  Download,
  Share2,
  Printer,
  Info,
  Heart,
  Shield,
  Brain,
  Sparkles,
  Users,
  Target,
  Wind,
  Flame,
  Sprout,
  CheckCircle2,
  ArrowRight,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_app/insight")({
  component: InsightPage,
});

type TabId = "overview" | "patterns" | "awareness" | "growth" | "reports";

const TABS: { id: TabId; label: string; icon: typeof LineChartIcon; hint: string }[] = [
  { id: "overview", label: "Panoramica", icon: Activity, hint: "Tendenze emotive nel tempo" },
  { id: "patterns", label: "Pattern", icon: Layers, hint: "Schemi ricorrenti" },
  { id: "awareness", label: "Mappa di sé", icon: Compass, hint: "Aree di consapevolezza" },
  { id: "growth", label: "Percorso", icon: TrendingUp, hint: "La tua evoluzione" },
  { id: "reports", label: "Report", icon: FileText, hint: "Sintesi da scaricare" },
];

// ——— Mock data ———
const emotionalTrend = [
  { d: "Lun", calma: 62, energia: 48, tensione: 30 },
  { d: "Mar", calma: 58, energia: 55, tensione: 36 },
  { d: "Mer", calma: 70, energia: 52, tensione: 22 },
  { d: "Gio", calma: 65, energia: 60, tensione: 28 },
  { d: "Ven", calma: 72, energia: 64, tensione: 24 },
  { d: "Sab", calma: 80, energia: 58, tensione: 18 },
  { d: "Dom", calma: 76, energia: 50, tensione: 20 },
];

const moodFluctuation = [
  { d: "S1", umore: 58 },
  { d: "S2", umore: 62 },
  { d: "S3", umore: 54 },
  { d: "S4", umore: 70 },
  { d: "S5", umore: 66 },
  { d: "S6", umore: 74 },
  { d: "S7", umore: 71 },
  { d: "S8", umore: 78 },
];

const topThemes = [
  { name: "Confini personali", value: 24 },
  { name: "Lavoro & senso", value: 19 },
  { name: "Relazioni vicine", value: 17 },
  { name: "Solitudine", value: 12 },
  { name: "Sonno & energia", value: 9 },
];

const strengths = [
  { label: "Auto-riflessione", value: 84 },
  { label: "Curiosità", value: 78 },
  { label: "Cura per gli altri", value: 73 },
  { label: "Costanza", value: 66 },
];

const difficulties = [
  { label: "Tolleranza all'incertezza", value: 42 },
  { label: "Riposo senza colpa", value: 48 },
  { label: "Chiedere aiuto", value: 38 },
];

const awarenessAreas = [
  { key: "Regolazione emotiva", value: 68, icon: Wind, desc: "Riesci spesso a riconoscere un'emozione prima di reagire. Le serate restano un momento più delicato." },
  { key: "Autostima", value: 61, icon: Heart, desc: "Tendi a riconoscere i tuoi limiti con chiarezza; il riconoscimento dei meriti è più discontinuo." },
  { key: "Impulsività", value: 35, icon: Flame, desc: "Bassa impulsività generale. Piccoli picchi quando il sonno scende sotto le 6 ore." },
  { key: "Funzionamento esecutivo", value: 72, icon: Target, desc: "Pianifichi bene le settimane. Le micro-decisioni quotidiane consumano più energia del previsto." },
  { key: "Attenzione e focus", value: 64, icon: Brain, desc: "Le finestre di concentrazione profonda durano in media 38 minuti, con cali dopo riunioni." },
  { key: "Interazione sociale", value: 58, icon: Users, desc: "Energia stabile in 1-a-1, più dispersa nei gruppi numerosi." },
  { key: "Motivazione", value: 70, icon: Sparkles, desc: "La motivazione si rinnova quando colleghi un'azione a un valore personale chiaro." },
  { key: "Resilienza", value: 66, icon: Shield, desc: "Recupero medio 2-3 giorni dopo un evento stressante; più rapido con attività fisica leggera." },
];

const radarData = awarenessAreas.map((a) => ({ area: a.key.split(" ")[0], v: a.value }));

const triggers = [
  { tag: "Carico mentale", note: "Aumenta nei giorni con più di 4 riunioni consecutive." },
  { tag: "Conflitto evitato", note: "Si ripresenta dopo conversazioni rimandate da oltre 48 ore." },
  { tag: "Sonno irregolare", note: "Notti sotto 6h correlate a maggiore irritabilità il giorno dopo." },
];

const distortions = [
  { name: "Pensiero tutto-o-nulla", freq: "frequente", hint: "Spesso emerge quando giudichi una giornata 'fallita' per un singolo episodio." },
  { name: "Catastrofizzazione", freq: "occasionale", hint: "Visibile in contesti di incertezza professionale." },
  { name: "Personalizzazione", freq: "moderata", hint: "Tendi ad attribuirti la responsabilità dell'umore altrui." },
];

const behaviors = [
  { name: "Procrastinazione strategica", desc: "Rimandi compiti emotivamente carichi al pomeriggio." },
  { name: "Rituale serale", desc: "Lettura prima di dormire associata a umore più alto il mattino." },
  { name: "Iper-pianificazione", desc: "Picco di liste nei lunedì che precedono settimane intense." },
];

const relationships = [
  { name: "Cerchio vicino", desc: "Comunicazione diretta e rigenerante con 3 persone ricorrenti." },
  { name: "Contesto lavorativo", desc: "Tendi a posticipare richieste personali per non disturbare." },
  { name: "Famiglia di origine", desc: "Emergono temi di confine non ancora del tutto definiti." },
];

const stressors = ["Riunioni back-to-back", "Notifiche serali", "Decisioni urgenti", "Mancanza di pause"];
const protectors = ["Camminate al mattino", "Lettura analogica", "Conversazioni con A.", "Scrittura libera"];

const milestones = [
  { date: "Marzo", text: "Hai iniziato a nominare le emozioni invece di descriverle in modo generico." },
  { date: "Aprile", text: "Prima settimana con confini espressi chiaramente sul lavoro." },
  { date: "Maggio", text: "Routine serale stabile per 21 giorni consecutivi." },
  { date: "Giugno", text: "Hai distinto stanchezza fisica da stanchezza emotiva con più precisione." },
];

const skills = [
  { name: "Riconoscere un'emozione mentre accade", level: 78 },
  { name: "Mettere in pausa una reazione automatica", level: 64 },
  { name: "Chiedere uno spazio personale", level: 55 },
  { name: "Rileggere una giornata con gentilezza", level: 71 },
];

const nextSteps = [
  "Sperimenta una micro-pausa di 3 minuti dopo ogni riunione, per una settimana.",
  "Annota una situazione in cui hai chiesto aiuto: cosa l'ha resa possibile?",
  "Prova a riformulare un pensiero 'tutto-o-nulla' in una frase più sfumata.",
];

// ——— Small UI helpers ———
function SectionHeader({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mb-5">
      {eyebrow && <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">{eyebrow}</div>}
      <h2 className="font-display text-2xl md:text-3xl text-foreground">{title}</h2>
      {sub && <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">{sub}</p>}
    </div>
  );
}

function Progress({ value, tone = "sage" }: { value: number; tone?: "sage" | "dust" | "anthracite" }) {
  const bg = tone === "dust" ? "from-dust to-sage" : tone === "anthracite" ? "from-anthracite to-sage-deep" : "from-sage to-sage-deep";
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${bg} transition-all`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-card border border-border/60 shadow-soft ${className}`}>{children}</div>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground px-2.5 py-1 rounded-full bg-muted/70 border border-border/60">{children}</span>;
}

function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex gap-3 rounded-2xl border border-border/60 bg-secondary/40 ${compact ? "p-3" : "p-4 md:p-5"}`}>
      <Info className="size-4 text-primary shrink-0 mt-0.5" />
      <p className={`${compact ? "text-xs" : "text-xs md:text-sm"} text-foreground/75 leading-relaxed`}>
        Synapse offre spunti educativi e di auto-riflessione. <span className="text-foreground">Non fornisce diagnosi, valutazioni cliniche o consigli medici.</span> Per un percorso di cura, rivolgiti a un professionista qualificato.
      </p>
    </div>
  );
}

// ——— Chart palette (hex equivalents close to tokens) ———
const C = {
  sage: "#5f8a73",
  sageDeep: "#3f6b56",
  dust: "#a9bcd1",
  anthracite: "#3a3d4a",
  cream: "#f3ecdc",
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-card/95 backdrop-blur px-3 py-2 shadow-soft text-xs">
      <div className="text-muted-foreground mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.dataKey}</span>
          <span className="ml-auto font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ——— Page ———
function InsightPage() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto pb-32">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
          <LineChartIcon className="size-3.5 text-primary" /> insight & report
        </div>
        <h1 className="font-display text-3xl md:text-5xl leading-[1.05]">Le connessioni che stiamo notando.</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Una sintesi delle tue conversazioni, dei tuoi pensieri e dei questionari. Pensata per aiutarti a vedere più chiaramente, non per spiegarti chi sei.
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-8 -mx-2 px-2 overflow-x-auto">
        <div role="tablist" className="inline-flex min-w-full md:min-w-0 gap-1 p-1 rounded-2xl bg-muted/60 border border-border/60">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap ${
                  active ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                <span className="font-medium">{t.label}</span>
                <span className="hidden lg:inline text-[11px] text-muted-foreground/70 ml-1">· {t.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "patterns" && <PatternsTab />}
      {tab === "awareness" && <AwarenessTab />}
      {tab === "growth" && <GrowthTab />}
      {tab === "reports" && <ReportsTab />}

      <div className="mt-12">
        <Disclaimer />
      </div>
    </div>
  );
}

// ——— OVERVIEW ———
function OverviewTab() {
  return (
    <div className="space-y-10">
      <section>
        <SectionHeader
          eyebrow="tendenze emotive"
          title="Come si sono mosse le tue emozioni questa settimana"
          sub="Linee morbide ricavate dalle tue conversazioni e dai pensieri raccolti. Sono indicazioni qualitative, non misure cliniche."
        />
        <Card className="p-5 md:p-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emotionalTrend} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.sage} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={C.sage} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.dust} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={C.dust} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.anthracite} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={C.anthracite} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 12, fill: "#6b6f7d" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6b6f7d" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="calma" stroke={C.sageDeep} fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="energia" stroke={C.dust} fill="url(#g2)" strokeWidth={2} />
                <Area type="monotone" dataKey="tensione" stroke={C.anthracite} fill="url(#g3)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: C.sageDeep }} /> Calma</span>
            <span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: C.dust }} /> Energia</span>
            <span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: C.anthracite }} /> Tensione</span>
          </div>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card className="p-5 md:p-6">
          <SectionHeader eyebrow="oscillazioni d'umore" title="Otto settimane di umore percepito" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodFluctuation} margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 12, fill: "#6b6f7d" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6b6f7d" }} axisLine={false} tickLine={false} width={28} domain={[40, 90]} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="umore" stroke={C.sageDeep} strokeWidth={2.5} dot={{ r: 3, fill: C.sageDeep }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Un movimento leggero verso un umore più stabile, con piccole flessioni nelle settimane più cariche di lavoro.
          </p>
        </Card>

        <Card className="p-5 md:p-6">
          <SectionHeader eyebrow="temi ricorrenti" title="Di cosa abbiamo parlato di più" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topThemes} layout="vertical" margin={{ left: 10, right: 16, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#3a3d4a" }} axisLine={false} tickLine={false} width={130} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" fill={C.sage} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card className="p-5 md:p-6">
          <SectionHeader eyebrow="punti di forza" title="Risorse personali che emergono" />
          <ul className="space-y-4">
            {strengths.map((s) => (
              <li key={s.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-foreground">{s.label}</span>
                  <span className="text-muted-foreground text-xs">{s.value}/100</span>
                </div>
                <Progress value={s.value} />
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5 md:p-6">
          <SectionHeader eyebrow="aree di fatica" title="Dove serve più cura" />
          <ul className="space-y-4">
            {difficulties.map((s) => (
              <li key={s.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-foreground">{s.label}</span>
                  <span className="text-muted-foreground text-xs">{s.value}/100</span>
                </div>
                <Progress value={s.value} tone="dust" />
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-5 italic leading-relaxed">
            Non sono giudizi: sono indizi gentili di dove rallentare e ascoltarti meglio.
          </p>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        {[
          { label: "Sintesi settimanale", date: "8 — 14 Giugno", body: "Settimana più morbida della precedente. Le serate restano un momento da proteggere. Tre conversazioni hanno toccato il tema dei confini sul lavoro." },
          { label: "Sintesi mensile", date: "Maggio", body: "Maggio è stato un mese di costruzione: più routine, meno reattività. Compare per la prima volta in modo netto il bisogno di tempo non pianificato." },
        ].map((s) => (
          <Card key={s.label} className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Pill><Calendar className="size-3" /> {s.label}</Pill>
              <span className="text-xs text-muted-foreground">{s.date}</span>
            </div>
            <p className="font-display text-lg leading-snug mt-2">{s.body}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

// ——— PATTERNS ———
function PatternsTab() {
  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="pattern"
        title="Schemi che si ripetono nella tua storia"
        sub="Sono ipotesi di lettura, costruite sulle tue parole. Restano aperte: tu sei l'unica voce che può confermarle o smentirle."
      />

      <section className="grid md:grid-cols-2 gap-6">
        <Card className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4"><Flame className="size-4 text-primary" /><h3 className="font-display text-xl">Trigger emotivi ricorrenti</h3></div>
          <ul className="space-y-4">
            {triggers.map((t) => (
              <li key={t.tag} className="rounded-xl bg-muted/50 border border-border/60 p-4">
                <div className="text-sm font-medium text-foreground">{t.tag}</div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.note}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4"><Brain className="size-4 text-primary" /><h3 className="font-display text-xl">Distorsioni cognitive comuni</h3></div>
          <ul className="space-y-4">
            {distortions.map((d) => (
              <li key={d.name} className="rounded-xl bg-muted/50 border border-border/60 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{d.name}</div>
                  <Pill>{d.freq}</Pill>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{d.hint}</p>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground mt-4 italic">Concetti educativi tratti da letteratura psicologica, non strumenti diagnostici.</p>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4"><Activity className="size-4 text-primary" /><h3 className="font-display text-xl">Pattern comportamentali</h3></div>
          <ul className="space-y-4">
            {behaviors.map((b) => (
              <li key={b.name} className="border-l-2 border-primary/40 pl-4">
                <div className="text-sm font-medium">{b.name}</div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{b.desc}</p>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4"><Users className="size-4 text-primary" /><h3 className="font-display text-xl">Dinamiche relazionali</h3></div>
          <ul className="space-y-4">
            {relationships.map((r) => (
              <li key={r.name} className="border-l-2 border-dust pl-4">
                <div className="text-sm font-medium">{r.name}</div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{r.desc}</p>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4"><Wind className="size-4 text-destructive" /><h3 className="font-display text-xl">Fattori di stress</h3></div>
          <div className="flex flex-wrap gap-2">
            {stressors.map((s) => (
              <span key={s} className="text-sm px-3 py-1.5 rounded-full bg-destructive/10 text-foreground/80 border border-destructive/20">{s}</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">Si ripresentano nelle settimane con meno spazi non strutturati.</p>
        </Card>
        <Card className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4"><Shield className="size-4 text-primary" /><h3 className="font-display text-xl">Fattori protettivi</h3></div>
          <div className="flex flex-wrap gap-2">
            {protectors.map((s) => (
              <span key={s} className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-foreground/80 border border-primary/20">{s}</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">Tendono a stabilizzare l'umore quando sono presenti almeno tre volte a settimana.</p>
        </Card>
      </section>
    </div>
  );
}

// ——— AWARENESS ———
function AwarenessTab() {
  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="mappa di sé"
        title="Aree di consapevolezza"
        sub="Una lettura qualitativa di otto dimensioni che emergono dalle tue interazioni. I valori indicano una tendenza percepita, non una misura clinica."
      />

      <Card className="p-5 md:p-6">
        <div className="grid md:grid-cols-5 gap-6 items-center">
          <div className="md:col-span-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="80%">
                <PolarGrid stroke="rgba(0,0,0,0.08)" />
                <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: "#3a3d4a" }} />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar dataKey="v" stroke={C.sageDeep} fill={C.sage} fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="md:col-span-3 text-sm text-muted-foreground leading-relaxed">
            La forma di questa mappa cambia con il tempo. Non c'è una "figura ideale": le linee morbide raccontano semplicemente come ti stai muovendo in questo periodo.
          </p>
        </div>
      </Card>

      <section className="grid md:grid-cols-2 gap-4">
        {awarenessAreas.map((a) => {
          const Icon = a.icon;
          return (
            <Card key={a.key} className="p-5">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-xl bg-secondary grid place-items-center shrink-0">
                  <Icon className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="font-medium truncate">{a.key}</div>
                    <span className="text-xs text-muted-foreground shrink-0">{a.value}/100</span>
                  </div>
                  <Progress value={a.value} />
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

// ——— GROWTH ———
function GrowthTab() {
  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="percorso"
        title="Come ti stai muovendo nel tempo"
        sub="Piccoli movimenti che, messi vicini, raccontano una direzione. Non un traguardo: una continuità."
      />

      <section>
        <h3 className="font-display text-xl mb-4">Tappe significative</h3>
        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-1 before:bottom-1 before:w-px before:bg-border">
          {milestones.map((m) => (
            <div key={m.date} className="relative">
              <span className="absolute -left-[18px] top-1.5 size-3 rounded-full bg-primary ring-4 ring-background" />
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{m.date}</div>
              <p className="font-display text-lg leading-snug mt-1">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card className="p-5 md:p-6">
          <h3 className="font-display text-xl mb-1 flex items-center gap-2"><Sprout className="size-4 text-primary" /> Cambiamenti positivi</h3>
          <p className="text-sm text-muted-foreground mb-5">Movimenti gentili registrati negli ultimi 90 giorni.</p>
          <ul className="space-y-3">
            {["Pause più frequenti durante la giornata", "Linguaggio meno autocritico nelle riflessioni", "Maggiore coerenza tra valori e scelte settimanali"].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm"><CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" /><span>{t}</span></li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 md:p-6">
          <h3 className="font-display text-xl mb-5">Abilità che stai sviluppando</h3>
          <ul className="space-y-4">
            {skills.map((s) => (
              <li key={s.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span>{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.level}%</span>
                </div>
                <Progress value={s.level} />
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section>
        <h3 className="font-display text-xl mb-4">Prossimi passi suggeriti</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {nextSteps.map((n, i) => (
            <Card key={i} className="p-5">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">passo {i + 1}</div>
              <p className="font-display text-lg leading-snug">{n}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary">prova questa settimana <ArrowRight className="size-3.5" /></div>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">Sperimentazioni, non prescrizioni. Tienile se ti sono utili, lasciale andare se non lo sono.</p>
      </section>
    </div>
  );
}

// ——— REPORTS ———
function ReportsTab() {
  const [mode, setMode] = useState<"personale" | "professionista">("personale");
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">report</div>
          <h2 className="font-display text-2xl md:text-3xl">
            {mode === "personale" ? "Report di auto-riflessione" : "Report di osservazione personale"}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            {mode === "personale"
              ? "Una sintesi narrativa, pensata per essere letta con calma — da sola o, se lo desideri, con il tuo terapeuta."
              : "Una sintesi strutturata del materiale raccolto, pensata per essere condivisa con un professionista della salute mentale."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode("personale")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition border ${
              mode === "personale"
                ? "bg-primary text-primary-foreground border-transparent shadow-soft"
                : "bg-card border-border/60 hover:bg-muted"
            }`}
          >
            <Download className="size-4" /> Scarica report personale
          </button>
          <button
            onClick={() => setMode("professionista")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition border ${
              mode === "professionista"
                ? "bg-primary text-primary-foreground border-transparent shadow-soft"
                : "bg-card border-border/60 hover:bg-muted"
            }`}
          >
            <FileText className="size-4" /> Genera report professionista
          </button>
          <button
            onClick={() => typeof window !== "undefined" && window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/60 text-sm hover:bg-muted transition"
          >
            <Printer className="size-4" /> Esporta in PDF
          </button>
        </div>
      </div>

      {mode === "personale" ? <PersonalReport /> : <ProfessionalReport />}
    </div>
  );
}

function PersonalReport() {
  return (
    <article className="rounded-3xl bg-card border border-border/60 shadow-soft overflow-hidden">
      <header className="px-6 md:px-10 py-6 md:py-8 bg-gradient-to-br from-secondary via-card to-accent/20 border-b border-border/60">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Synapse · report personale</div>
            <h3 className="font-display text-2xl md:text-3xl mt-1">Riflessioni — Giugno 2026</h3>
          </div>
          <Pill><Calendar className="size-3" /> generato l'11 giugno</Pill>
        </div>
      </header>

      <div className="px-6 md:px-10 py-8 md:py-10 space-y-10">
        <ReportSection title="Sintesi esecutiva">
          <p>
            Negli ultimi 30 giorni, le tue conversazioni e i tuoi appunti hanno disegnato un periodo di stabilizzazione. Emergono tre temi vivi: i confini sul lavoro, la qualità del riposo serale e il modo in cui riconosci i tuoi meriti. Le risorse personali più nominate restano la curiosità e la capacità di auto-osservazione.
          </p>
        </ReportSection>

        <ReportSection title="Osservazioni chiave">
          <ul className="list-disc pl-5 space-y-2 marker:text-primary">
            <li>Le serate restano il momento più delicato della giornata, con un calo medio dell'energia percepita.</li>
            <li>Il linguaggio che usi su te stessa è diventato più descrittivo e meno valutativo.</li>
            <li>Hai introdotto due nuove pratiche stabili: lettura prima di dormire e camminata mattutina.</li>
          </ul>
        </ReportSection>

        <ReportSection title="Tendenze emotive">
          <p>La calma percepita è in lieve aumento; la tensione mostra un andamento più piatto rispetto al mese precedente, con picchi nelle giornate ad alta densità di riunioni. L'energia segue un ritmo coerente con i cicli di sonno.</p>
        </ReportSection>

        <ReportSection title="Pattern identificati">
          <div className="grid sm:grid-cols-2 gap-3">
            {["Pensiero tutto-o-nulla nei giorni intensi", "Procrastinazione su compiti emotivamente carichi", "Maggiore disponibilità relazionale dopo le camminate", "Tendenza a rimandare le richieste personali"].map((p) => (
              <div key={p} className="rounded-xl bg-muted/50 border border-border/60 p-3 text-sm">{p}</div>
            ))}
          </div>
        </ReportSection>

        <ReportSection title="Punti di forza">
          <div className="flex flex-wrap gap-2">
            {strengths.map((s) => (
              <span key={s.label} className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-foreground/80 border border-primary/20">{s.label}</span>
            ))}
          </div>
        </ReportSection>

        <ReportSection title="Aree suggerite di riflessione">
          <ul className="space-y-3">
            {["Cosa rende difficile riposare senza colpa, anche quando ne hai bisogno?",
              "Quando hai chiesto aiuto recentemente, cosa l'ha reso possibile?",
              "Cosa cambierebbe se concedessi a una giornata il diritto di non essere produttiva?"
            ].map((q) => (
              <li key={q} className="border-l-2 border-primary/40 pl-4 text-foreground/85">{q}</li>
            ))}
          </ul>
        </ReportSection>

        <ProDisclaimer text="Questo documento è uno strumento di auto-riflessione. Non costituisce una diagnosi, una valutazione clinica né un consiglio medico. Per un percorso terapeutico, rivolgiti a un professionista qualificato." />
      </div>
    </article>
  );
}

// ——— PROFESSIONAL REPORT ———
const proThemes = [
  { name: "Regolazione emotiva", freq: "Alta", trend: "In crescita", evidence: "24 elementi osservati", note: "Le riflessioni mostrano una crescente capacità di riconoscere e nominare gli stati emotivi prima dell'azione." },
  { name: "Gestione dei confini personali", freq: "Alta", trend: "Stabile", evidence: "19 elementi osservati", note: "Sembra emergere una maggiore attenzione alla distinzione tra richieste esterne e priorità personali, soprattutto in ambito lavorativo." },
  { name: "Energia percepita e carico mentale", freq: "Media", trend: "Variabile", evidence: "16 elementi osservati", note: "Si osserva una correlazione ricorrente tra giornate ad alta densità cognitiva e cali serali di energia." },
  { name: "Qualità del riposo", freq: "Media", trend: "In miglioramento", evidence: "11 elementi osservati", note: "È stato registrato con maggiore continuità un investimento su rituali serali più sostenibili." },
];

const proPatterns = [
  { name: "Auto-critica anticipatoria", freq: "Frequente", trend: "Stabile", desc: "Tendenza a valutare la propria performance prima ancora del completamento del compito." },
  { name: "Procrastinazione emotiva", freq: "Frequente", trend: "In lieve calo", desc: "Rinvio osservato per attività associate a contenuti emotivi più intensi." },
  { name: "Ricerca di rassicurazione", freq: "Moderata", trend: "Stabile", desc: "Richiesta di conferma in contesti di incertezza relazionale o decisionale." },
  { name: "Iperfocalizzazione", freq: "Moderata", trend: "Episodica", desc: "Periodi di concentrazione prolungata seguiti da cali significativi di energia." },
  { name: "Difficoltà nella definizione dei confini", freq: "Moderata", trend: "In evoluzione", desc: "Le osservazioni suggeriscono un graduale passaggio da accomodamento a negoziazione." },
];

const proResources = [
  { name: "Capacità riflessiva", desc: "Frequente attivazione di processi di auto-osservazione descrittivi e non giudicanti." },
  { name: "Curiosità", desc: "Apertura ricorrente verso nuove letture e domande personali." },
  { name: "Consapevolezza emotiva", desc: "Crescente granularità nel descrivere gli stati interni." },
  { name: "Perseveranza", desc: "Continuità nelle pratiche introdotte negli ultimi due mesi." },
  { name: "Capacità relazionale", desc: "Disponibilità al confronto e all'ascolto in contesti significativi." },
  { name: "Resilienza", desc: "Recupero osservato dopo episodi di sovraccarico, con tempi di rientro in diminuzione." },
];

const proTriggers = [
  "Sovraccarico lavorativo concentrato in finestre di 3-4 giorni",
  "Conflitti relazionali a basso livello ma protratti",
  "Riduzione delle ore di sonno sotto le 6 ore",
  "Cambiamenti improvvisi di routine settimanale",
];

const proCopingHelpful = ["Scrittura riflessiva serale", "Camminate brevi e regolari", "Richiesta di supporto a figure di fiducia", "Pianificazione realistica delle priorità"];
const proCopingLess = ["Evitamento di conversazioni difficili", "Posticipo di attività di auto-cura", "Aumento del carico cognitivo nelle fasi di stanchezza"];

const proFrameworks = [
  { name: "CBT", focus: "Distorsioni cognitive", themes: ["Pensiero tutto-o-nulla", "Catastrofizzazione moderata"], evidence: "Evidenza moderata", note: "Si osserva un linguaggio interno che oscilla tra valutazioni assolute e descrizioni più sfumate, con tendenza recente alla seconda." },
  { name: "DBT", focus: "Regolazione e tolleranza", themes: ["Tolleranza al disagio", "Efficacia interpersonale"], evidence: "Evidenza moderata", note: "Le osservazioni suggeriscono una progressiva capacità di stare con stati emotivi intensi senza azioni reattive immediate." },
  { name: "ACT", focus: "Flessibilità psicologica", themes: ["Contatto con i valori", "Defusione cognitiva"], evidence: "Evidenza moderata", note: "Sembra emergere un riferimento più stabile ad alcuni valori personali nelle decisioni quotidiane." },
  { name: "ADHD-informed", focus: "Funzioni esecutive", themes: ["Avvio del compito", "Percezione del tempo"], evidence: "Evidenza preliminare", note: "Si osservano episodi ricorrenti di difficoltà di avvio non riconducibili a mancanza di motivazione." },
  { name: "Attaccamento e Relazioni", focus: "Modelli relazionali", themes: ["Ricerca di prossimità", "Gestione della distanza"], evidence: "Evidenza moderata", note: "È stato registrato con maggiore continuità un lavoro di negoziazione nei legami significativi." },
  { name: "Trauma-informed", focus: "Sicurezza percepita", themes: ["Evitamento mirato", "Comportamenti di protezione"], evidence: "Evidenza preliminare", note: "Le osservazioni vengono presentate come ipotesi e non come indicatori clinici." },
];

const proTimeline = [
  { label: "Primo periodo (marzo-aprile)", text: "Temi predominanti: sovraccarico, auto-critica, difficoltà nel riposo. Tono complessivo più valutativo." },
  { label: "Periodo intermedio (maggio)", text: "Comparsa di pratiche di auto-osservazione e prime sperimentazioni sui confini. Maggiore granularità emotiva." },
  { label: "Periodo recente (giugno)", text: "Consolidamento di rituali quotidiani, riduzione dell'auto-critica anticipatoria, emergere di domande sulla qualità del riposo e sull'energia." },
];

const proLiveQuestions = [
  "Cosa rende difficile riposare senza colpa, anche quando il bisogno è chiaro?",
  "In quali contesti i confini personali risultano più negoziabili?",
  "Che relazione esiste tra l'energia percepita e il senso di efficacia?",
  "Quali condizioni rendono più sostenibile chiedere aiuto?",
];

const proQuotes = [
  "«Mi accorgo di rimandare proprio le cose che mi importano di più.»",
  "«Quando cammino, le idee si mettono in fila da sole.»",
  "«Non è stanchezza fisica, è una stanchezza di scelte.»",
];

function ProfessionalReport() {
  return (
    <article className="rounded-3xl bg-card border border-border/60 shadow-soft overflow-hidden">
      <header className="px-6 md:px-12 py-10 md:py-14 bg-gradient-to-b from-secondary/60 via-card to-card border-b border-border/60">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Synapse · report professionista</div>
        <h3 className="font-display text-3xl md:text-4xl mt-3 leading-tight">Report di osservazione personale</h3>
        <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          Sintesi strutturata delle conversazioni, riflessioni e materiali raccolti.
        </p>
        <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
          <CoverField label="Periodo osservato" value="1 marzo — 11 giugno 2026" />
          <CoverField label="Data di generazione" value="11 giugno 2026" />
          <CoverField label="Versione" value="1.0 · sintesi estesa" />
        </div>
        <div className="mt-6 rounded-2xl border border-border/60 bg-card/60 p-4 md:p-5">
          <div className="flex gap-3">
            <Shield className="size-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs md:text-sm text-foreground/75 leading-relaxed">
              Il presente documento non costituisce una diagnosi, una valutazione clinica né un'indicazione terapeutica. Le osservazioni riportate derivano dal materiale raccolto in autonomia dalla persona e sono presentate come ipotesi descrittive a supporto del lavoro del professionista.
            </p>
          </div>
        </div>
      </header>

      <div className="px-6 md:px-12 py-10 md:py-12 space-y-12">
        <ProSection title="Sintesi generale" index="02">
          <p>
            Nel periodo osservato emergono con maggiore frequenza temi legati alla regolazione emotiva, alla gestione dei confini personali e alla relazione tra energia percepita e carico mentale. Le osservazioni suggeriscono un progressivo spostamento da un registro valutativo a uno più descrittivo nell'auto-narrazione. Sembra emergere una maggiore continuità nelle pratiche di auto-cura, accompagnata da episodi ricorrenti di auto-critica anticipatoria nelle fasi ad alta densità cognitiva. Le risorse più stabilmente nominate restano la capacità riflessiva, la curiosità e la disponibilità al confronto relazionale.
          </p>
        </ProSection>

        <ProSection title="Temi principali" index="03">
          <div className="space-y-4">
            {proThemes.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border/60 bg-card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-display text-lg">{t.name}</h4>
                  <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
                    <span>Frequenza: <span className="text-foreground/80 normal-case tracking-normal">{t.freq}</span></span>
                    <span>Evoluzione: <span className="text-foreground/80 normal-case tracking-normal">{t.trend}</span></span>
                    <span>Evidenza: <span className="text-foreground/80 normal-case tracking-normal">{t.evidence}</span></span>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{t.note}</p>
              </div>
            ))}
          </div>
        </ProSection>

        <ProSection title="Pattern ricorrenti" index="04">
          <div className="grid md:grid-cols-2 gap-3">
            {proPatterns.map((p) => (
              <div key={p.name} className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h5 className="font-medium">{p.name}</h5>
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.freq}</span>
                </div>
                <p className="text-sm text-foreground/75 mt-2 leading-relaxed">{p.desc}</p>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-3">Andamento: <span className="text-foreground/80 normal-case tracking-normal">{p.trend}</span></div>
              </div>
            ))}
          </div>
        </ProSection>

        <ProSection title="Risorse e fattori protettivi" index="05">
          <div className="grid md:grid-cols-2 gap-3">
            {proResources.map((r) => (
              <div key={r.name} className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-primary" />
                  <h5 className="font-medium">{r.name}</h5>
                </div>
                <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </ProSection>

        <ProSection title="Trigger e contesti associati" index="06">
          <p className="text-sm text-muted-foreground mb-3">Elementi presentati come ipotesi osservative, non come fattori causali.</p>
          <ul className="space-y-2">
            {proTriggers.map((t) => (
              <li key={t} className="text-sm border-l-2 border-border pl-4 py-1 text-foreground/85">{t}</li>
            ))}
          </ul>
        </ProSection>

        <ProSection title="Strategie di coping osservate" index="07">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Apparentemente utili</div>
              <ul className="space-y-2">
                {proCopingHelpful.map((s) => (
                  <li key={s} className="text-sm text-foreground/85 flex gap-2"><CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Apparentemente meno efficaci</div>
              <ul className="space-y-2">
                {proCopingLess.map((s) => (
                  <li key={s} className="text-sm text-foreground/85 flex gap-2"><ArrowRight className="size-4 text-muted-foreground mt-0.5 shrink-0" />{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </ProSection>

        <ProSection title="Framework clinici utilizzati" index="08">
          <p className="text-sm text-muted-foreground mb-4">I framework sono utilizzati come lenti interpretative del materiale raccolto, non come classificazioni della persona.</p>
          <div className="space-y-3">
            {proFrameworks.map((f) => (
              <div key={f.name} className="rounded-2xl border border-border/60 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{f.focus}</div>
                    <h5 className="font-display text-lg mt-0.5">{f.name}</h5>
                  </div>
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{f.evidence}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {f.themes.map((th) => (
                    <span key={th} className="text-xs px-2.5 py-1 rounded-full bg-secondary/60 border border-border/60">{th}</span>
                  ))}
                </div>
                <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{f.note}</p>
              </div>
            ))}
          </div>
        </ProSection>

        <ProSection title="Evoluzione nel tempo" index="09">
          <ol className="space-y-4">
            {proTimeline.map((p) => (
              <li key={p.label} className="border-l-2 border-primary/40 pl-4">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.label}</div>
                <p className="text-sm text-foreground/85 mt-1 leading-relaxed">{p.text}</p>
              </li>
            ))}
          </ol>
        </ProSection>

        <ProSection title="Domande vive" index="10">
          <ul className="space-y-3">
            {proLiveQuestions.map((q) => (
              <li key={q} className="rounded-xl border border-border/60 bg-secondary/30 p-4 text-foreground/85">{q}</li>
            ))}
          </ul>
        </ProSection>

        <ProSection title="Citazioni rappresentative" index="11">
          <p className="text-sm text-muted-foreground mb-3">Estratti brevi e anonimizzati, utili a restituire il tono emotivo del materiale.</p>
          <div className="space-y-2">
            {proQuotes.map((q) => (
              <blockquote key={q} className="text-sm italic text-foreground/80 border-l-2 border-border pl-4">{q}</blockquote>
            ))}
          </div>
        </ProSection>

        <ProDisclaimer text="Le osservazioni riportate non costituiscono una diagnosi né una valutazione clinica. Il documento è pensato come mappa ragionata del materiale raccolto, a supporto del dialogo con il professionista. L'interpretazione clinica resta di esclusiva competenza dello specialista." />
      </div>
    </article>
  );
}

function CoverField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground/90 mt-1">{value}</div>
    </div>
  );
}

function ProSection({ title, index, children }: { title: string; index: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-4 pb-2 border-b border-border/60">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{index}</span>
        <h4 className="font-display text-xl md:text-2xl">{title}</h4>
      </div>
      <div className="text-[15px] leading-relaxed text-foreground/90 space-y-3">{children}</div>
    </section>
  );
}

function ProDisclaimer({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4 md:p-5">
      <div className="flex gap-3">
        <Info className="size-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs md:text-sm text-foreground/75 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">{title}</div>
      <div className="text-[15px] leading-relaxed text-foreground/90 space-y-3 font-sans">{children}</div>
    </section>
  );
}
