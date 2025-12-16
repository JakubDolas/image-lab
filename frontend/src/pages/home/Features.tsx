import { motion } from "framer-motion";

const features = [
  {
    title: "Hurtowa konwersja",
    desc: "Konwertuj wiele plików jednocześnie do PNG, JPG, WEBP i innych formatów.",
  },
  {
    title: "Precyzyjna kontrola",
    desc: "Jakość, rozmiar, proporcje — pełna kontrola nad wynikiem.",
  },
  {
  title: "Inteligentna edycja obrazu",
  desc: "Filtry, kadrowanie i narzędzia AI w jednym spójnym edytorze.",
  },
  {
    title: "Gotowe presety",
    desc: "Popularne rozdzielczości i proporcje jednym kliknięciem.",
  },
];

export default function Features() {
  return (
    <section className="mt-28 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-shadow hover:shadow-xl hover:shadow-black/20"
        >
          <div className="text-white font-semibold">
            {f.title}
          </div>
          <div className="mt-2 text-sm text-slate-400">
            {f.desc}
          </div>
        </motion.div>
      ))}
    </section>
  );
}
