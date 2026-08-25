import { Clock3, Sparkles } from "lucide-react";

export default function Customization() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] pt-8 pb-4">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-3xl mx-auto text-center">

          <div className="inline-flex items-center gap-3 justify-center">

            <div className="h-px w-14 bg-velora-gold" />

            <span className="text-[11px] font-semibold tracking-widest uppercase text-velora-gold">

              Personnalisation

            </span>

            <div className="h-px w-14 bg-velora-gold" />

          </div>

          <h1 className="mt-5 font-premium text-4xl font-bold text-velora-dark">

            Bientôt disponible

          </h1>

          <p className="mt-5 text-sm leading-7 text-velora-textGray">

            Nous préparons actuellement notre service de personnalisation afin de vous permettre de créer des accessoires uniques pour votre compagnon. Cette fonctionnalité sera bientôt disponible.

          </p>

        </div>

        <div className="mt-14 max-w-3xl mx-auto rounded-sm border border-[#E7DED2] bg-white p-10 shadow-sm">

          <div className="flex justify-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F5EF]">

              <Clock3
                size={36}
                className="text-velora-gold"
              />

            </div>

          </div>

          <h2 className="mt-8 text-center font-premium text-2xl font-bold text-velora-dark">

            Cette fonctionnalité arrive prochainement

          </h2>

          

         

        </div>

      </div>

    </div>
  );
}