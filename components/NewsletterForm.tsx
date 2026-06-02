"use client";

export default function NewsletterForm() {
  return (
    <div
      className="flex flex-col gap-2.5 w-full max-w-[420px]"
      aria-label="Newsletter — bientôt disponible"
    >
      <p className="m-0 text-[13px] font-semibold text-gray-800">
        Newsletter — bientôt disponible
      </p>
      <p className="m-0 text-xs text-gray-500 leading-relaxed">
        L&apos;inscription par email arrive prochainement. En attendant, suivez les nouveaux articles sur le blog.
      </p>
      <div className="flex gap-2 w-full opacity-55">
        <input
          type="email"
          placeholder="Votre email…"
          disabled
          aria-disabled="true"
          className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 text-[13px] outline-none cursor-not-allowed"
        />
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="px-5 py-2.5 rounded-xl bg-orange-400 border-none text-white/90 font-bold text-[13px] cursor-not-allowed"
        >
          Bientôt
        </button>
      </div>
    </div>
  );
}
