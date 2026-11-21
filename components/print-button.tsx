"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm font-medium transition hover:border-foreground"
    >
      Print / save PDF
    </button>
  );
}
