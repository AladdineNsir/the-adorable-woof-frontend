import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

import { register } from "../services/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return alert("Les mots de passe ne correspondent pas.");
    }

    

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert("Compte créé avec succès.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Erreur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F3EC] text-black flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

      {/* =========================
          RETOUR ACCUEIL
      ========================= */}
      <div className="fixed right-5 top-5 sm:right-8 sm:top-7 z-50">
        <Link
          to="/"
          className="text-xs font-medium text-black transition-colors hover:text-velora-gold"
        >
          ← Retour à l'accueil
        </Link>
      </div>

      {/* Décorations très subtiles */}
      <div className="pointer-events-none fixed left-0 top-1/4 h-64 w-64 rounded-full bg-velora-gold/5 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-72 w-72 rounded-full bg-velora-gold/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[460px]"
      >

        {/* =========================
            REGISTER CARD
        ========================= */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E8DED1] shadow-[0_20px_60px_rgba(17,17,17,0.10)]">

          {/* IMAGE BACKGROUND */}
          <img
            src="/assets/font.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />

          {/* CONTENT */}
          <div className="relative z-10">

            <div className="px-5 py-6 sm:px-8 sm:py-7 lg:px-9">

              {/* =========================
                  LOGO
              ========================= */}
              <div className="flex justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center"
                >
                  <img
                    src="/assets/1.png"
                    alt="BestBuddy"
                    className="h-12 sm:h-14 md:h-16 w-auto max-w-[220px] object-contain"
                  />
                </Link>
              </div>

              {/* =========================
                  HEADER
              ========================= */}
              <div className="mt-3 text-center">

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-velora-gold">
                  Bienvenue
                </p>

                <h1 className="mt-2 font-premium text-3xl font-bold tracking-tight text-black sm:text-4xl">
                  Créer un compte
                </h1>

                <p className="mx-auto mt-1.5 max-w-xs text-sm leading-5 text-black">
                  Créez votre compte et rejoignez notre univers.
                </p>

              </div>

              {/* =========================
                  FORM
              ========================= */}
              <form
                onSubmit={handleSubmit}
                className="mt-5 space-y-4"
              >

                {/* NOM */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black"
                  >
                    Nom complet
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      strokeWidth={1.8}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-velora-gold"
                    />

                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="votre nom"
                      className="h-11 w-full rounded-xl border border-[#E7DED2] bg-white/90 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-velora-gold focus:ring-4 focus:ring-velora-gold/10"
                    />

                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black"
                  >
                    Email
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      strokeWidth={1.8}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-velora-gold"
                    />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      className="h-11 w-full rounded-xl border border-[#E7DED2] bg-white/90 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-velora-gold focus:ring-4 focus:ring-velora-gold/10"
                    />

                  </div>
                </div>

                {/* MOT DE PASSE */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black"
                  >
                    Mot de passe
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      strokeWidth={1.8}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-velora-gold"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border border-[#E7DED2] bg-white/90 pl-11 pr-12 text-sm text-black placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-velora-gold focus:ring-4 focus:ring-velora-gold/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-black transition-colors hover:bg-[#F7F3EC] hover:text-velora-gold"
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={1.8} />
                      ) : (
                        <Eye size={18} strokeWidth={1.8} />
                      )}
                    </button>

                  </div>
                </div>

                {/* CONFIRMATION */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black"
                  >
                    Confirmer le mot de passe
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      strokeWidth={1.8}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-velora-gold"
                    />

                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border border-[#E7DED2] bg-white/90 pl-11 pr-12 text-sm text-black placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-velora-gold focus:ring-4 focus:ring-velora-gold/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Masquer la confirmation du mot de passe"
                          : "Afficher la confirmation du mot de passe"
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-black transition-colors hover:bg-[#F7F3EC] hover:text-velora-gold"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} strokeWidth={1.8} />
                      ) : (
                        <Eye size={18} strokeWidth={1.8} />
                      )}
                    </button>

                  </div>
                </div>

                {/* CONDITIONS */}
                {/* <label className="flex items-start gap-3 pt-1 text-xs leading-5 text-black cursor-pointer">

                  <input
                    type="checkbox"
                    name="accept"
                    checked={form.accept}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-[#D8CBBE] accent-velora-gold focus:ring-2 focus:ring-velora-gold/20"
                  />

                  <span className="text-xs leading-5 text-black">
                    J'accepte les{" "}
                    <span className="font-semibold text-velora-gold">
                      conditions d'utilisation
                    </span>{" "}
                    et la{" "}
                    <span className="font-semibold text-velora-gold">
                      politique de confidentialité
                    </span>
                    .
                  </span>

                </label> */}

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-velora-gold text-sm font-semibold tracking-wide text-white shadow-sm transition-all duration-300 hover:brightness-95 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <span>
                    {loading
                      ? "Création du compte..."
                      : "Créer mon compte"}
                  </span>

                  {!loading && (
                    <ArrowRight
                      size={17}
                      strokeWidth={1.9}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}

                </button>

              </form>

              {/* =========================
                  SEPARATOR
              ========================= */}
              <div className="my-5 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#EFE7DC]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black">
                  ou
                </span>

                <div className="h-px flex-1 bg-[#EFE7DC]" />

              </div>

              {/* =========================
                  LOGIN
              ========================= */}
              <div className="text-center leading-5">

                <p className="text-sm text-black">
                  Déjà un compte ?
                </p>

                <Link
                  to="/login"
                  className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-velora-gold transition-colors hover:text-velora-dark"
                >
                  Se connecter

                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200"
                  />
                </Link>

              </div>

            </div>

            {/* =========================
                BOTTOM BRAND LINE
            ========================= */}
            <div className="border-t border-[#EFE7DC] bg-white/70 px-5 py-3 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black">
                Pensé avec amour pour vos compagnons
              </p>
            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}