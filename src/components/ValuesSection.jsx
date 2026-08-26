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
    <section className="w-full bg-white py-5 sm:py-6 md:py-8">
      {/* Container principal */}
      <div className="w-full px-3 sm:px-5 md:px-8 lg:px-16 xl:px-16">

        {/* =========================================
            TITRE
        ========================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-5 md:mb-6 flex justify-center"
        >
          <div className="inline-flex items-center gap-2">
            <div className="h-px w-6 sm:w-8 bg-velora-gold" />

            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-velora-gold">
              Nos Valeurs
            </span>

            <div className="h-px w-6 sm:w-8 bg-velora-gold" />
          </div>
        </motion.div>

        {/* =========================================
            CARDS
        ========================================= */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">

          {values.map((value, i) => {
            const Icon = value.icon;

            return (
              <motion.div
                key={value.title}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.1,
                }}
                className="
                  w-full
                  rounded-xl
                  border
                  border-velora-gold/20
                  px-4
                  py-5
                  sm:px-5
                  sm:py-6
                  md:p-6
                  text-center
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-velora-gold/50
                  hover:shadow-md
                "
              >

                {/* ICON */}
                <div
                  className="
                    mx-auto
                    mb-3
                    flex
                    h-10
                    w-10
                    sm:h-11
                    sm:w-11
                    md:h-12
                    md:w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-velora-gold/40
                  "
                >
                  <Icon
                    size={17}
                    className="text-velora-gold sm:size-[18px]"
                  />
                </div>

                {/* TITLE */}
                <h3
                  className="
                    mb-1
                    font-premium
                    text-sm
                    sm:text-base
                    font-bold
                    leading-snug
                    text-velora-dark
                  "
                >
                  {value.title}
                </h3>

                {/* DESCRIPTION */}
                <p
                  className="
                    mx-auto
                    max-w-[280px]
                    text-xs
                    sm:text-sm
                    leading-relaxed
                    text-velora-textGray
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