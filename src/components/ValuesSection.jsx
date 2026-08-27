// import React from "react";
// import { motion } from "framer-motion";
// import {
//   BadgeCheck,
//   Wind,
//   Sparkles,
//   MapPin,
// } from "lucide-react";

// export default function ValuesSection() {
//   const values = [
//     {
//       icon: BadgeCheck,
//       title: "Qualité premium",
//       desc: "Des matériaux sélectionnés pour leur résistance et leur qualité.",
//     },
//     {
//       icon: Wind,
//       title: "Confort & respirabilité",
//       desc: "Air Mesh respirant pour accompagner votre chien avec confort.",
//     },
//     {
//       icon: Sparkles,
//       title: "Design original",
//       desc: "Des créations pensées pour un style unique à chaque promenade.",
//     },
//     {
//       icon: MapPin,
//       title: "Fabriqué en Tunisie",
//       desc: "Confectionné avec soin par nos artisans en Tunisie.",
//     },
//   ];

//   return (
//     <section className="w-full bg-white py-3 sm:py-6 md:py-8">

//       <div className="w-full px-2.5 sm:px-5 md:px-8 lg:px-16">

//         {/* TITRE */}
//         <motion.div
//           initial={{ opacity: 0, y: 15 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//           className="mb-3 sm:mb-5 md:mb-6 flex justify-center"
//         >
//           <div className="inline-flex items-center gap-1.5 sm:gap-2">
//             <div className="h-px w-5 sm:w-8 bg-velora-gold" />

//             <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-velora-gold">
//               Nos Valeurs
//             </span>

//             <div className="h-px w-5 sm:w-8 bg-velora-gold" />
//           </div>
//         </motion.div>

//         {/* CARDS */}
//         <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">

//           {values.map((value, i) => {
//             const Icon = value.icon;

//             return (
//               <motion.div
//                 key={value.title}
//                 initial={{
//                   opacity: 0,
//                   y: 15,
//                 }}
//                 whileInView={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 viewport={{
//                   once: true,
//                 }}
//                 transition={{
//                   duration: 0.35,
//                   delay: i * 0.08,
//                 }}
//                 className="
//                   w-full
//                   rounded-lg
//                   border
//                   border-velora-gold/20
//                   px-3
//                   py-2.5
//                   sm:px-5
//                   sm:py-5
//                   md:p-6
//                   text-center
//                   transition-all
//                   duration-300
//                   hover:-translate-y-1
//                   hover:border-velora-gold/50
//                   hover:shadow-md
//                 "
//               >

//                 {/* ICON */}
//                 <div
//                   className="
//                     mx-auto
//                     mb-1.5
//                     flex
//                     h-7
//                     w-7
//                     sm:mb-3
//                     sm:h-10
//                     sm:w-10
//                     md:h-12
//                     md:w-12
//                     items-center
//                     justify-center
//                     rounded-full
//                     border
//                     border-velora-gold/40
//                   "
//                 >
//                   <Icon
//                     size={13}
//                     className="text-velora-gold sm:size-[17px] md:size-[18px]"
//                   />
//                 </div>

//                 {/* TITLE */}
//                 <h3
//                   className="
//                     mb-0.5
//                     font-premium
//                     text-[11px]
//                     sm:mb-1
//                     sm:text-sm
//                     md:text-base
//                     font-bold
//                     leading-tight
//                     text-velora-dark
//                   "
//                 >
//                   {value.title}
//                 </h3>

//                 {/* DESCRIPTION */}
//                 <p
//                   className="
//                     mx-auto
//                     max-w-[260px]
//                     text-[9px]
//                     sm:text-xs
//                     md:text-sm
//                     leading-[1.35]
//                     text-velora-textGray
//                   "
//                 >
//                   {value.desc}
//                 </p>

//               </motion.div>
//             );
//           })}

//         </div>
//       </div>
//     </section>
//   );
// }
import React from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Wind,
  Sparkles,
  MapPin,
} from "lucide-react";

export default function ValuesSection() {
  const values = [
    {
      icon: BadgeCheck,
      title: "Qualité premium",
      desc: "Des matériaux sélectionnés pour leur résistance et leur qualité.",
    },
    {
      icon: Wind,
      title: "Confort & respirabilité",
      desc: "Air Mesh respirant pour accompagner votre chien avec confort.",
    },
    {
      icon: Sparkles,
      title: "Design original",
      desc: "Des créations pensées pour un style unique à chaque promenade.",
    },
    {
      icon: MapPin,
      title: "Fabriqué en Tunisie",
      desc: "Confectionné avec soin par nos artisans en Tunisie.",
    },
  ];

  return (
    <section className="w-full bg-white py-3 sm:py-6 md:py-8">
      <div className="w-full px-2.5 sm:px-5 md:px-8 lg:px-16">

        {/* =========================================
            TITRE
        ========================================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 flex justify-center sm:mb-5 md:mb-6"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2">
            <div className="h-px w-5 sm:w-8 bg-velora-gold" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-velora-gold sm:text-xs">
              Nos Valeurs
            </span>

            <div className="h-px w-5 sm:w-8 bg-velora-gold" />
          </div>
        </motion.div>

        {/* =========================================
            CARDS
            Mobile   : 2 × 2
            Tablet   : 2 × 2
            Desktop  : 4 × 1
        ========================================= */}
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">

          {values.map((value, i) => {
            const Icon = value.icon;

            return (
              <motion.div
                key={value.title}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.08,
                }}
                className="
                  w-full
                  rounded-lg
                  border
                  border-velora-gold/20
                  px-2
                  py-3
                  text-center
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-velora-gold/50
                  hover:shadow-md

                  sm:px-5
                  sm:py-5

                  md:p-6
                "
              >

                {/* =========================================
                    ICON
                ========================================= */}
                <div
                  className="
                    mx-auto
                    mb-2
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-velora-gold/40

                    sm:mb-3
                    sm:h-10
                    sm:w-10

                    md:h-12
                    md:w-12
                  "
                >
                  <Icon
                    size={14}
                    className="text-velora-gold sm:size-[17px] md:size-[18px]"
                  />
                </div>

                {/* =========================================
                    TITRE
                ========================================= */}
                <h3
                  className="
                    mb-1
                    font-premium
                    text-[11px]
                    font-bold
                    leading-tight
                    text-velora-dark

                    sm:text-sm

                    md:text-base
                  "
                >
                  {value.title}
                </h3>

                {/* =========================================
                    DESCRIPTION
                ========================================= */}
                <p
                  className="
                    mx-auto
                    max-w-[260px]
                    text-[9px]
                    leading-[1.35]
                    text-velora-textGray

                    sm:text-xs

                    md:text-sm
                  "
                >
                  {value.desc}
                </p>

              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}