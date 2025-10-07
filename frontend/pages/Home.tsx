import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="h-64 border rounded-2xl bg-white flex items-center justify-center text-gray-400">
        (później grafika i opis)
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <Link
          to="/convert"
          className="border rounded-xl py-4 text-center bg-white hover:shadow"
        >
          konwertuj obraz
        </Link>

        <button className="border rounded-xl py-4 bg-white text-center opacity-70 cursor-not-allowed">
          edytor online (później)
        </button>
      </div>
    </div>
  );
}
