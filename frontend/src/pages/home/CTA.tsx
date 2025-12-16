import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-36 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/25 to-indigo-500/5 p-12 text-center"
    >
      <h3 className="text-3xl font-semibold text-white">
        Wszystko, czego potrzebujesz do pracy z obrazami
      </h3>

      <p className="mt-3 text-slate-300">
        Konwersja. Edycja. AI. W jednej aplikacji.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/convert"
          className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-medium text-white hover:brightness-110"
        >
          Otwórz konwerter
        </Link>
        <Link
          to="/editor"
          className="rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-sm text-white hover:bg-white/10"
        >
          Otwórz edytor
        </Link>
      </div>
    </motion.section>
  );
}
