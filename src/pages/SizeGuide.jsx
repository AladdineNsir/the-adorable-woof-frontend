import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ValuesSection from "../components/ValuesSection";
import { Ruler, CircleDot, Weight, Tag, Heart } from "lucide-react";

const dogCollarSizes = [
  
  {
    size: "XS",
    neck: "22 - 30 cm",
    
  },
  {
    size: "S",
    neck: "28 - 44 cm",
  },
  {
    size: "M",
    neck: "32 - 50 cm",
  },
  {
    size: "L",
    neck: "41 - 66 cm",
  },
 
];

const dogSizes = [
   {
    size: "XXS",
    neck: "18 - 29 cm",
    chest: "26 - 45 cm",
  },
  {
    size: "XS",
    neck: "24 - 32 cm",
    chest: "27 - 50 cm",
  },
  {
    size: "S",
    neck: "29 - 42 cm",
    chest: "36 - 60 cm",
  },
  {
    size: "M",
    neck: "35 - 47 cm",
    chest: "41 - 71 cm",
  },
  {
    size: "L",
    neck: "40 - 56 cm",
    chest: "56  - 84 cm",
  },
  {
    size: "XL",
    neck: "46 - 78 cm",
    chest: "65 - 105 cm",
  },
];

const catSizes = [
  {
    size: "XS",
    neck: "16 - 18 cm",
    chest: "24 - 30 cm",
    weight: "1 - 2 kg",
  },
  {
    size: "S",
    neck: "19 - 23 cm",
    chest: "31 - 38 cm",
    weight: "2 - 5 kg",
  },
];

