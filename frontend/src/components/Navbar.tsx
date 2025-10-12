import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/80 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-xl font-semibold">
          Image <span className="text-indigo-400">Lab</span>
        </Link>

        <div className="ml-auto hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
          <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"/>
          </svg>
          <input placeholder="Szukaj pliku..." className="bg-transparent outline-none text-sm placeholder:text-slate-400 w-64"/>
        </div>

        <div className="flex items-center gap-2">
          <NavLink to="/" end className="px-2 py-2 rounded-xl hover:bg-white/10">Start</NavLink>
          <NavLink to="/convert" className="px-2 py-2 rounded-xl hover:bg-white/10">Konwertuj</NavLink>
          <button className="p-2 rounded-xl hover:bg-white/10" aria-label="Konto">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
            </svg>
          </button>
          <button className="p-2 rounded-xl hover:bg-white/10" aria-label="Tryb">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
