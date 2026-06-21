import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, MessageCircle, Network, BookOpen, User, Plus, Sparkles, Search, LineChart, BookMarked, Wind } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/mappa", label: "Mappa", icon: Network },
  { to: "/diario", label: "Diario", icon: BookOpen },
  { to: "/pause", label: "Pause Guidate", icon: Wind },
  { to: "/insight", label: "Insight", icon: LineChart },
  { to: "/framework", label: "Framework", icon: BookMarked },
  { to: "/profilo", label: "Profilo", icon: User },
] as const;

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [thought, setThought] = useState("");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-2 p-6 border-r border-border/60 glass sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-8">
          <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-soft">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="font-display text-xl leading-none">Synapse</div>
            <div className="text-[11px] tracking-wide uppercase text-muted-foreground mt-1">le connessioni della tua storia</div>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Cerca un pensiero…"
            className="w-full bg-muted/60 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40 transition"
          />
        </div>

        <nav className="flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground/70 hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {label}
                {active && <span className="ml-auto size-1.5 rounded-full bg-primary animate-pulse-soft" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 rounded-xl bg-secondary/60 border border-border/60">
          <div className="text-xs text-muted-foreground mb-1">Oggi</div>
          <div className="font-display text-lg leading-snug">"Ogni pensiero conservato è un passo verso una comprensione più chiara."</div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border/60 px-2 py-2 flex justify-around">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link key={to} to={to} className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Floating capture button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-6 z-50 group flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full bg-primary text-primary-foreground shadow-float hover:scale-[1.03] active:scale-95 transition-transform"
      >
        <span className="size-5 grid place-items-center rounded-full bg-primary-foreground/20">
          <Plus className="size-3.5" />
        </span>
        <span className="text-sm font-medium tracking-tight">Cattura un pensiero</span>
      </button>

      {/* Capture modal */}
      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-anthracite/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl glass rounded-3xl shadow-float p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-4 text-primary" />
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Cattura un pensiero</div>
            </div>
            <textarea
              autoFocus
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Cosa ti attraversa la mente in questo momento?"
              rows={5}
              className="w-full bg-transparent text-lg font-display leading-relaxed outline-none resize-none placeholder:text-muted-foreground/60"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {["💭 Riflessione", "📚 Lettura", "🌿 Idea", "🌙 Sogno", "❤️ Emozione"].map((t) => (
                <button key={t} className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-secondary transition">{t}</button>
              ))}
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/60">
              <div className="text-xs text-muted-foreground">Salvato in <span className="text-foreground">Diario · oggi</span></div>
              <div className="flex gap-2">
                <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm hover:bg-muted">Annulla</button>
                <button onClick={() => { setThought(""); setOpen(false); }} className="px-5 py-2 rounded-lg text-sm bg-primary text-primary-foreground shadow-soft hover:opacity-90">Conserva</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
