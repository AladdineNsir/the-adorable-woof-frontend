import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Cat,
  ChevronDown,
  Dog,
  Grid3X3,
  List,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

import ProductCard from "../components/ProductCard";
import ValuesSection from "../components/ValuesSection";
import { API_BASE_URL, resolveAssetUrl } from "../config/api";

const PRODUCTS_PER_PAGE = 16;

const SORT_OPTIONS = [
  { value: "featured", label: "Sélection" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

const CATEGORIES = [
  {
    id: "all",
    label: "Tout",
    icon: Grid3X3,
  },
  {
    id: "chiens",
    label: "Chiens",
    icon: Dog,
    image: "/assets/chien2.png",
  },
  {
    id: "chats",
    label: "Chats",
    icon: Cat,
    image: "/assets/chat2.png",
  },
];

const SUB_CATEGORIES = [
  {
    id: "all",
    label: "Tous les accessoires",
    shortLabel: "Tous",
    icon: "/assets/tous_icon.png",
  },
  {
    id: "Colliers",
    label: "Colliers",
    shortLabel: "Colliers",
    icon: "/assets/collier_icon.png",
  },
  {
    id: "Laisses",
    label: "Laisses",
    shortLabel: "Laisses",
    icon: "/assets/laisse_icon.png",
  },
  {
    id: "Harnais",
    label: "Harnais",
    shortLabel: "Harnais",
    icon: "/assets/harnais_icon.png",
  },
];

const normalizeProduct = (product) => {
  const localToSubCategory = {
    collar: "Colliers",
    collier: "Colliers",
    leash: "Laisses",
    laisse: "Laisses",
    laisses: "Laisses",
    harness: "Harnais",
    harnais: "Harnais",
  };

  const rawImage = product.image || product.images?.[0] || "";
  const image = resolveAssetUrl(rawImage);

  const rawSubCategory =
    typeof product.subCategory === "object"
      ? product.subCategory?.name || ""
      : product.subCategory || "";

  const subCategory =
    localToSubCategory[String(rawSubCategory).toLowerCase()] ||
    rawSubCategory;

  const categoryMap = {
    chiens: "chiens",
    chien: "chiens",
    dog: "chiens",
    dogs: "chiens",
    chats: "chats",
    chat: "chats",
    cat: "chats",
    cats: "chats",
  };

  const rawCategory =
    typeof product.category === "object"
      ? product.category?.name || ""
      : product.category || "";

  return {
    id: product.id || product._id,
    _id: product._id,
    name: product.name,
    price: product.price ?? 0,
    image,
    category: categoryMap[String(rawCategory).toLowerCase()] || "chiens",
    description:
      product.description || product.details || product.name || "",
    rating: product.rating ?? product.ratings ?? 0,
    isNew: product.isNew ?? product.isNewArrival ?? false,
    subCategory,
    sizes: product.sizes || [],
    colors: product.colors || [],
    materials: product.materials || [],
    stock: product.stock,
    available:
      product.stock === undefined || Number(product.stock) > 0,
  };
};

export default function Shop() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );

  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const [filtersExpanded, setFiltersExpanded] = useState({
    category: true,
    subCategory: true,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/products`);
        setProducts(data.map(normalizeProduct));
      } catch (error) {
        console.error("Erreur chargement produits:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedSubCategory,
    sortBy,
    searchQuery,
  ]);

  useEffect(() => {
    setSelectedSubCategory("all");
  }, [selectedCategory]);

  const filtered = useMemo(() => {
    let result = products.filter((product) => product.available);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedSubCategory !== "all") {
      result = result.filter(
        (product) =>
          product.subCategory === selectedSubCategory
      );
    }

    switch (sortBy) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);

      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);

      case "rating":
        return [...result].sort((a, b) => b.rating - a.rating);

      case "newest":
        return [
          ...result.filter((product) => product.isNew),
          ...result.filter((product) => !product.isNew),
        ];

      default:
        return result;
    }
  }, [
    products,
    selectedCategory,
    selectedSubCategory,
    sortBy,
    searchQuery,
  ]);

  const totalPages = Math.ceil(
    filtered.length / PRODUCTS_PER_PAGE
  );

  const paginatedProducts = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const pageTitle =
    selectedSubCategory !== "all"
      ? selectedSubCategory
      : selectedCategory === "all"
      ? "Collection"
      : CATEGORIES.find(
          (category) => category.id === selectedCategory
        )?.label || "Tout";

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedSubCategory("all");
  };

  const toggleFilter = (key) => {
    setFiltersExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const activeFilters = [
    selectedCategory !== "all" &&
      CATEGORIES.find(
        (category) => category.id === selectedCategory
      )?.label,

    selectedSubCategory !== "all" && selectedSubCategory,
  ].filter(Boolean);

  const renderCategoryIcon = (category, isSelected = false) => {
    if (category.image) {
      return (
        <img
          src={category.image}
          alt={category.label}
          className={`h-5 w-5 object-contain ${
            isSelected ? "brightness-0 invert" : ""
          }`}
        />
      );
    }

    const Icon = category.icon;

    return (
      <Icon
        size={16}
        strokeWidth={1.7}
        className={
          isSelected ? "text-white" : "text-current"
        }
      />
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F3EC] font-premium text-xl text-velora-dark">
        Chargement de la collection...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] pb-0">

      {/* =========================
          SHOP CONTAINER
      ========================= */}
      <div className="mx-auto max-w-[1500px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 xl:px-10">

        <div className="overflow-hidden rounded-2xl border border-[#E8DED1] bg-white shadow-[0_15px_50px_rgba(17,17,17,0.05)]">

          {/* =========================
              HEADER
          ========================= */}
          <header className="border-b border-[#EFE7DC] px-5 py-5 sm:px-7 lg:px-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                

                <h1 className="mt-1.5 font-premium text-3xl font-bold tracking-tight text-velora-dark sm:text-4xl">
                  {pageTitle}
                </h1>

                <p className="mt-1.5 max-w-xl text-sm text-velora-textGray">
                  Découvrez nos accessoires premium pour vos compagnons.
                </p>
              </div>

              <button
                onClick={() => setFilterOpen(true)}
                className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-[#E7DED2] bg-white px-4 text-xs font-semibold text-velora-dark transition hover:border-smiley-warning hover:text-velora-gold lg:hidden"
              >
                <SlidersHorizontal size={15} />
                Filtres
              </button>

            </div>
          </header>

          {/* =========================
              CONTENT
          ========================= */}
          <div className="grid gap-7 px-5 py-6 sm:px-7 lg:grid-cols-[210px_minmax(0,1fr)] lg:px-8">

            {/* =========================
                DESKTOP FILTERS
            ========================= */}
            <aside className="hidden lg:block">

              <div className="sticky top-24 space-y-5">

                <FilterGroup
                  title="Pour"
                  open={filtersExpanded.category}
                  onToggle={() => toggleFilter("category")}
                  centered
                >
                  {CATEGORIES.map((category) => {
                    const selected =
                      selectedCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        onClick={() =>
                          setSelectedCategory(category.id)
                        }
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                          selected
                            ? "bg-smiley-warning text-white shadow-sm"
                            : "text-velora-textGray hover:bg-[#F8F4EF] hover:text-velora-dark"
                        }`}
                      >
                        {renderCategoryIcon(category, selected)}

                        <span>{category.label}</span>
                      </button>
                    );
                  })}
                </FilterGroup>

                <div className="h-px bg-[#EFE7DC]" />

                <FilterGroup
                  title="Accessoires"
                  open={filtersExpanded.subCategory}
                  onToggle={() =>
                    toggleFilter("subCategory")
                  }
                  centered
                >
                  {SUB_CATEGORIES.map((subCategory) => {
                    const selected =
                      selectedSubCategory === subCategory.id;

                    return (
                      <button
                        key={subCategory.id}
                        onClick={() =>
                          setSelectedSubCategory(
                            subCategory.id
                          )
                        }
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                          selected
                            ? "bg-smiley-warning text-white shadow-sm"
                            : "text-velora-textGray hover:bg-[#F8F4EF] hover:text-velora-dark"
                        }`}
                      >
                        <img
                          src={subCategory.icon}
                          alt={subCategory.label}
                          className={`h-5 w-5 object-contain ${
                            selected
                              ? "brightness-0 invert"
                              : ""
                          }`}
                        />

                        <span>
                          {subCategory.label}
                        </span>
                      </button>
                    );
                  })}
                </FilterGroup>

                {activeFilters.length > 0 && (
                  <>
                    <div className="h-px bg-[#EFE7DC]" />

                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-smiley-warning transition hover:text-velora-dark"
                    >
                      <RotateCcw size={13} />
                      Réinitialiser
                    </button>
                  </>
                )}

              </div>
            </aside>

            {/* =========================
                PRODUCTS AREA
            ========================= */}
            <main className="min-w-0">

              {/* TOP CONTROLS */}
              <div className="mb-5">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-xs text-velora-textGray">
                      <span className="font-semibold text-velora-dark">
                        {filtered.length}
                      </span>{" "}
                      produit{filtered.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">

                    {/* VIEW */}
                    <div className="hidden items-center rounded-xl border border-[#E7DED2] bg-white p-1 sm:flex">

                      <button
                        onClick={() => setView("grid")}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          view === "grid"
                            ? "bg-velora-gold text-white"
                            : "text-velora-textGray hover:text-velora-dark"
                        }`}
                        aria-label="Vue grille"
                      >
                        <Grid3X3 size={15} />
                      </button>

                      <button
                        onClick={() => setView("list")}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          view === "list"
                            ? "bg-velora-gold text-white"
                            : "text-velora-textGray hover:text-velora-dark"
                        }`}
                        aria-label="Vue liste"
                      >
                        <List size={15} />
                      </button>

                    </div>

                    {/* SORT */}
                    <label className="flex h-10 items-center gap-2 rounded-xl border border-[#E7DED2] bg-white px-3">

                      <span className="text-[10px] font-semibold uppercase tracking-wider text-velora-textGray">
                        Trier
                      </span>

                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value)
                        }
                        className="cursor-pointer bg-transparent text-xs font-semibold text-velora-dark outline-none"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>

                    </label>

                  </div>
                </div>

                {/* ACTIVE FILTERS */}
                {activeFilters.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">

                    <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.18em] text-velora-dark">
                      Filtres
                    </span>

                    {selectedCategory !== "all" && (
                      <FilterChip
                        label={
                          CATEGORIES.find(
                            (category) =>
                              category.id ===
                              selectedCategory
                          )?.label
                        }
                        onClear={() =>
                          setSelectedCategory("all")
                        }
                      />
                    )}

                    {selectedSubCategory !== "all" && (
                      <FilterChip
                        label={selectedSubCategory}
                        onClear={() =>
                          setSelectedSubCategory("all")
                        }
                      />
                    )}

                    <button
                      onClick={resetFilters}
                      className="ml-1 text-xs font-semibold text-velora-gold transition hover:text-velora-dark"
                    >
                      Réinitialiser
                    </button>

                  </div>
                )}

                {/* ACCESSORIES NAV */}
                <div className="mt-4 flex flex-wrap gap-1.5 border-y border-[#EFE7DC] py-3">

                  {SUB_CATEGORIES.map((subCategory) => {
                    const selected =
                      selectedSubCategory ===
                      subCategory.id;

                    return (
                      <button
                        key={subCategory.id}
                        onClick={() =>
                          setSelectedSubCategory(
                            subCategory.id
                          )
                        }
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          selected
                            ? "bg-[#F6EFE6] text-velora-dark"
                            : "text-velora-textGray hover:bg-[#F8F4EF] hover:text-velora-dark"
                        }`}
                      >
                        {subCategory.shortLabel}
                      </button>
                    );
                  })}

                </div>

              </div>

              {/* =========================
                  EMPTY STATE
              ========================= */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-[#EFE7DC] bg-[#F8F4EF] px-5 py-16 text-center">

                  <h3 className="font-premium text-2xl font-bold text-velora-dark">
                    Aucun produit disponible
                  </h3>

                  <p className="mt-2 text-sm text-velora-textGray">
                    Essayez de modifier vos filtres.
                  </p>

                  <button
                    onClick={resetFilters}
                    className="mt-5 text-sm font-semibold text-velora-gold transition hover:text-velora-dark"
                  >
                    Réinitialiser les filtres
                  </button>

                </div>
              ) : (
                <>
                  {/* =========================
                      PRODUCTS GRID
                  ========================= */}
                  <div
                    className={
                      view === "grid"
                        ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
                        : "grid grid-cols-1 gap-5 xl:grid-cols-2"
                    }
                  >
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id || product._id}
                        product={product}
                      />
                    ))}
                  </div>

                  {/* =========================
                      PAGINATION
                  ========================= */}
                  {totalPages >= 1 && (
                    <div className="mt-9 flex items-center justify-center gap-1">

                      <button
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage(
                            (page) => page - 1
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-xs transition hover:border-velora-gold disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ←
                      </button>

                      {Array.from({
                        length: totalPages,
                      }).map((_, index) => {
                        const pageNum = index + 1;

                        const showPage =
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          Math.abs(
                            pageNum - currentPage
                          ) <= 1 ||
                          (currentPage <= 3 &&
                            pageNum <= 3) ||
                          (currentPage >
                            totalPages - 3 &&
                            pageNum >
                              totalPages - 3);

                        if (!showPage) {
                          if (
                            pageNum === 2 &&
                            currentPage > 3
                          ) {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-1 text-velora-textGray"
                              >
                                …
                              </span>
                            );
                          }

                          if (
                            pageNum ===
                              totalPages - 1 &&
                            currentPage <
                              totalPages - 2
                          ) {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-1 text-velora-textGray"
                              >
                                …
                              </span>
                            );
                          }

                          return null;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() =>
                              setCurrentPage(pageNum)
                            }
                            className={`h-9 w-9 rounded-lg text-xs font-semibold transition-all ${
                              currentPage === pageNum
                                ? "bg-velora-gold text-white shadow-sm"
                                : "border border-[#E7DED2] bg-white text-velora-dark hover:border-velora-gold hover:bg-[#F8F4EF]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        disabled={
                          currentPage === totalPages
                        }
                        onClick={() =>
                          setCurrentPage(
                            (page) => page + 1
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-xs transition hover:border-velora-gold disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        →
                      </button>

                    </div>
                  )}
                </>
              )}

            </main>
          </div>
        </div>
      </div>

      {/* VALUES */}
      <ValuesSection />

      {/* =========================
          MOBILE FILTER DRAWER
      ========================= */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={() => setFilterOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "tween",
                duration: 0.25,
              }}
              className="fixed bottom-0 left-0 top-0 z-50 w-[86%] max-w-sm overflow-y-auto bg-white p-5 sm:p-6 lg:hidden"
            >

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-velora-gold">
                    BestBuddy
                  </p>

                  <h3 className="mt-1 font-premium text-2xl font-bold text-velora-dark">
                    Filtres
                  </h3>
                </div>

                <button
                  onClick={() => setFilterOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E7DED2] transition hover:border-velora-gold"
                >
                  <X size={17} />
                </button>

              </div>

              <div className="space-y-7">

                <MobileFilterGroup title="Pour">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(
                          category.id
                        );
                        setFilterOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 border-b border-[#EFE7DC] py-3 text-sm ${
                        selectedCategory ===
                        category.id
                          ? "font-semibold text-velora-dark"
                          : "text-velora-textGray"
                      }`}
                    >
                      {renderCategoryIcon(
                        category,
                        selectedCategory ===
                          category.id
                      )}

                      {category.label}
                    </button>
                  ))}
                </MobileFilterGroup>

                <MobileFilterGroup title="Accessoires">
                  {SUB_CATEGORIES.map(
                    (subCategory) => (
                      <button
                        key={subCategory.id}
                        onClick={() => {
                          setSelectedSubCategory(
                            subCategory.id
                          );
                          setFilterOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 border-b border-[#EFE7DC] py-3 text-left text-sm ${
                          selectedSubCategory ===
                          subCategory.id
                            ? "font-semibold text-velora-dark"
                            : "text-velora-textGray"
                        }`}
                      >
                        <img
                          src={subCategory.icon}
                          alt={subCategory.label}
                          className="h-5 w-5 object-contain"
                        />

                        {subCategory.label}
                      </button>
                    )
                  )}
                </MobileFilterGroup>

                <button
                  onClick={() => {
                    resetFilters();
                    setFilterOpen(false);
                  }}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-velora-dark text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
                >
                  <RotateCcw size={14} />
                  Réinitialiser
                </button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({
  title,
  open,
  onToggle,
  children,
  centered = false,
}) {
  return (
    <div>

      <button
        className={`mb-3 flex w-full items-center ${
          centered
            ? "justify-center"
            : "justify-between"
        } text-[10px] font-bold uppercase tracking-[0.2em] text-[#A65B24]`}
        onClick={onToggle}
      >
        <span className="flex items-center gap-2">
          {title}

          <ChevronDown
            size={13}
            className={`transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="overflow-hidden"
          >
            <div className="space-y-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function MobileFilterGroup({
  title,
  children,
}) {
  return (
    <div>

      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A65B24]">
        {title}
      </p>

      {children}

    </div>
  );
}

function FilterChip({
  label,
  onClear,
}) {
  return (
    <button
      onClick={onClear}
      className="inline-flex items-center gap-2 rounded-lg border border-[#E7DED2] bg-[#F6F4EE] px-2.5 py-1.5 text-xs font-medium text-velora-dark transition hover:border-velora-gold"
    >
      {label}

      <X
        size={12}
        className="text-red-500"
      />
    </button>
  );
}