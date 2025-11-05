import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-slate-800/30 to-slate-900/40 p-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Image <span className="text-indigo-400">Lab</span>
        </h1>
        <p className="mt-3 text-slate-300 max-w-2xl">
          Szybka konwersja obrazów do JPG/PNG/WEBP. Przeciągnij, wybierz format, pobierz.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/convert" className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:opacity-90">
            Konwertuj teraz
          </Link>
          <Link to="/editor" className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10">
            Edytor zdjęć
          </Link>
        </div>
      </section>
    </div>
  );
}
