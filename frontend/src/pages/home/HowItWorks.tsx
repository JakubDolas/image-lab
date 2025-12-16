import { motion } from "framer-motion";

const steps = [
  "Wgraj obrazy",
  "Wybierz opcje",
  "Pobierz gotowe pliki",
];

export default function HowItWorks() {
  return (
    <div className="mt-24">
      <h2 className="mb-8 text-2xl font-semibold text-white">
        Jak to działa?
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="text-indigo-400 text-sm font-medium">
              Krok {i + 1}
            </div>
            <div className="mt-2 text-white font-semibold">
              {step}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
