import QuoteForm from "./QuoteForm";

export default function QuoteSection() {
  return (
    <section id="devis" className="bg-[var(--navy-deep)] relative">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:pt-14 lg:pb-0 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight">
            Demandez votre devis
          </h2>
          <p className="text-[#cfd6e0] mt-4 leading-relaxed max-w-md">
            Décrivez votre besoin — transport, location d&apos;engins ou
            travaux de construction — et notre équipe vous revient avec une
            estimation adaptée au terrain centrafricain.
          </p>
        </div>

        <div className="relative z-10 bg-[#F5F2EC] p-8 md:p-10 shadow-2xl lg:translate-y-28">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
