export function BusyOverlay() {
  return (
    <div className="
      absolute inset-0
      backdrop-blur-sm
      bg-black/40
      flex items-center justify-center
      z-50
      animate-fadeIn
    ">
      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );
}
