import { motion } from "framer-motion";
import {
  Sliders,
  Crop,
  Brush,
  Undo2,
  Sparkles,
} from "lucide-react";

const ITEMS = [
  {
    icon: Sliders,
    title: "Filtry i kolory",
    desc: "Reguluj jasność, kontrast, nasycenie i efekty w czasie rzeczywistym.",
  },
  {
    icon: Brush,
    title: "Rysowanie po obrazie",
    desc: "Rysuj i zaznaczaj elementy bezpośrednio na zdjęciu.",
  },
  {
    icon: Crop,
    title: "Kadrowanie",
    desc: "Precyzyjne proporcje i szybkie przycinanie.",
  },
  {
    icon: Undo2,
    title: "Historia zmian",
    desc: "Cofaj i ponawiaj każdą operację bez utraty jakości.",
  },
  {
    icon: Sparkles,
    title: "Narzędzia AI",
    desc: "Usuwanie tła i powiększanie obrazu jednym kliknięciem.",
  },
];

export default function EditorShowcase() {
  return (
    <section className="mt-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-semibold text-white text-center"
      >
        Zaawansowany edytor zdjęć
      </motion.h2>

      <p className="mt-4 text-center text-slate-400 max-w-2xl mx-auto">
        Wszystkie narzędzia, których potrzebujesz — bez instalowania czegokolwiek.
      </p>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
            >
              <div className="mb-4 inline-flex rounded-xl bg-indigo-500/10 p-3">
                <Icon className="h-6 w-6 text-indigo-400" />
              </div>

              <h3 className="text-lg font-medium text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
