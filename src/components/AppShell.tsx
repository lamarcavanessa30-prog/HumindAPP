import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BookMarked, BookOpen, Home, Library, LineChart, Menu, MessageCircle, MoonStar, Network, Plus, Sparkles, User, Wind, X } from "lucide-react";
import { useState } from "react";
import { useThoughts } from "@/domain/ThoughtsProvider";
import { Button } from "@/components/ui/button";

const primaryNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chat", label: "Conversazione", icon: MessageCircle },
  { to: "/diario", label: "Diario", icon: BookOpen },
  { to: "/insight", label: "Insight / Report", icon: LineChart },
  { to: "/profilo", label: "Profilo", icon: User },
] as const;

const secondaryNav = [
  { to: "/pause", label: "Pause", icon: Wind },
  { to: "/mappa", label: "Mappa", icon: Network },
  { to: "/framework", label: "Framework", icon: BookMarked },
  { to: "/knowledge", label: "Knowledge", icon: Library },
  { to: "/dream-lab", label: "Dream Lab", icon: MoonStar, badge: "WIP" },
] as const;

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { addThought } = useThoughts();
  const [captureOpen, setCaptureOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [thought, setThought] = useState("");
  const [tag, setTag] = useState("Riflessione");

  const saveThought = () => {
    const saved = addThought({ text: thought, source: "capture", tags: [tag] });
    if (!saved) return;
    setThought("");
    setTag("Riflessione");
    setCaptureOpen(false);
  };

  const navLink = ({ to, label, icon: Icon, badge }: { to: string; label: string; icon: typeof Home; badge?: string }) => {
    const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
    return (
      <Link key={to} to={to} onClick={() => setMobileOpen(false)} className={`app-nav-link ${active ? "app-nav-active" : ""}`}>
        <Icon className="size-4" strokeWidth={1.5} />
        <span>{label}</span>
        {badge && <span className="ml-auto text-[9px] uppercase tracking-[0.12em] text-primary/70">{badge}</span>}
      </Link>
    );
  };

  return (
    <div className="min-h-screen md:flex">
      <aside className="app-sidebar hidden h-screen w-56 shrink-0 flex-col border-r border-border/60 px-5 py-7 md:sticky md:top-0 md:flex">
        <Link to="/" className="flex items-center gap-3 px-2">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles className="size-3.5" /></span>
          <span className="font-display text-2xl">HuMind</span>
        </Link>
        <nav className="mt-14 space-y-1">{primaryNav.map(navLink)}</nav>
        <div className="my-7 border-t border-border/60" />
        <p className="px-3 text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">Altri spazi</p>
        <nav className="mt-3 space-y-0.5">{secondaryNav.map(navLink)}</nav>
        <p className="mt-auto px-3 font-display text-base leading-snug text-foreground/50">Le connessioni della tua storia.</p>
      </aside>

      <header className="app-mobile-header fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-border/60 px-5 py-4 md:hidden">
        <Link to="/" className="font-display text-2xl">HuMind</Link>
        <Button variant="ghost" size="icon" aria-label={mobileOpen ? "Chiudi navigazione" : "Apri navigazione"} onClick={() => setMobileOpen((value) => !value)}>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background px-5 pb-10 pt-24 md:hidden">
          <nav className="space-y-2">{primaryNav.map(navLink)}</nav>
          <div className="my-6 border-t border-border" />
          <nav className="space-y-1">{secondaryNav.map(navLink)}</nav>
        </div>
      )}

      <main className="min-w-0 flex-1 pt-16 md:pt-0"><Outlet /></main>

      {pathname !== "/" && pathname !== "/chat" && (
        <Button onClick={() => setCaptureOpen(true)} className="fixed bottom-6 right-5 z-30 h-12 rounded-full px-5 shadow-float md:bottom-8 md:right-8">
          <Plus className="size-4" /> Cattura un pensiero
        </Button>
      )}

      {captureOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-foreground/30 p-4 backdrop-blur-sm" onClick={() => setCaptureOpen(false)}>
          <div onClick={(event) => event.stopPropagation()} className="w-full max-w-xl bg-card p-6 shadow-float md:p-8">
            <p className="editorial-kicker">Cattura un pensiero</p>
            <textarea autoFocus value={thought} onChange={(event) => setThought(event.target.value)} placeholder="Cosa ti attraversa la mente in questo momento?" rows={5} className="mt-6 w-full resize-none bg-transparent font-display text-2xl leading-relaxed outline-none placeholder:text-muted-foreground/60" />
            <div className="mt-5 flex flex-wrap gap-2">
              {["Riflessione", "Lettura", "Idea", "Sogno", "Emozione"].map((item) => (
                <Button key={item} size="sm" variant={tag === item ? "default" : "outline"} onClick={() => setTag(item)}>{item}</Button>
              ))}
            </div>
            <div className="mt-7 flex justify-end gap-2 border-t border-border pt-5">
              <Button variant="ghost" onClick={() => setCaptureOpen(false)}>Annulla</Button>
              <Button onClick={saveThought} disabled={!thought.trim()}>Conserva</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}