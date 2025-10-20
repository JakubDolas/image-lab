import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">Image <span className="text-indigo-400">Lab</span></Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="text-slate-300 hover:text-white">Start</Link>
            <Link to="/convert" className="text-slate-300 hover:text-white">Konwertuj</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
