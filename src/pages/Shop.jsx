import React, { useEffect, useMemo, useState, useTransition } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Cat,
  ChevronDown,
  Dog,
  Grid3X3,
  List,
  Package,
  RotateCcw,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import ProductCard from "../components/ProductCard";
import ValuesSection from "../components/ValuesSection";
import { API_BASE_URL, resolveAssetUrl } from "../config/api";
import { ErrorState, PageSkeleton } from "../components/LoadingSkeleton";
import { getPacks } from "../services/packApi";
import { getCategories } from "../services/categoryApi";

const PRODUCTS_PER_PAGE = 16;
const SORT_OPTIONS = [
  { value: "featured", label: "Sélection" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

const DEFAULT_CATEGORIES = [
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
    id: "Packs",
    label: "Packs",
    shortLabel: "Packs",
    icon: Package,
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

const normalizeSubCategoryParam = (value) => {
  if (!value || value === "all") return "all";

  const normalized = String(value).trim().toLowerCase();
  const mapping = {
    all: "all",
    tous: "all",
    "tous les accessoires": "all",
    collar: "Colliers",
    collier: "Colliers",
    colliers: "Colliers",
    pack: "Packs",
    packs: "Packs",
    leash: "Laisses",
    laisse: "Laisses",
    laisses: "Laisses",
    harness: "Harnais",
    harnais: "Harnais",
  };

  return mapping[normalized] || value;
};

const normalizeSubCategoriesParam = (value) => {
  if (!value) return [];

  const splitted = String(value)
    .split(",")
    .map((item) => normalizeSubCategoryParam(item))
    .filter(Boolean)
    .filter((item) => item !== "all");

  return [...new Set(splitted)];
};

const normalizeProduct = (product) => {
  const localToSubCategory = {
    collar: "Colliers",
    collier: "Colliers",
    collars: "Colliers",
    pack: "Packs",
    packs: "Packs",
    leash: "Laisses",
    laisse: "Laisses",
    laisses: "Laisses",
    harness: "Harnais",
    harnais: "Harnais",
  };

  const rawCategory =
    typeof product.category === "object"
      ? product.category?.name || ""
      : product.category || "";

  const fallbackImage =
    String(rawCategory).toLowerCase() === "chats"
      ? "/assets/chat2.png"
      : "/assets/chien2.png";

  const rawImages = Array.isArray(product.images) && product.images.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const imageCandidate = rawImages.find(
    (source) => typeof source === "string" && source.trim()
  );

  const image =
    resolveAssetUrl(imageCandidate) ||
    resolveAssetUrl(fallbackImage);

  const rawSubCategory =
    typeof product.subCategory === "object"
      ? product.subCategory?.name || ""
      : product.subCategory || "";

  const subCategory =
    localToSubCategory[
      String(rawSubCategory).toLowerCase()
    ] || rawSubCategory;

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

  return {
    slug: product.slug,
    id: product.id || product._id,
    _id: product._id,
    name: product.name,
    price: product.price ?? 0,
    image,
    badge: product.badge || "",
    category:
      categoryMap[String(rawCategory).toLowerCase()] ||
      "chiens",
    description:
      product.description ||
      product.details ||
      product.name ||
      "",
    rating: product.rating ?? product.ratings ?? 0,
    isNew:
      product.isNew ??
      product.isNewArrival ??
      false,
    subCategory,
    sizes: product.sizes || [],
    colors: product.colors || [],
    materials: product.materials || [],
    stock: product.stock,
    available:
      product.stock === undefined ||
      Number(product.stock) > 0,
  };
};

const PackCard = ({ pack }) => {
  const price = Number(pack.pricePreview?.final ?? pack.price ?? 0);
  const image = resolveAssetUrl(pack.image || pack.images?.[0]) || "/assets/chien2.png";
  const stockValue = Number(pack.stock ?? 0);
  const isPackAvailable = pack.available !== false && stockValue > 0;
  const stockStatus =
    !isPackAvailable
      ? null
      : stockValue <= 5
      ? {
          text: `Plus que ${stockValue} en stock`,
          className: "bg-[#FFF3E6] text-[#A76228]",
        }
      : {
          text: "En stock",
          className: "bg-[#EEF9F1] text-[#2F7D57]",
        };

  return (
    <article className="group overflow-hidden rounded-[16px] border border-[#E9E0D6] bg-[#FFFDFB] shadow-[0_8px_22px_rgba(17,17,17,0.04)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(17,17,17,0.05)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F5F0] p-2.5">
        <Link to={`/pack/${pack.slug || pack._id}`} className="flex h-full w-full items-center justify-center overflow-hidden rounded-[12px]">
          <img
            src={image}
            alt={pack.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full rounded-[10px] object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </Link>

      </div>

      <div className="space-y-2 p-2.5">
        <div className="flex items-center justify-end gap-2">
          <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-velora-textGray">
            {pack.categories?.length
              ? pack.categories.map((category) => category.name).join(" / ")
              : pack.category === "chats"
                ? "Chats"
                : pack.category === "chiens"
                  ? "Chiens"
                  : "Pack"}
          </span>
        </div>

        <Link to={`/pack/${pack.slug || pack._id}`} className="block">
          <h3 className="line-clamp-2 text-[12.5px] font-semibold leading-5 text-velora-dark transition-colors hover:text-velora-gold">
            {pack.name}
          </h3>
        </Link>

        {pack.description && (
          <p className="line-clamp-2 text-[10.5px] leading-5 text-velora-textGray">
            {pack.description.length > 70 ? `${pack.description.slice(0, 70)}…` : pack.description}
          </p>
        )}

        <div className="flex items-end justify-between gap-2 pt-0.5">
          <div className="min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
              À partir de
            </p>
            <p className="mt-1 text-[19px] font-bold leading-none text-velora-dark">
              {Math.floor(price)}
              <span className="ml-1 text-[11px] font-semibold">DT</span>
            </p>
          </div>

          <Link
            to={`/pack/${pack.slug || pack._id}`}
            className="group/cart inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-velora-dark transition-all duration-200 hover:border-velora-gold hover:bg-velora-gold hover:text-white"
            aria-label={`Voir ${pack.name}`}
          >
            <ShoppingCart size={14} className="transition-transform duration-200 group-hover/cart:scale-105" />
          </Link>
        </div>

        {stockStatus && (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-semibold ${stockStatus.className}`}>
            {stockStatus.text}
          </span>
        )}
      </div>
    </article>
  );
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery =
    searchParams.get("search") || "";

  const [isPending, startTransition] = useTransition();

  const [selectedCategory, setSelectedCategory] =
    useState(
      searchParams.get("category") || "all"
    );

  const [selectedSubCategories, setSelectedSubCategories] =
    useState(() =>
      normalizeSubCategoriesParam(
        searchParams.get("subCategory")
      )
    );

  const selectedSubCategory =
    selectedSubCategories.length === 1
      ? selectedSubCategories[0]
      : "all";

  const [sortBy, setSortBy] =
    useState("featured");

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [view, setView] =
    useState("grid");

  const [currentPage, setCurrentPage] =
    useState(1);

  const { data: categoryData } = useQuery({
    queryKey: ["shop-categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  });

  const { data: subCategoryData } = useQuery({
    queryKey: ["shop-subcategories"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/subcategories`);
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const subCategories = useMemo(() => {
    const existingNames = new Set(
      SUB_CATEGORIES.map((subCategory) => subCategory.id.toLowerCase())
    );
    const dynamicSubCategories = (subCategoryData?.subCategories || [])
      .filter(
        (subCategory) =>
          subCategory.isActive !== false &&
          typeof subCategory.name === "string" &&
          subCategory.name.trim()
      )
      .filter(
        (subCategory) =>
          !existingNames.has(subCategory.name.trim().toLowerCase())
      )
      .map((subCategory) => ({
        id: subCategory.name.trim(),
        label: subCategory.name.trim(),
        shortLabel: subCategory.name.trim(),
        icon: Package,
      }));

    return [...SUB_CATEGORIES, ...dynamicSubCategories];
  }, [subCategoryData]);

  const categories = useMemo(() => {
    const dynamicCategories = (categoryData?.categories || [])
      .filter((category) => category.isActive !== false)
      .map((category) => {
        const categoryText = `${category.name} ${category.slug}`.toLowerCase();
        const isCat = categoryText.includes("chat") || categoryText.includes("cat");
        return {
          id: category.slug || category._id,
          label: category.name,
          icon: isCat ? Cat : Dog,
          image: category.image || (isCat ? "/assets/chat2.png" : "/assets/chien2.png"),
        };
      });

    return dynamicCategories.length
      ? [{ id: "all", label: "Tout", icon: Grid3X3 }, ...dynamicCategories]
      : DEFAULT_CATEGORIES;
  }, [categoryData]);

  // ==========================
  // PAGINATION BACKEND
  // ==========================

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: PRODUCTS_PER_PAGE,
      total: 0,
      pages: 1,
    });

  const queryKey = useMemo(
    () => ({
      page: currentPage,
      category: selectedCategory,
      subCategory: selectedSubCategories.join(","),
      sort: sortBy,
      search: searchQuery.trim(),
    }),
    [currentPage, selectedCategory, selectedSubCategories, sortBy, searchQuery]
  );

  const showingPacks = selectedSubCategories.includes("Packs");
  const showingOnlyPacks = showingPacks && selectedSubCategories.length === 1;
  const showingAllAccessories = selectedSubCategories.length === 0;
  const shouldLoadPacks = showingPacks || showingAllAccessories;

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["products", queryKey],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: PRODUCTS_PER_PAGE,
        stock: "available",
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== "all") params.category = selectedCategory;
      if (selectedSubCategories.length > 0) {
        params.subCategory = selectedSubCategories.join(",");
      }
      if (sortBy !== "featured") params.sort = sortBy;

      const { data } = await axios.get(`${API_BASE_URL}/products`, { params });
      return data;
    },
    staleTime: 1000 * 60 * 3,
    placeholderData: (previousData) => previousData,
    enabled: !showingOnlyPacks,
  });

  const {
    data: packsData,
    isLoading: packsLoading,
    isError: packsError,
    refetch: refetchPacks,
  } = useQuery({
    queryKey: ["packs", searchQuery.trim()],
    queryFn: () => getPacks(),
    staleTime: 1000 * 60 * 3,
    enabled: shouldLoadPacks,
  });

  const products = useMemo(
    () => (Array.isArray(data?.products) ? data.products.map(normalizeProduct) : []),
    [data]
  );

  const packs = useMemo(() => {
    const allPacks = Array.isArray(packsData?.packs) ? packsData.packs : [];
    const query = searchQuery.trim().toLowerCase();
    return allPacks
      .filter((pack) => {
        if (pack.available === false || Number(pack.stock ?? 0) <= 0) {
          return false;
        }

        const packCategories = (pack.categories || [])
          .map((category) => String(category.slug || category.name || category).toLowerCase());
        const legacyCategory = String(pack.category || "mixte").toLowerCase();
        const categoryMatches = selectedCategory === "all"
          || packCategories.includes(selectedCategory.toLowerCase())
          || (!packCategories.length && (legacyCategory === "mixte" || legacyCategory === selectedCategory));
        const searchMatches = !query
          || `${pack.name} ${pack.description || ""}`.toLowerCase().includes(query);
        return categoryMatches && searchMatches;
      })
      .sort((first, second) => {
        if (sortBy === "price-asc") return Number(first.pricePreview?.final || 0) - Number(second.pricePreview?.final || 0);
        if (sortBy === "price-desc") return Number(second.pricePreview?.final || 0) - Number(first.pricePreview?.final || 0);
        return 0;
      });
  }, [packsData, searchQuery, selectedCategory, sortBy]);

  const displayedItems = showingOnlyPacks
    ? packs
    : showingAllAccessories
      ? [...(currentPage === 1 ? packs : []), ...products]
      : showingPacks
        ? [...packs, ...products]
      : products;

  const loading = showingOnlyPacks || showingAllAccessories || showingPacks
    ? packsLoading || isLoading
    : isLoading;

  const [filtersExpanded, setFiltersExpanded] =
    useState({
      category: true,
      subCategory: true,
    });

  // ==========================
  // LOAD PRODUCTS
  // ==========================

  useEffect(() => {
    const nextPagination = data?.pagination || {
      page: currentPage,
      limit: PRODUCTS_PER_PAGE,
      total: 0,
      pages: 1,
    };

    setPagination(nextPagination);
  }, [data, currentPage]);

  // ==========================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedSubCategory,
    sortBy,
    searchQuery,
  ]);

  // ==========================
  // PAGE TITLE
  // ==========================

  const pageTitle =
    selectedSubCategories.length === 1
      ? selectedSubCategories[0]
      : selectedSubCategories.length > 1
      ? "Accessoires"
      : selectedCategory === "all"
      ? "Collection"
      : categories.find(
          (category) =>
            category.id === selectedCategory
        )?.label || "Tout";

  // ==========================
  // FILTER ACTIONS
  // ==========================

  useEffect(() => {
    setSelectedCategory((prev) => {
      const nextCategory = searchParams.get("category") || "all";
      return prev === nextCategory ? prev : nextCategory;
    });

    setSelectedSubCategories((prev) => {
      const nextSubCategories = normalizeSubCategoriesParam(
        searchParams.get("subCategory")
      );
      return prev.join(",") === nextSubCategories.join(",") ? prev : nextSubCategories;
    });
  }, [searchParams]);

  const selectCategory = (category) => {
    startTransition(() => {
      const nextParams = new URLSearchParams(searchParams);

      if (category === "all") {
        nextParams.delete("category");
      } else {
        nextParams.set("category", category);
      }

      nextParams.delete("subCategory");

      setSelectedCategory(category);
      setSelectedSubCategories([]);
      setCurrentPage(1);
      setSearchParams(nextParams, { replace: true });
    });
  };

  const selectSubCategory = (subCategory) => {
    startTransition(() => {
      const nextParams = new URLSearchParams(searchParams);

      if (subCategory === "all") {
        nextParams.delete("subCategory");
        setSelectedSubCategories([]);
        setCurrentPage(1);
        setSearchParams(nextParams, { replace: true });
        return;
      }

      const wasSelected = selectedSubCategories.includes(subCategory);
      const nextSelection = wasSelected
        ? selectedSubCategories.filter((item) => item !== subCategory)
        : [...selectedSubCategories.filter((item) => item !== "all"), subCategory];

      if (nextSelection.length === 0) {
        nextParams.delete("subCategory");
      } else {
        nextParams.set("subCategory", nextSelection.join(","));
      }

      setSelectedSubCategories(nextSelection);
      setCurrentPage(1);
      setSearchParams(nextParams, { replace: true });
    });
  };

  const resetFilters = () => {
    selectCategory("all");
  };

  // ==========================
  // TOGGLE FILTER
  // ==========================

  const toggleFilter = (key) => {
    setFiltersExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ==========================
  // ACTIVE FILTERS
  // ==========================

  const activeFilters = [
    selectedCategory !== "all" &&
      categories.find(
        (category) =>
          category.id === selectedCategory
      )?.label,

    ...selectedSubCategories,
  ].filter(Boolean);

  // ==========================
  // CATEGORY ICON
  // ==========================

  const renderCategoryIcon = (
    category,
    isSelected = false
  ) => {
    if (category.image) {
      return (
        <img
          src={category.image}
          alt={category.label}
          className={`h-5 w-5 object-contain ${
            isSelected
              ? "brightness-0 invert"
              : ""
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
          isSelected
            ? "text-white"
            : "text-current"
        }
      />
    );
  };

  // ==========================
  // LOADING
  // ==========================

  if (loading && products.length === 0 && !filterOpen) {
    return <PageSkeleton />;
  }

  const hasLoadingError = showingOnlyPacks
    ? packsError
    : showingAllAccessories
      ? packsError || isError
      : isError;

  if (hasLoadingError && displayedItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#F7F3EC] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ErrorState onRetry={showingPacks || showingAllAccessories ? refetchPacks : refetch} />
        </div>
      </main>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F7F3EC] pb-0"
      aria-busy={loading || isPending}
    >

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

                

              </div>

              <div className="flex items-center gap-2 lg:hidden">

                <button
                  onClick={() =>
                    setFilterOpen(true)
                  }
                  className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-[#E7DED2] bg-white px-4 text-xs font-semibold text-velora-dark transition hover:border-smiley-warning hover:text-velora-gold"
                >
                  <SlidersHorizontal size={15} />
                  Filtres
                </button>

                <label className="flex h-10 items-center gap-2 rounded-xl border border-[#E7DED2] bg-white px-3">

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-velora-textGray">
                    Trier
                  </span>

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value)
                    }
                    className="max-w-[105px] cursor-pointer bg-transparent text-xs font-semibold text-velora-dark outline-none"
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
                  onToggle={() =>
                    toggleFilter("category")
                  }
                  centered
                >

                  {categories.map(
                    (category) => {
                      const selected =
                        selectedCategory ===
                        category.id;

                      return (
                        <button
                          key={category.id}
                          onClick={() =>
                            selectCategory(
                              category.id
                            )
                          }
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                            category.id === "all"
                              ? "w-full"
                              : "ml-6 w-[calc(100%-1.5rem)]"
                          } ${
                            selected
                              ? "bg-smiley-warning text-white shadow-sm"
                              : "text-velora-textGray hover:bg-[#F8F4EF] hover:text-velora-dark"
                          }`}
                        >
                          {renderCategoryIcon(
                            category,
                            selected
                          )}

                          <span>
                            {category.label}
                          </span>

                        </button>
                      );
                    }
                  )}

                </FilterGroup>

                <div className="h-px bg-[#EFE7DC]" />

                <FilterGroup
                  title="Accessoires"
                  open={
                    filtersExpanded.subCategory
                  }
                  onToggle={() =>
                    toggleFilter(
                      "subCategory"
                    )
                  }
                  centered
                >

                  {subCategories.map(
                    (subCategory) => {
                      const selected =
                        subCategory.id === "all"
                          ? selectedSubCategories.length === 0
                          : selectedSubCategories.includes(
                              subCategory.id
                            );

                      return (
                        <button
                          key={subCategory.id}
                          onClick={() =>
                            selectSubCategory(
                              subCategory.id
                            )
                          }
                          className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                            subCategory.id === "all"
                              ? "w-full"
                              : "ml-6 w-[calc(100%-1.5rem)]"
                          } ${
                            selected
                              ? "bg-smiley-warning text-white shadow-sm"
                              : "text-velora-textGray hover:bg-[#F8F4EF] hover:text-velora-dark"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {typeof subCategory.icon === "string" ? (
                              <img
                                src={subCategory.icon}
                                alt={
                                  subCategory.label
                                }
                                className={`h-5 w-5 object-contain ${
                                  selected
                                    ? "brightness-0 invert"
                                    : ""
                                }`}
                              />
                            ) : (
                              <subCategory.icon
                                size={16}
                                strokeWidth={1.8}
                                className={
                                  selected
                                    ? "text-white"
                                    : "text-current"
                                }
                              />
                            )}

                            <span>
                              {subCategory.label}
                            </span>
                          </span>

                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                              selected
                                ? "border-white bg-white"
                                : "border-current/50 bg-transparent"
                            }`}
                            aria-hidden="true"
                          >
                            {selected && (
                              <span className="h-2 w-2 rounded-[2px] bg-smiley-warning" />
                            )}
                          </span>
                        </button>
                      );
                    }
                  )}

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
                        {pagination.total}
                      </span>{" "}

                      produit
                      {pagination.total > 1
                        ? "s"
                        : ""}

                    </p>
                  </div>

                  <div className="flex items-center gap-2">

                    {/* VIEW */}

                    <div className="hidden items-center rounded-xl border border-[#E7DED2] bg-white p-1 sm:flex">

                      <button
                        onClick={() =>
                          setView("grid")
                        }
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
                        onClick={() =>
                          setView("list")
                        }
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

                    <label className="hidden h-10 items-center gap-2 rounded-xl border border-[#E7DED2] bg-white px-3 lg:flex">

                      <span className="text-[10px] font-semibold uppercase tracking-wider text-velora-textGray">
                        Trier
                      </span>

                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(
                            e.target.value
                          )
                        }
                        className="cursor-pointer bg-transparent text-xs font-semibold text-velora-dark outline-none"
                      >

                        {SORT_OPTIONS.map(
                          (option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          )
                        )}

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

                    {selectedCategory !==
                      "all" && (
                      <FilterChip
                        label={
                          categories.find(
                            (category) =>
                              category.id ===
                              selectedCategory
                          )?.label
                        }
                        onClear={() =>
                          selectCategory(
                            "all"
                          )
                        }
                      />
                    )}

                    {selectedSubCategories.length > 0 &&
                      selectedSubCategories.map((subCategory) => (
                        <FilterChip
                          key={subCategory}
                          label={subCategory}
                          onClear={() =>
                            selectSubCategory(
                              subCategory
                            )
                          }
                        />
                      ))}

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

                  {subCategories.map(
                    (subCategory) => {
                      const selected =
                        subCategory.id === "all"
                          ? selectedSubCategories.length === 0
                          : selectedSubCategories.includes(
                              subCategory.id
                            );

                      return (
                        <button
                          key={subCategory.id}
                          onClick={() =>
                            selectSubCategory(
                              subCategory.id
                            )
                          }
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            selected
                              ? "bg-[#F6EFE6] text-velora-dark"
                              : "text-velora-textGray hover:bg-[#F8F4EF] hover:text-velora-dark"
                          }`}
                        >
                          {
                            subCategory.shortLabel
                          }
                        </button>
                      );
                    }
                  )}

                </div>

              </div>

              {/* =========================
                  EMPTY STATE
              ========================= */}

              {displayedItems.length === 0 ? (
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

                    {displayedItems.map((item) => (
                      item.components ? (
                        <PackCard key={`pack-${item._id}`} pack={item} />
                      ) : (
                        <ProductCard
                          key={item.id || item._id}
                          product={item}
                        />
                      )
                    ))}

                  </div>

                  {/* =========================
                      PAGINATION
                  ========================= */}

                  {!showingPacks && pagination.pages > 1 && (
                    <div className="mt-9 flex items-center justify-center gap-1">

                      {/* PREVIOUS */}

                      <button
                        disabled={
                          currentPage === 1
                        }
                        onClick={() =>
                          setCurrentPage(
                            (page) =>
                              Math.max(
                                page - 1,
                                1
                              )
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-xs transition hover:border-velora-gold disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ←
                      </button>

                      {/* PAGE NUMBERS */}

                      {Array.from({
                        length:
                          pagination.pages,
                      }).map(
                        (_, index) => {
                          const pageNum =
                            index + 1;

                          const showPage =
                            pageNum === 1 ||
                            pageNum ===
                              pagination.pages ||
                            Math.abs(
                              pageNum -
                                currentPage
                            ) <= 1 ||
                            (currentPage <= 3 &&
                              pageNum <= 3) ||
                            (currentPage >
                              pagination.pages -
                                3 &&
                              pageNum >
                                pagination.pages -
                                  3);

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
                                pagination.pages -
                                  1 &&
                              currentPage <
                                pagination.pages -
                                  2
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
                                setCurrentPage(
                                  pageNum
                                )
                              }
                              className={`h-9 w-9 rounded-lg text-xs font-semibold transition-all ${
                                currentPage ===
                                pageNum
                                  ? "bg-velora-gold text-white shadow-sm"
                                  : "border border-[#E7DED2] bg-white text-velora-dark hover:border-velora-gold hover:bg-[#F8F4EF]"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      {/* NEXT */}

                      <button
                        disabled={
                          currentPage ===
                          pagination.pages
                        }
                        onClick={() =>
                          setCurrentPage(
                            (page) =>
                              Math.min(
                                page + 1,
                                pagination.pages
                              )
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
              onClick={() =>
                setFilterOpen(false)
              }
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "tween",
                duration: 0.25,
              }}
              className="fixed bottom-0 left-0 top-0 z-50 w-[86%] max-w-sm overscroll-contain overflow-y-auto bg-white p-5 [touch-action:pan-y] [-webkit-overflow-scrolling:touch] sm:p-6 lg:hidden"
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
                  onClick={() =>
                    setFilterOpen(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E7DED2] transition hover:border-velora-gold"
                >
                  <X size={17} />
                </button>

              </div>

              {activeFilters.length > 0 && (
                <div className="mb-6 rounded-xl border border-[#EFE7DC] bg-[#FCFAF7] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-velora-textGray">
                      Filtres sélectionnés
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-[11px] font-semibold text-velora-gold hover:text-velora-dark"
                    >
                      Tout retirer
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory !== "all" && (
                      <FilterChip
                        label={categories.find((category) => category.id === selectedCategory)?.label}
                        onClear={() => selectCategory("all")}
                      />
                    )}
                    {selectedSubCategories.map((subCategory) => (
                      <FilterChip
                        key={subCategory}
                        label={subCategory}
                        onClear={() => selectSubCategory(subCategory)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-7">

                <MobileFilterGroup title="Pour">

                  {categories.map(
                    (category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          selectCategory(
                            category.id
                          );
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
                    )
                  )}

                </MobileFilterGroup>

                <MobileFilterGroup title="Accessoires">

                  {subCategories.map(
                    (subCategory) => {
                      const selected =
                        subCategory.id === "all"
                          ? selectedSubCategories.length === 0
                          : selectedSubCategories.includes(
                              subCategory.id
                            );

                      return (
                        <button
                          key={subCategory.id}
                          onClick={() => {
                            selectSubCategory(
                              subCategory.id
                            );
                          }}
                          className={`flex items-center justify-between gap-3 border-b border-[#EFE7DC] py-3 text-left text-sm ${
                            subCategory.id === "all"
                              ? "w-full"
                              : "ml-6 w-[calc(100%-1.5rem)]"
                          } ${
                            selected
                              ? "font-semibold text-velora-dark"
                              : "text-velora-textGray"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {typeof subCategory.icon === "string" ? (
                              <img
                                src={subCategory.icon}
                                alt={
                                  subCategory.label
                                }
                                className="h-5 w-5 object-contain"
                              />
                            ) : (
                              <subCategory.icon
                                size={16}
                                strokeWidth={1.8}
                              />
                            )}

                            {subCategory.label}
                          </span>

                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded border ${
                              selected
                                ? "border-velora-gold bg-velora-gold"
                                : "border-[#D5C7BA] bg-white"
                            }`}
                            aria-hidden="true"
                          >
                            {selected && (
                              <span className="h-2 w-2 rounded-[2px] bg-white" />
                            )}
                          </span>
                        </button>
                      );
                    }
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

// =====================================================
// FILTER GROUP
// =====================================================

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

// =====================================================
// MOBILE FILTER GROUP
// =====================================================

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

// =====================================================
// FILTER CHIP
// =====================================================

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