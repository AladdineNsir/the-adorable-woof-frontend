import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import ValuesSection from "../components/ValuesSection";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { buildResponsiveImageSet, resolveAssetUrl } from "../config/api";
import { trackClick } from "../analytics/analytics";
import { getPacks } from "../services/packApi";

const reveal = (direction = 0, delay = 0) => ({
  initial: { opacity: 0, x: direction, y: direction ? 0 : 20 },
  whileInView: { opacity: 1, x: 0, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, delay, ease: "easeOut" },
});

export default function Home() {
  const { settings } = useSiteSettings();
  const [packs, setPacks] = useState([]);
  const [packImageIndices, setPackImageIndices] = useState({});
  const selectedFeaturedPack = settings.home.featuredPack || "";
  const heroImage =
    settings.home.heroImage === "/assets/d1.png"
      ? "/assets/d1-1200.webp"
      : settings.home.heroImage;
  const heroImageSet =
    heroImage === "/assets/d1-1200.webp"
      ? {
          src: heroImage,
          srcSet: "/assets/d1-768.webp 768w, /assets/d1-1200.webp 1200w",
          sizes: "(max-width: 640px) calc(100vw - 2rem), 50vw",
        }
      : buildResponsiveImageSet(heroImage, [480, 768, 1200], "auto");
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

  useEffect(() => {
    let isMounted = true;

    getPacks()
      .then((data) => {
        if (isMounted) setPacks(Array.isArray(data?.packs) ? data.packs : []);
      })
      .catch((error) => {
        console.error("Erreur chargement des packs sur la Home:", error);
        if (isMounted) setPacks([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visiblePacks =
    selectedFeaturedPack === "__none__"
      ? []
      : selectedFeaturedPack
        ? packs.filter(
            (pack) =>
              String(pack._id || pack.slug) === String(selectedFeaturedPack)
              && pack.available !== false
              && Number(pack.stock ?? 0) > 0
          )
        : packs.filter(
            (pack) => pack.available !== false && Number(pack.stock ?? 0) > 0
          );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPackImageIndices((currentIndices) => {
        const nextIndices = { ...currentIndices };

        packs.forEach((pack) => {
          const imageCount = pack.images?.length || (pack.image ? 1 : 0);
          if (imageCount > 1) {
            const packKey = String(pack._id || pack.slug);
            nextIndices[packKey] = ((currentIndices[packKey] || 0) + 1) % imageCount;
          }
        });

        return nextIndices;
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [packs]);

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
              accessoires qui réunissent style, confort et amour au quotidien.
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

    {visiblePacks.length > 0 && (
  <section className="bg-velora-cream py-10 sm:py-14 lg:py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-16">

      {/* SECTION HEADER */}
      <motion.div
        {...reveal()}
        className="mb-8 text-center sm:mb-10"
      >
        <div className="mb-3 inline-flex items-center gap-2">
          <span className="h-px w-8 bg-velora-gold" />

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-velora-gold">
            La signature The Adorable Woof
          </span>

          <span className="h-px w-8 bg-velora-gold" />
        </div>

        <h2 className="font-premium text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Tout ce qu’il faut, en harmonie.
        </h2>
      </motion.div>

      {/* PACKS */}
      <div className="space-y-5">
        {visiblePacks.map((pack, index) => {
          const packKey = String(pack._id || pack.slug);
          const packImages = (pack.images?.length ? pack.images : [pack.image])
            .filter(Boolean)
            .map((packImage) => resolveAssetUrl(packImage))
            .filter(Boolean);
          const image =
            packImages[packImageIndices[packKey] % packImages.length] ||
            resolveAssetUrl(pack.image) ||
            settings.home.collections.harnais;

          const imageSet = buildResponsiveImageSet(
            image,
            [360, 640, 960],
            "auto"
          );

          const price =
            pack.pricePreview?.final ??
            pack.pricePreview?.[pack.preferredSize]?.final ??
            0;

          const discountPercentage =
            pack.discountType === "percentage"
              ? Math.floor(Number(pack.discountValue || 0))
              : 0;

          const componentNames = (pack.components || [])
            .map((component) => component.product?.name)
            .filter(Boolean)
            .join(" + ");

          return (
            <motion.div
              key={pack._id || pack.slug}
              {...reveal(0, index * 0.08)}
            >
              <Link
                to={`/pack/${pack.slug || pack._id}`}
                onClick={() =>
                  trackClick("click_pack_home", {
                    pack: pack.slug || pack._id,
                  })
                }
                className="
                  group relative block
                  min-h-[330px] w-full
                  overflow-hidden
                  rounded-[22px]
                  border border-[#E7D8C8]
                  bg-[#FAF7F2]
                  shadow-[0_14px_35px_rgba(77,54,35,0.10)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_18px_42px_rgba(77,54,35,0.14)]
                  sm:min-h-[370px]
                "
              >
                {discountPercentage > 0 && (
                  <span className="absolute left-4 top-4 z-20 rounded-md bg-[#9B2C2C] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-sm sm:left-auto sm:right-4">
                    -{discountPercentage} %
                  </span>
                )}

                {/* =====================================================
                    IMAGE
                ====================================================== */}
                <div
                  className="
                    relative h-[250px]
                    w-full
                    overflow-hidden
                    sm:absolute sm:inset-y-0 sm:right-0 sm:h-auto
                    sm:w-[58%]
                  "
                >
                  <img
                    src={imageSet.src}
                    srcSet={imageSet.srcSet}
                    sizes={imageSet.sizes}
                    alt={pack.name || "Pack"}
                    loading="lazy"
                    className="
                      h-full w-full
                      object-cover
                      object-center
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.035]
                      sm:object-[center_right]
                    "
                  />

                  {/* 
                    1. DARK WARM GRADIENT
                    Smooth from top -> bottom
                  */}
                  <div
                    className="
                      pointer-events-none
                      absolute inset-0
                    "
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(64,58,53,0) 0%, rgba(64,58,53,0.02) 38%, rgba(64,58,53,0.16) 58%, rgba(64,58,53,0.48) 78%, rgba(64,58,53,0.78) 100%)",
                    }}
                  />

                  {/*
                    2. SOFT HORIZONTAL BLEND
                    Removes the hard border between cream and image.
                  */}
                  <div
                    className="
                      pointer-events-none
                      absolute inset-y-0 left-0
                      w-[38%]
                      sm:w-[34%]
                    "
                    style={{
                      background:
                        "linear-gradient(to right, rgba(250,247,242,1) 0%, rgba(250,247,242,0.88) 18%, rgba(250,247,242,0.45) 48%, rgba(250,247,242,0) 100%)",
                    }}
                  />
                </div>

                {/* =====================================================
                    CONTENT
                ====================================================== */}
                <div
                  className="
                    relative z-10
                    flex min-h-0
                    w-full
                    flex-col
                    justify-between
                    p-5
                    sm:min-h-[370px]
                    sm:max-w-[58%]
                    sm:p-8
                    lg:p-10
                  "
                >

                  {/* TOP */}
                  <div>

                    {/* LABEL */}
                    <div className="flex items-center gap-4">
                      <p
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.24em]
                          text-velora-gold
                          sm:text-xs
                        "
                      >
                        Pack Signature
                      </p>

                      <span className="h-px w-10 bg-velora-gold sm:w-14" />
                    </div>

                    {/* TITLE */}
                    <h6
  className="
    mt-4
    max-w-2xl
    font-premium
    text-2xl
    leading-[0.98]
    text-velora-dark
    sm:text-3xl
    lg:text-4xl
  "
>
  {pack.name}
</h6>

                    {/* DISCOUNT */}
                    {discountPercentage > 0 && (
                      <div className="mt-3 flex items-baseline gap-2 whitespace-nowrap">
                        <span className="text-sm text-[#9B2C2C] sm:text-base">
                          Remise exclusive
                        </span>

                        <span className="text-sm font-bold text-[#9B2C2C] sm:text-base">
                          -{discountPercentage} %
                        </span>
                      </div>
                    )}

                    {/* COMPONENTS */}
                    <p
                      className="
                        mt-4
                        max-w-xl
                        text-sm
                        leading-6
                        text-velora-dark
                        sm:text-base
                        lg:text-lg
                      "
                    >
                      {componentNames || "Harnais + Collier + Laisse"}
                    </p>

                    {/* DESCRIPTION */}
                    <p
                      className="
                        mt-2
                        max-w-md
                        text-xs
                        italic
                        leading-5
                        text-velora-textGray
                        sm:text-sm
                      "
                    >
                      {pack.description ||
                        "L’essentiel pour des promenades tout en harmonie."}
                    </p>
                  </div>

                  {/* =====================================================
                      BOTTOM
                  ====================================================== */}
                  <div
                    className="
                      mt-8
                      flex
                      flex-col
                      gap-4
                      sm:flex-row
                      sm:items-end
                      sm:justify-between
                    "
                  >

                    {/* BUTTON */}
                    <span
                      className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        gap-3
                        rounded-[16px]
                        bg-velora-gold
                        px-5
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-white
                        shadow-[0_8px_20px_rgba(196,82,17,0.18)]
                        transition-all
                        duration-300
                        group-hover:bg-velora-goldHover
                        group-hover:shadow-[0_10px_24px_rgba(196,82,17,0.25)]
                        sm:px-7
                        sm:text-xs
                      "
                    >
                      Découvrir le pack

                      <ArrowRight
                        size={18}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </span>
                  </div>
                </div>

                {/* =====================================================
                    MOBILE OVERLAY
                    Keeps the image visible but maintains readability.
                ====================================================== */}
                <div
                  className="
                    pointer-events-none
                    absolute inset-0
                    z-[2]
                    bg-gradient-to-t
                    from-[#211710]/10
                    via-transparent
                    to-transparent
                    sm:hidden
                  "
                />

              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
)}

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
                confort, respirabilité et résistance, pour l’accompagner agréablement au quotidien.
              </p>

              <div className="mt-7 space-y-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-velora-gold">
                    COUCHE EXTÉRIEURE
                  </span>
                  <p className="mt-1 text-sm leading-6 text-velora-textGray">
                    <strong>Résistant • Durable • Facile à entretenir</strong>
                    <br />
                    Un tissu robuste conçu pour résister à l’usage quotidien, tout en gardant un aspect soigné et un imprimé qui attire le regard.
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-velora-gold">
                    COUCHE CONFORT
                  </span>
                  <p className="mt-1 text-sm leading-6 text-velora-textGray">
                    <strong>Douceur • Confort • Protection</strong>
                    <br />
                    Une couche souple qui apporte plus de douceur au contact du corps et contribue à limiter les frottements pendant les promenades.
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-velora-gold">
                    COUCHE RESPIRANTE
                  </span>
                  <p className="mt-1 text-sm leading-6 text-velora-textGray">
                    <strong>Respirabilité • Légèreté • Confort</strong>
                    <br />
                    Sa structure alvéolée favorise la circulation de l’air et offre une sensation plus légère et respirante, pour un confort optimal au quotidien.
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
