export default function ToggleButton({ on, disabled, onToggle, ariaLabel }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={on}
      className={`relative h-7 w-12 shrink-0 rounded-full border border-white/10 transition ${
        on ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.45)]" : "bg-slate-700"
      } ${disabled ? "cursor-not-allowed opacity-45" : "hover:brightness-110"}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
          on ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}
