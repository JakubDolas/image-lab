import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f1623] to-[#0b1220] p-12 shadow-2xl"
    >
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Image Lab
        </h1>

        <p className="mt-4 max-w-2xl text-slate-300 text-base md:text-lg">
          Profesjonalna konwersja i edycja obrazów.
          Szybko, lokalnie, bez zbędnych komplikacji.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/convert"
            className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-medium text-white hover:brightness-110 shadow-lg shadow-indigo-600/20"
          >
            Konwertuj obrazy
          </Link>

          <Link
            to="/editor"
            className="rounded-xl border border-white/10 bg-white/5 px-7 py-3 text-sm text-white hover:bg-white/10"
          >
            Otwórz edytor
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
    </motion.section>
  );
}
