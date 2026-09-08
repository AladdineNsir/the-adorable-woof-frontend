  import React, { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    ArrowRight,
  } from "lucide-react";
  import { motion } from "framer-motion";

  import { login } from "../services/authApi";
  import { useAuth } from "../context/AuthContext";
  import toast from "react-hot-toast";

  export default function Login() {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
      email: "",
      password: "",
    });

    const handleChange = (e) => {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      setLoading(true);

      try {
        const data = await login(form);

        authLogin(data.user, data.token);

        navigate("/");
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Email ou mot de passe incorrect."
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen w-full bg-[#F7F3EC] text-velora-dark flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">

        {/* Décoration très subtile */}
        <div className="pointer-events-none fixed left-0 top-1/4 h-64 w-64 rounded-full bg-velora-gold/5 blur-3xl" />
        <div className="pointer-events-none fixed bottom-0 right-0 h-72 w-72 rounded-full bg-velora-gold/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[460px]"
        >

          {/* =========================
              LOGIN CARD
          ========================= */}
  <div className="relative overflow-hidden rounded-2xl border border-[#E8DED1] shadow-[0_20px_60px_rgba(17,17,17,0.10)]">
    
    {/* IMAGE — prend toute la taille de la carte */}
    <img
      src="/assets/font.png"
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
    />

    {/* Overlay pour rendre le formulaire lisible */}
    <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />

    {/* CONTENU */}
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

              {/* petite ligne gold */}
              {/* <div className="mx-auto mt-5 flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-velora-gold/60" />
                <div className="h-1 w-1 rounded-full bg-velora-gold" />
                <div className="h-px w-8 bg-velora-gold/60" />
              </div> */}

              {/* =========================
                  HEADER
              ========================= */}
              <div className="mt-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-velora-gold">
                  Bienvenue
                </p>

                <h1 className="mt-2 font-premium text-3xl font-bold tracking-tight text-velora-dark sm:text-4xl">
                  Connexion
                </h1>

<p className="mx-auto mt-1.5 max-w-xs text-sm leading-5 text-velora-textGray">                  Connectez-vous à votre compte et retrouvez votre univers.
                </p>
              </div>

              {/* =========================
                  FORM
              ========================= */}
              <form
                onSubmit={handleSubmit}
className="mt-5 space-y-4"              >

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] "
                  >
                    Email
                  </label>

                  <div className="group relative">
                    <Mail
                      size={18}
                      strokeWidth={1.8}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-velora-gold transition-colors"
                    />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="nom@email.com"
                      className="h-11 w-full rounded-xl border border-[#E7DED2] bg-[#FCFAF7] pl-11 pr-4 text-sm text-velora-dark placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-velora-gold focus:bg-white focus:ring-4 focus:ring-velora-gold/10"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-[10px] font-bold uppercase tracking-[0.14em] "
                    >
                      Mot de passe
                    </label>
                  </div>

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
                      className="h-11 w-full rounded-xl border border-[#E7DED2] bg-[#FCFAF7] pl-11 pr-12 text-sm text-velora-dark placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-velora-gold focus:bg-white focus:ring-4 focus:ring-velora-gold/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg  transition-colors hover:bg-[#F7F3EC] hover:text-velora-gold"
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={1.8} />
                      ) : (
                        <Eye size={18} strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                </div>

                {/* FORGOT PASSWORD */}
                <div className="flex justify-end -mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold  transition-colors hover:text-velora-gold"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* =========================
                    LOGIN BUTTON
                ========================= */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-velora-gold text-sm font-semibold tracking-wide text-white shadow-sm transition-all duration-300 hover:brightness-95 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {loading ? "Connexion..." : "Se connecter"}
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
              <div className="my-7 flex items-center gap-2">
                <div className="h-px flex-1 bg-[#EFE7DC]" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                  ou
                </span>
                <div className="h-px flex-1 bg-[#EFE7DC]" />
              </div>

              {/* =========================
                  REGISTER
              ========================= */}
<div className="text-center leading-5">                <p className="text-sm ">
                  Pas encore de compte ?
                </p>

                <Link
                  to="/register"
                  className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-velora-gold transition-colors hover:text-velora-dark"
                >
                  Créer un compte
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>

            </div>

            {/* =========================
                BOTTOM BRAND LINE
            ========================= */}
<div className="border-t border-[#EFE7DC] bg-[#FCFAF7]/80 px-5 py-3 text-center">              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] ">
                Pensé avec amour pour vos compagnons
              </p>
            </div>

          </div>
                  </div>


          {/* =========================
              BACK TO HOME
          ========================= */}
         <div className="fixed right-5 top-5 sm:right-8 sm:top-7 z-50">
  <Link
    to="/"
    className="text-xs font-medium text-black transition-colors hover:text-velora-gold"
  >
    ← Retour à l'accueil
  </Link>
</div>

        </motion.div>
      </div>
    );
  }