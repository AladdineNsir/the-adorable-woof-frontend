import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import ValuesSection from "../components/ValuesSection";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { buildResponsiveImageSet } from "../config/api";
import { trackClick } from "../analytics/analytics";

const reveal = (direction = 0, delay = 0) => ({
  initial: { opacity: 0, x: direction, y: direction ? 0 : 20 },
  whileInView: { opacity: 1, x: 0, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, delay, ease: "easeOut" },
});

export default function Home() {
  const { settings } = useSiteSettings();
  const heroImage =
    settings.home.heroImage === "/assets/d1.png"
      ? "/assets/d1-1200.webp"
      : settings.home.heroImage;
  const heroImageSet = buildResponsiveImageSet(heroImage, [480, 768, 1200], "auto");
  const collections = [
    {
      key: "harnais",
      title: "Harnais",
      image: settings.home.collections.harnais,
      href: "/shop?category=chiens&subCategory=harnais",
    },
    {
      key: "colliers",
      title: "Colliers",
      image: settings.home.collections.colliers,
      href: "/shop?category=chiens&subCategory=colliers",
    },
    {
      key: "laisses",
      title: "Laisses",
      image: settings.home.collections.laisses,
      href: "/shop?category=chiens&subCategory=laisses",
    },
  ];

  return (
    <main className="overflow-x-hidden bg-velora-cream text-velora-dark">
      <section className="bg-velora-cream py-10 sm:py-14 lg:min-h-[70vh] lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-16">
          <motion.div {...reveal(-40)} className="order-2 lg:order-1">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-velora-gold" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-velora-gold sm:text-xs">
                Une nouvelle marque tunisienne
              </span>
            </div>

            <h1 className="font-premium text-3xl font-bold leading-[1.05] sm:text-4xl md:text-5xl lg:text-6xl">
              Qualité <span className="font-normal italic text-velora-gold">premium</span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-velora-textGray sm:text-base">
              Parce qu’un compagnon n’est pas juste un animal, nous créons des
              accessoires qui allient style, confort et amour au quotidien.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-velora-gold px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-velora-goldHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velora-gold focus-visible:ring-offset-2"
              >
                Découvrir
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex min-h-11 items-center rounded-lg border border-velora-dark/20 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-velora-dark transition-colors hover:border-velora-gold hover:text-velora-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velora-gold focus-visible:ring-offset-2"
              >
                Notre histoire
              </Link>
            </div>
          </motion.div>

          <motion.div {...reveal(40, 0.08)} className="order-1 lg:order-2">
            <div className="h-[320px] overflow-hidden rounded-2xl border border-velora-gold/30 shadow-[0_18px_40px_rgba(77,54,35,0.12)] sm:h-[390px] lg:h-[460px]">
              <img
                src={heroImageSet.src}
                srcSet={heroImageSet.srcSet}
                sizes={heroImageSet.sizes}
                alt="Accessoires Velora pour animaux"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-velora-cream py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-16">
          <motion.div {...reveal()} className="mb-8 text-center sm:mb-10">
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-velora-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-velora-gold">
                Nos Collections
              </span>
              <span className="h-px w-8 bg-velora-gold" />
            </div>
            <h2 className="font-premium text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Explorez Notre Univers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, index) => (
              <motion.div key={collection.key} {...reveal(0, index * 0.08)}>
                <Link
                  to={collection.href}
                  onClick={() => trackClick("click_category", { category: collection.key })}
                  className="group relative block h-[320px] overflow-hidden rounded-[22px] border border-[#E7D8C8] bg-[#E7D8C8] shadow-[0_14px_35px_rgba(77,54,35,0.12)] transition-transform duration-300 hover:-translate-y-1 sm:h-[390px]"
                >
                  {(() => {
                    const imgMeta = buildResponsiveImageSet(collection.image, [360, 640, 960], "auto");
                    return (
                      <img
                        src={imgMeta.src}
                        srcSet={imgMeta.srcSet}
                        sizes={imgMeta.sizes}
                        alt={collection.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211710]/85 via-[#211710]/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <h3 className="font-premium text-3xl font-semibold text-white sm:text-4xl">
                      {collection.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white">
                      Découvrir la collection
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-velora-cream py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-16">
          <motion.div {...reveal()} className="mb-10 text-center md:mb-12">
            <div className="mb-4 inline-flex items-center gap-3">
              <span className="h-px w-10 bg-velora-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-velora-gold">
                Conception Premium
              </span>
              <span className="h-px w-10 bg-velora-gold" />
            </div>
            <h2 className="font-premium text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Pensé pour le <span className="font-normal italic text-velora-gold">confort</span>
            </h2>
          </motion.div>

          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">
            <motion.div {...reveal(-35)} className="flex items-center justify-center">
              <img
                src={settings.home.constructionImage}
                alt="Structure multicouche du harnais"
                loading="lazy"
                className="h-[220px] w-full object-contain transition duration-500 hover:scale-[1.03] md:h-[280px]"
              />
            </motion.div>

            <motion.div
              {...reveal(35, 0.08)}
              className="relative border-l border-velora-gold/50 pl-5 sm:pl-7"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-velora-gold">
                Une conception pensée pour eux
              </span>
              <p className="mt-4 max-w-xl text-sm leading-7 text-velora-textGray md:text-base">
                Une conception multicouche pensée pour offrir à votre compagnon
                confort, respirabilité et résistance au quotidien.
              </p>

              <div className="mt-7 space-y-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-velora-gold">
                    Tissu Oxford
                  </span>
                  <p className="mt-1 text-sm leading-6 text-velora-textGray">
                    Une couche extérieure conçue pour apporter résistance et durabilité.
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-velora-gold">
                    Air Mousse
                  </span>
                  <p className="mt-1 text-sm leading-6 text-velora-textGray">
                    Une structure alvéolée qui favorise la circulation de l’air et améliore le confort.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ValuesSection />
    </main>
  );
}
