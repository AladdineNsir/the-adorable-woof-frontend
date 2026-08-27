import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ValuesSection from '../components/ValuesSection';

export default function About() {

  return (
    <div className="min-h-screen bg-velora-cream pt-0 overflow-x-hidden">
      <section className="relative h-[260px] sm:h-[300px] lg:h-[320px] bg-velora-dark">
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <div className="inline-flex items-center gap-3 mb-4 justify-center">
              <div className="h-px w-6 sm:w-8 bg-velora-gold opacity-80" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-velora-gold">Notre Histoire</span>
              <div className="h-px w-6 sm:w-8 bg-velora-gold opacity-80" />
            </div>
            <h1 className="font-premium text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Pensé avec amour. Créé pour eux.</h1>
            <p className="text-white/80 text-sm sm:text-base leading-6">Des accessoires conçus avec soin pour offrir à chaque compagnon le parfait équilibre entre confort, style et qualité.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-velora-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-velora-gold">Notre Mission</span>
              </div>
              <h2 className="font-premium text-3xl sm:text-4xl font-bold text-velora-dark mb-4">
                Créer de la beauté<br />
                <span className="italic font-normal">pour vos compagnons</span>
              </h2>
              <div className="space-y-4 max-w-xl">
                <p className="text-velora-textGray text-sm sm:text-base leading-7">
Chez the aDoraBle woof company, nous créons des accessoires où l’élégance rencontre le confort. Chaque pièce est pensée avec soin pour accompagner votre compagnon au quotidien, avec une attention particulière portée à la qualité, aux détails et à la durabilité.                </p>
                <p className="text-velora-textGray text-sm sm:text-base leading-7">
Une jeune marque tunisienne, créée pour célébrer le lien unique qui nous unit à nos compagnons.                </p>
              </div>

              <div className="mt-6">
                <Link to="/shop" className="inline-flex items-center gap-2 rounded-lg px-6 py-3 border border-velora-dark/20 text-sm font-semibold text-velora-dark hover:border-velora-gold hover:text-velora-gold hover:bg-white transition-all">
                  Découvrir la collection
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="h-[280px] sm:h-[340px] md:h-[420px] rounded-2xl overflow-hidden bg-[#FCFAF7] shadow-[0_12px_40px_rgba(17,17,17,0.06)]">
                <img src="/assets/about-velora.png" alt="Fondatrice SMILEY WOOF avec son chien" className="w-full h-full object-cover" />
              </div>

<div className="absolute top-4 left-4 w-20 h-20 sm:-top-5 sm:-left-5 sm:w-32 sm:h-32 bg-velora-cream border border-velora-gold/30 rounded-xl flex flex-col items-center justify-center text-center">   
             <span className="font-premium text-lg sm:text-3xl font-bold text-velora-gold">
  2026
</span>

<span className="text-[8px] sm:text-[10px] text-velora-dark uppercase tracking-[0.12em]">
  Fondée à Nabeul
</span> 
</div>
            </motion.div>
          </div>
        </div>
      </section>

      <ValuesSection />
    </div>
  );
}

