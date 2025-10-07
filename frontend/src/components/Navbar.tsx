import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-800">Image Lab</Link>
        <nav className="flex gap-4 text-sm">
          <NavLink to="/" className="text-gray-600" end>Start</NavLink>
          <NavLink to="/convert" className="text-gray-600">Konwertuj</NavLink>
        </nav>
      </div>
    </div>
  );
}
