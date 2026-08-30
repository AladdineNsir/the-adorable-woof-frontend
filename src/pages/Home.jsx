import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from 'framer-motion';
import { getProducts } from "../admin/services/productApi";
import ProductCard from '../components/ProductCard';
import ValuesSection from '../components/ValuesSection';

const ITEMS_PER_PAGE = 8;

export default function Home() {
    const navigate = useNavigate();
    const [dogImage, setDogImage] = useState("/assets/chow.png");
const [catImage, setCatImage] = useState("/assets/mlahwa9.png");

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const fetchedProducts = Array.isArray(data) ? data : data.products || [];
        setProducts(fetchedProducts);
        setCurrentPage(1);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const specialProducts = products.filter((product) => product?.badge === "special");
  const newProducts = products.filter((product) => product?.badge === "new");

  const renderHomeProductCard = (product) => {
    const productId = product.id || product._id;
    const imageSrc =
      product.image ||
      (Array.isArray(product.images) && product.images[0] ? product.images[0] : null) ||
      (product.category === "chats" ? "/assets/chat2.png" : "/assets/chien2.png");

    return (
      <Link
        key={productId}
        to={`/product/${productId}`}
        className="group block h-full w-full"
      >
        <div className="h-full overflow-hidden rounded-[18px] border border-[#E9DFD4] bg-[#FAF8F4] shadow-[0_8px_24px_rgba(17,17,17,0.025)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(17,17,17,0.06)]">
          <div className="overflow-hidden rounded-[18px] p-2 sm:p-3">
            <img
              src={imageSrc}
              alt={product.name}
              className="aspect-square w-full rounded-[14px] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="overflow-x-hidden bg-velora-cream text-velora-dark">
<section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center bg-velora-cream pt-4 pb-8 md:pb-4">        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col justify-center order-2 lg:order-1"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-3 md:mb-4"
              >
                <div className="h-px w-6 md:w-8 bg-velora-gold" />
                <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-velora-gold">
                  Une nouvelle marque tunisienne
                </span>
              </motion.div>

              {/* <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="font-premium text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 md:mb-4"
              >
                Qualité
                <br />
                <span className="italic font-normal text-velora-gold">premium</span>
              </motion.h1> */}
              <motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3, duration: 0.7 }}
  className="font-premium text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 md:mb-4"
>
  <span className="whitespace-nowrap sm:whitespace-normal">
    Qualité{" "}
    <span className="italic font-normal text-velora-gold">
      premium
    </span>
  </span>
</motion.h1>
              

                <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-velora-textGray text-sm leading-relaxed mb-4 max-w-md"
              >
                Parce qu’un compagnon n’est pas juste un animal, nous créons des accessoires qui allient style, confort et amour au quotidien
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-wrap items-center gap-3 mb-6"
              >
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-lg bg-velora-gold text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-velora-goldHover transition-colors duration-300"
                >
                  Découvrir
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-velora-dark border border-velora-dark/20 px-6 py-3 hover:border-velora-gold hover:text-velora-gold transition-colors duration-300"
                >
                  Notre histoire
                </Link>
              </motion.div>

              
            </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative h-[320px] lg:h-[420px]"
              >
                <div className="absolute inset-0 rounded-2xl overflow-hidden border border-velora-gold/30 shadow-lg">
                  <img
                    src="/assets/d1.png"
                    
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="absolute bottom-6 right-6"
                >
                  {/* <Link to="/shop" className="inline-flex items-center justify-center bg-velora-gold text-white px-3 py-2 rounded-md text-xs font-medium tracking-wide hover:bg-velora-goldHover transition-all duration-300">
                    Shop Now
                  </Link> */}
                </motion.div>

                <div className="absolute top-8 -right-4 h-32 w-px bg-gradient-to-b from-transparent via-velora-gold to-transparent opacity-40" />
              </motion.div>
          </div>
        </div>

      
        <motion.div
  animate={{ y: [0, 8, 0] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
  className="
    absolute
    bottom-6
    sm:bottom-10
    md:bottom-16
    lg:bottom-24
    left-1/2
    -translate-x-1/2
    flex
    flex-col
    items-center
    gap-1
  "
>
</motion.div>
      </section>







    <section className="pt-5 pb-8 bg-velora-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <div className="inline-flex items-center gap-2 mb-3">
        <div className="h-px w-8 bg-velora-gold" />
        <span className="text-xs font-semibold tracking-widest uppercase text-velora-gold">
          Nos Collections
        </span>
        <div className="h-px w-8 bg-velora-gold" />
      </div>

      <h2 className="font-premium text-3xl font-bold text-velora-dark sm:text-4xl md:text-5xl">
        Explorez Notre Univers
      </h2>
    </motion.div>
{/* <div className="max-w-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 justify-items-center"> */}
    <div className="w-full flex justify-center">
     {/* ==================== CHIENS ==================== */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  <div
    onClick={() => navigate("/shop?category=chiens")}
    className="group relative h-[360px] w-[288px] overflow-hidden rounded-2xl border border-velora-gold/30 shadow-lg cursor-pointer"
  >
    {/* IMAGE PRINCIPALE */}
    <img
      src={dogImage}
      alt="Pour Chiens"
      className="absolute inset-0 w-full h-full object-cover object-center"
    />

    {/* Overlay léger */}
    <div className="absolute inset-0 bg-black/5" />

    {/* ==================== TITRE + CTA ==================== */}

    {/* Titre haut gauche */}
    <div className="absolute top-5 left-5 z-20 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
      <Link
        to="/shop?category=chiens"
        className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm md:text-base font-semibold text-white transition-all duration-300"
      >
        
      </Link>
    </div>

    {/* CTA haut droite */}
    <Link
      to="/shop?category=chiens"
      className="absolute top-5 right-5 z-20 hidden group-hover:flex h-6 w-6 items-center justify-center text-velora-gold"
    >
      <ArrowUpRight size={32} strokeWidth={1.8} />
    </Link>

    {/* ==================== SOUS-CATEGORIES ==================== */}

    <div className="absolute bottom-3 left-3 right-3 z-20 grid grid-cols-3 gap-2">

      {/* HARNAIS */}
      <Link
        to="/shop?category=chiens&subCategory=harnais"
        onMouseEnter={() => setDogImage("/assets/chien-harnais.png")}
        onMouseLeave={() => setDogImage("/assets/chow.png")}
        onClick={(e) => e.stopPropagation()}
        className="group relative h-[90px] overflow-hidden rounded-xl border border-white/70 shadow-lg"
      >
  <img
  src="/assets/chien-harnais.png"
  alt="Colliers"
  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
/>
        <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-colors duration-300" />

        <div className="absolute inset-0 flex items-center justify-center">
          {/* <span className="text-black/60 text-sm md:text-base font-bold drop-shadow-lg">
            Harnais
          </span> */}
        </div>
      </Link>

      {/* COLLIERS */}
      <Link
        to="/shop?category=chiens&subCategory=colliers"
        onMouseEnter={() => setDogImage("/assets/chien-collier.png")}
        onMouseLeave={() => setDogImage("/assets/chow.png")}
        onClick={(e) => e.stopPropagation()}
        className="group relative h-[90px] overflow-hidden rounded-xl border border-white/70 shadow-lg"
      >
        <img
          src="/assets/chien-collier.png"
          alt="Colliers"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-colors duration-300" />

        <div className="absolute inset-0 flex items-center justify-center">
          {/* <span className="text-black/60 text-sm md:text-base font-bold drop-shadow-lg">
            Colliers
          </span> */}
        </div>
      </Link>

      {/* LAISSES */}
      <Link
        to="/shop?category=chiens&subcategory=laisses"
        onMouseEnter={() => setDogImage("/assets/chien-laisse.png")}
        onMouseLeave={() => setDogImage("/assets/chow.png")}
        onClick={(e) => e.stopPropagation()}
        className="group relative h-[90px] overflow-hidden rounded-xl border border-white/70 shadow-lg"
      >
        <img
          src="/assets/chien-laisse.png"
          alt="Laisses"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-colors duration-300" />

        <div className="absolute inset-0 flex items-center justify-center">
          {/* <span className="text-black/60 text-sm md:text-base font-bold drop-shadow-lg">
            Laisses
          </span> */}
        </div>
      </Link>

    </div>
  </div>
</motion.div>


  {/* ==================== CHATS ==================== */}
  {/* <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    <div
      onClick={() => navigate("/shop?category=chats")}
      className="group relative h-[360px] w-[288px] overflow-hidden rounded-2xl border border-velora-gold/30 shadow-lg cursor-pointer"
    >
      <img
        src={catImage}
        alt="Pour Chats"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/5" />


      <div className="absolute top-5 left-5 z-20 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        <Link
          to="/shop?category=chats"
          className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm md:text-base font-semibold text-white transition-all duration-300"
        >
        </Link>
      </div>

      <Link
        to="/shop?category=chats"
        className="absolute top-5 right-5 z-20 hidden group-hover:flex h-6 w-6 items-center justify-center text-velora-gold"
      >
        <ArrowUpRight size={32} strokeWidth={1.8} />
      </Link>

      <div className="absolute bottom-3 left-3 right-3 z-20 grid grid-cols-3 gap-2">

        <Link
          to="/shop?category=chats&subCategory=harnais"
          onMouseEnter={() => setCatImage("/assets/chat-harnais.png")}
          onMouseLeave={() => setCatImage("/assets/mlahwa9.png")}
          onClick={(e) => e.stopPropagation()}
          className="group relative h-[90px] overflow-hidden rounded-xl border border-white/70 shadow-lg"
        >
          <img
            src="/assets/chat-harnais.png"
            alt="Harnais"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-colors duration-300" />

          <div className="absolute inset-0 flex items-center justify-center">
          </div>
        </Link>

        <Link
          to="/shop?category=chats&subCategory=colliers"
          onMouseEnter={() => setCatImage("/assets/chat-collier.png")}
          onMouseLeave={() => setCatImage("/assets/mlahwa9.png")}
          onClick={(e) => e.stopPropagation()}
          className="group relative h-[90px] overflow-hidden rounded-xl border border-white/70 shadow-lg"
        >
          <img
            src="/assets/chat-collier.png"
            alt="Colliers"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-colors duration-300" />

          <div className="absolute inset-0 flex items-center justify-center">
          </div>
        </Link>

        <Link
          to="/shop?category=chats&subCategory=laisses"
          onMouseEnter={() => setCatImage("/assets/chat-laisse.png")}
          onMouseLeave={() => setCatImage("/assets/mlahwa9.png")}
          onClick={(e) => e.stopPropagation()}
          className="group relative h-[90px] overflow-hidden rounded-xl border border-white/70 shadow-lg"
        >
          <img
            src="/assets/chat-laisse.png"
            alt="Laisses"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-colors duration-300" />

          <div className="absolute inset-0 flex items-center justify-center">
          </div>
        </Link>

      </div>
    </div>
  </motion.div> */}

</div>

  </div>
</section>

{/* =========================
    NOUVEAUTÉS
========================= */}
{/* {newProducts.length > 0 && (
  <section className="bg-velora-cream py-10 sm:py-12 lg:py-14">
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 xl:px-14">
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mb-7 sm:mb-9 text-center"
      >
        <div className="mx-auto flex items-center justify-center gap-3">
          <span className="h-px w-10 sm:w-14 bg-velora-gold/70" />

          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-velora-gold">
            Nouveautés
          </span>

          <span className="h-px w-10 sm:w-14 bg-velora-gold/70" />
        </div>

        <p className="mt-2 text-xs sm:text-sm text-velora-textGray">
          Découvrez nos dernières créations
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {newProducts.slice(0, 4).map((product, index) => (
          <motion.div
            key={product.id || product._id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.45,
              delay: index * 0.07,
            }}
          >
            {renderHomeProductCard(product)}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)} */}

{/* =========================
    OFFRES SPÉCIALES
========================= */}
{/* {specialProducts.length > 0 && (
  <section className="bg-velora-cream pt-2 pb-10 sm:pb-12 lg:pb-14">
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 xl:px-14">

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mb-7 sm:mb-9 text-center"
      >
        <div className="mx-auto flex items-center justify-center gap-3">
          <span className="h-px w-10 sm:w-14 bg-[#FFCB56]" />

          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#D79F28]">
            Offres spéciales
          </span>

          <span className="h-px w-10 sm:w-14 bg-[#FFCB56]" />
        </div>

        <p className="mt-2 text-xs sm:text-sm text-velora-textGray">
          Des offres choisies pour leur faire plaisir
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {specialProducts.slice(0, 4).map((product, index) => (
          <motion.div
            key={product.id || product._id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.45,
              delay: index * 0.07,
            }}
          >
            {renderHomeProductCard(product)}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)} */}


<section className="bg-velora-cream py-4 sm:py-4 md:py-4 lg:py-4">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-16 xl:px-16">

    {/* ==================== HEADER ==================== */}
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-10 text-center md:mb-12"
    >

      {/* Label — même style que Nos Collections */}
      <div className="mb-4 flex items-center justify-center gap-3">
        <div className="h-px w-10 bg-velora-gold" />

<span className="text-xs font-semibold tracking-widest uppercase text-velora-gold">      
      Conception Premium
        </span>

        <div className="h-px w-10 bg-velora-gold" />
      </div>

      {/* Title */}
      <h2 className="font-premium text-3xl font-bold leading-tight text-velora-dark sm:text-4xl md:text-5xl">
  Pensé pour le{" "}
  <span className="italic font-normal text-velora-gold">
    confort
  </span>
</h2>

    </motion.div>


    {/* ==================== CONTENT ==================== */}
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">


<motion.div
  initial={{ opacity: 0, x: -35 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
  className="order-1 flex w-full items-center justify-center"
>
  <motion.div
    whileHover={{
      scale: 1.03,
      y: -4,
    }}
    transition={{
      duration: 0.4,
      ease: "easeOut",
    }}
    className="relative w-full cursor-pointer"
  >
    <img
      src="/assets/pp.png"
      alt="Structure multicouche du harnais"
className="block h-[220px] md:h-[280px] w-full object-contain"    />
  </motion.div>
</motion.div>



{/* =========================================================
    RIGHT — EXPLICATION
========================================================= */}
 <motion.div
  initial={{ opacity: 0, x: 35 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
className="order-2 relative pl-5">
  
  {/* MÊME LIGNE QUE LE HOME */}
<div className="absolute left-0 top-0 h-32 w-px bg-gradient-to-b from-transparent via-velora-gold to-transparent opacity-40" />
  <div className="mb-6">

    <div className="mb-3 flex items-center gap-3">
      <div className="h-px w-8 bg-velora-gold" />

      <span className="text-xs font-semibold uppercase tracking-widest text-velora-gold">
        Une conception pensée pour eux
      </span>
    </div>

    <p className="max-w-xl text-sm leading-6 text-velora-textGray md:text-base">
      Une conception multicouche pensée pour offrir à votre compagnon
      confort, respirabilité et résistance au quotidien.
    </p>

  </div>


  {/* ==================== MATERIALS ==================== */}
  <div className="space-y-3">

    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-velora-gold">
          Tissu Oxford
        </span>

        <p className="mt-1 max-w-md text-xs leading-5 text-velora-textGray sm:text-sm">
          Une couche extérieure conçue pour apporter résistance et durabilité
          à l'ensemble.
        </p>
      </div>
    </motion.div>


    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-velora-gold">
          Air Mousse
        </span>

        <p className="mt-1 max-w-md text-xs leading-5 text-velora-textGray sm:text-sm">
          Une structure alvéolée qui favorise la circulation de l'air et
          améliore le confort.
        </p>
      </div>
    </motion.div>

  </div>

</motion.div>
  </div>
  </div>
</section>
      <ValuesSection />
    </div>
  );
}