export default function SizeGuide() {
  useEffect(() => {
    document.title = "Guide des tailles | The aDoraBLe Woof";
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3EC] pt-8 sm:pt-10 lg:pt-0 pb-0 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-16 xl:px-16 space-y-10 lg:space-y-14">
        <section className="relative h-[260px] sm:h-[300px] lg:h-[320px] overflow-hidden bg-velora-cream">
  {/* Image très transparente */}
  <img
    src="/assets/har.png"
    alt="Guide des tailles"
    className="absolute inset-0 w-full h-full object-cover opacity-[0.15]"
  />

  {/* Léger voile crème pour adoucir encore l'image */}
  <div className="absolute inset-0 bg-velora-cream/40" />

  {/* Contenu */}
  <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-3xl text-center"
    >
      <div className="inline-flex items-center gap-3 mb-4 justify-center">
        <div className="h-px w-6 sm:w-8 bg-velora-gold opacity-80" />

        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-velora-gold">NOTRE GUIDE</span>

        <div className="h-px w-6 sm:w-8 bg-velora-gold opacity-80" />
      </div>

      <h1 className="mb-2 font-premium text-2xl font-bold text-velora-dark sm:text-3xl lg:text-4xl">
Trouvez sa taille idéale
      </h1>

      <p className="mx-auto max-w-2xl text-sm sm:text-base leading-6 text-velora-dark/60">
       Quelques mesures suffisent pour garantir confort, liberté de mouvement et ajustement parfait.
      </p>
    </motion.div>
  </div>
</section>


{/* ==================== GUIDE DES TAILLES ==================== */}
<div className="space-y-7">

  {/* ==================== CHIENS ==================== */}
  {/* <section className="space-y-3">

    <div>
      <h2 className="font-premium text-lg sm:text-xl font-bold text-black">
  Tailles pour chiens
</h2>

      
    </div>

    <div className="overflow-x-auto">
      <div className="min-w-[540px] overflow-hidden rounded-lg border border-[#E8DED1] bg-white">

        <table className="w-full border-collapse text-left">

          <thead className="bg-[#FCFAF7]">
            <tr className="border-b border-[#E8DED1]">

              <th className="px-4 py-2.5 sm:px-5">
                <div className="flex items-center gap-1.5">
                  <Tag
                    size={15}
                    strokeWidth={1.8}
                    className="text-velora-gold"
                  />
                  <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-velora-dark">
                    Taille
                  </span>
                </div>
              </th>

              <th className="px-4 py-2.5 sm:px-5">
                <div className="flex items-center gap-1.5">
                  <CircleDot
                    size={15}
                    strokeWidth={1.8}
                    className="text-velora-gold"
                  />
                  <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-velora-dark">
                    Tour de cou
                  </span>
                </div>
              </th>

              <th className="px-4 py-2.5 sm:px-5">
                <div className="flex items-center gap-1.5">
                  <Ruler
                    size={15}
                    strokeWidth={1.8}
                    className="text-velora-gold"
                  />
                  <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-velora-dark">
                    Tour de poitrine
                  </span>
                </div>
              </th>

              <th className="px-4 py-2.5 sm:px-5">
                <div className="flex items-center gap-1.5">
                  <Weight
                    size={15}
                    strokeWidth={1.8}
                    className="text-velora-gold"
                  />
                  <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-velora-dark">
                    Poids
                  </span>
                </div>
              </th>

            </tr>
          </thead>

          <tbody>
            {dogSizes.map((dog, index) => (
              <tr
                key={dog.size}
                className={
  index < dogSizes.length - 1
    ? "border-b border-[#EFE7DC]"
    : ""
}
              >

                <td className="px-4 py-3 sm:px-5">
                  <span className="inline-flex h-7 min-w-[34px] items-center justify-center rounded-md bg-velora-gold px-2 text-[11px] font-bold text-white">
                    {dog.size}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs text-velora-dark sm:px-5">
                  {dog.neck}
                </td>

                <td className="px-4 py-3 text-xs text-velora-dark sm:px-5">
                  {dog.chest}
                </td>

                <td className="px-4 py-3 text-xs font-medium text-velora-dark sm:px-5">
                  {dog.weight}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  </section> */}
  {/* ==================== CHIENS ==================== */}

  {/* =========================================================
      HARNAIS
  ========================================================= */}
  {/* =========================================================
    HARNAIS
========================================================= */}
<section className="space-y-3">

  <div className="text-center">
  <h2 className="font-premium text-lg sm:text-xl font-normal tracking-tight text-[#3A3A3A]">
    Tailles pour chiens — Harnais
  </h2>
</div>

  <div className="overflow-x-auto">
<div className="mx-auto w-full max-w-[650px] overflow-hidden rounded-lg border border-[#E8DED1] bg-white">
      <table className="w-full border-collapse text-left">

        {/* Header */}
        <thead className="bg-[#FCFAF7]">
          <tr className="border-b border-[#E8DED1]">

            {/* Taille */}
            <th className="w-[18%] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-1.5">
                <Tag
                  size={15}
                  strokeWidth={1.8}
                  className="text-black"
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-black">
                  Taille
                </span>
              </div>
            </th>

            {/* Tour de cou */}
            <th className="w-[27%] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-1.5">
                <CircleDot
                  size={15}
                  strokeWidth={1.8}
                  className="text-black"
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-black">
                  Tour de cou
                </span>
              </div>
            </th>

            {/* Tour de poitrine */}
            <th className="w-[35%] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-1.5">
                <Ruler
                  size={15}
                  strokeWidth={1.8}
                  className="text-black"
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-black">
                  Tour de poitrine
                </span>
              </div>
            </th>

            {/* Poids */}
            {/* <th className="w-[20%] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-1.5">
                <Weight
                  size={15}
                  strokeWidth={1.8}
                  className="text-black"
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-black">
                  Poids
                </span>
              </div>
            </th> */}

          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {dogSizes.map((dog, index) => (
            <tr
              key={dog.size}
              className={
                index < dogSizes.length - 1
                  ? "border-b border-[#EFE7DC]"
                  : ""
              }
            >

              {/* Taille */}
              <td className="px-4 py-3 sm:px-5">
                <span className="inline-flex h-7 min-w-[34px] items-center justify-center rounded-md bg-black px-2 text-[11px] font-bold text-white">
                  {dog.size}
                </span>
              </td>

              {/* Cou */}
              <td className="px-4 py-3 text-xs text-black sm:px-5">
                {dog.neck}
              </td>

              {/* Poitrine */}
              <td className="px-4 py-3 text-xs text-black sm:px-5">
                {dog.chest}
              </td>

              {/* Poids */}
              {/* <td className="px-4 py-3 text-xs font-medium text-black sm:px-5">
                {dog.weight}
              </td> */}

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  </div>

</section>



  {/* =========================================================
    COLLIER
========================================================= */}

{/* =========================================================
    COLLIER
========================================================= */}
<section className="space-y-2">

  <h2 className="text-center font-premium text-lg sm:text-xl font-normal tracking-tight text-[#3A3A3A]">
    Tailles pour chiens — Colliers
  </h2>

  <div className="overflow-x-auto">
    <div className="mx-auto w-full max-w-[650px] overflow-hidden rounded-lg border border-[#E8DED1] bg-white">

      <table className="w-full border-collapse text-left">

        <thead className="bg-[#FCFAF7]">
          <tr className="border-b border-[#E8DED1]">

            <th className="w-[40%] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-1.5">
                <Tag
                  size={15}
                  strokeWidth={1.8}
                  className="text-black"
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-black">
                  Taille
                </span>
              </div>
            </th>

            <th className="w-[60%] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-1.5">
                <CircleDot
                  size={15}
                  strokeWidth={1.8}
                  className="text-black"
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-black">
                  Tour de cou
                </span>
              </div>
            </th>

          </tr>
        </thead>

        <tbody>
          {dogCollarSizes.map((collar, index) => (
            <tr
              key={collar.size}
              className={
                index < dogCollarSizes.length - 1
                  ? "border-b border-[#EFE7DC]"
                  : ""
              }
            >
              <td className="px-4 py-3 sm:px-5">
                <span className="inline-flex h-7 min-w-[34px] items-center justify-center rounded-md bg-black px-2 text-[11px] font-bold text-white">
                  {collar.size}
                </span>
              </td>

              <td className="px-4 py-3 text-xs text-black sm:px-5">
                {collar.neck}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  </div>

</section>

  {/* ==================== CHATS ==================== */}
  {/* <section className="space-y-3">

    <div>
      <h2 className="font-premium text-lg sm:text-xl font-bold text-black">
  Tailles pour chats
</h2>

      
    </div>

    <div className="overflow-x-auto">
      <div className="min-w-[540px] overflow-hidden rounded-lg border border-[#E8DED1] bg-white">

        <table className="w-full border-collapse text-left">

          <thead className="bg-[#FCFAF7]">
            <tr className="border-b border-[#E8DED1]">

              <th className="px-4 py-2.5 sm:px-5">
                <div className="flex items-center gap-1.5">
                  <Tag
                    size={15}
                    strokeWidth={1.8}
                    className="text-velora-gold"
                  />
                  <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-velora-dark">
                    Taille
                  </span>
                </div>
              </th>

              <th className="px-4 py-2.5 sm:px-5">
                <div className="flex items-center gap-1.5">
                  <CircleDot
                    size={15}
                    strokeWidth={1.8}
                    className="text-velora-gold"
                  />
                  <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-velora-dark">
                    Tour de cou
                  </span>
                </div>
              </th>

              <th className="px-4 py-2.5 sm:px-5">
                <div className="flex items-center gap-1.5">
                  <Ruler
                    size={15}
                    strokeWidth={1.8}
                    className="text-velora-gold"
                  />
                  <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-velora-dark">
                    Tour de poitrine
                  </span>
                </div>
              </th>

              <th className="px-4 py-2.5 sm:px-5">
                <div className="flex items-center gap-1.5">
                  <Weight
                    size={15}
                    strokeWidth={1.8}
                    className="text-velora-gold"
                  />
                  <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-velora-dark">
                    Poids
                  </span>
                </div>
              </th>

            </tr>
          </thead>

          <tbody>
            {catSizes.map((cat, index) => (
              <tr
                key={cat.size}
 className={
  index < dogSizes.length - 1
    ? "border-b border-[#EFE7DC]"
    : ""
}
              >

                <td className="px-4 py-3 sm:px-5">
                  <span className="inline-flex h-7 min-w-[34px] items-center justify-center rounded-md bg-velora-gold px-2 text-[11px] font-bold text-white">
                    {cat.size}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs text-velora-dark sm:px-5">
                  {cat.neck}
                </td>

                <td className="px-4 py-3 text-xs text-velora-dark sm:px-5">
                  {cat.chest}
                </td>

                <td className="px-4 py-3 text-xs font-medium text-velora-dark sm:px-5">
                  {cat.weight}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  </section> */}



</div>  

        {/* Advice */}
        {/* <section>
          <div className="rounded-xl border border-[#E8DED1] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(17,17,17,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-velora-gold">Conseil </p>
            <h3 className="mt-3 font-premium text-2xl sm:text-3xl font-bold text-velora-dark">Le confort avant tout</h3>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-velora-textGray">
              Si votre compagnon est entre deux tailles, choisissez la taille supérieure pour garantir un ajustement confortable sans serrer.
            </p>

            <div className="mt-6 grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div className="rounded-xl bg-[#FCFAF7] border border-[#EFE7DC] p-4 text-sm text-velora-dark">
                <span className="mr-2 font-bold text-velora-gold">✓</span>Laissez deux doigts entre le collier et la peau.
              </div>
              <div className="rounded-xl bg-[#FCFAF7] border border-[#EFE7DC] p-4 text-sm text-velora-dark">
                <span className="mr-2 font-bold text-velora-gold">✓</span>Mesurez votre animal lorsqu’il est debout.
              </div>
              <div className="rounded-xl bg-[#FCFAF7] border border-[#EFE7DC] p-4 text-sm text-velora-dark">
                <span className="mr-2 font-bold text-velora-gold">✓</span>Vérifiez les mesures avant chaque commande.
              </div>
              <div className="rounded-xl bg-[#FCFAF7] border border-[#EFE7DC] p-4 text-sm text-velora-dark">
                <span className="mr-2 font-bold text-velora-gold">✓</span>Prévoir une petite marge pour les chiots.
              </div>
            </div>
          </div>
        </section> */}

      </div>

      <div className="mt-8">
        <ValuesSection />
      </div>
    </div>
  );
}