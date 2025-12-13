import { motion, AnimatePresence } from "framer-motion";

export function ErrorAlert({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-3 rounded-xl border border-red-500/40 bg-red-500/20 px-4 py-2 text-red-300 shadow-lg backdrop-blur-md"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
