
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ValuesSection from "../components/ValuesSection";
import { API_BASE_URL } from "../config/api";

const ORANGE = "#C96A26";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
const response = await fetch(`${API_BASE_URL}/contact/send`, {      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible d'envoyer le message."
      );
    }

    console.log("✅ Message envoyé :", data.message);

    setSent(true);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error("❌ Erreur Contact :", error);

    alert(
      error.message ||
        "Une erreur est survenue lors de l'envoi du message."
    );
  } finally {
    setLoading(false);
  }
};

  const contactInfo = [
    {
      icon: MapPin,
      label: "Adresse",
      value:
        "Rue du Grand Maghreb\n8075 Dar Chaâbane El Fehri, Tunisie",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "+216 21 142 311",
    },
    {
      icon: Mail,
      label: "Email",
      value: "theadoreablewoof@gmail.com",
    },
    {
      icon: Clock,
      label: "Horaires",
      value: "Lundi - Vendredi\n09:00 • 17:00",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F3EC] text-velora-dark">

      {/* =========================
          HERO
      ========================== */}
      <section className="relative h-[260px] bg-velora-dark sm:h-[300px] lg:h-[320px]">
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-[#C96A26]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C96A26]">
                Contact
              </span>

              <div className="h-px w-8 bg-[#C96A26]" />
            </div>

            <h1 className="font-premium text-3xl font-bold text-white sm:text-4xl lg:text-[42px]">
              Une patte est là
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
              Une question concernant votre commande, un produit ou votre
              compagnon ? Notre équipe The aDoraBle woof co. est disponible
              pour vous accompagner et vous répondre dans les meilleurs
              délais.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================
          CONTENT
      ========================== */}
      <main>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
            {/* =========================
                CONTACT INFORMATION
            ========================== */}
            <motion.section
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
className="hidden sm:block rounded-xl border border-[#E8DED1] bg-white p-5 shadow-[0_8px_30px_rgba(17,17,17,0.04)] sm:p-6"            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96A26]">
                  Contact
                </p>

                <h2 className="mt-2 font-premium text-2xl font-bold text-velora-dark sm:text-3xl">
                  Restons en contact
                </h2>

                
              </div>

              <div className="mt-6 space-y-3">
                {contactInfo.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 rounded-xl border border-[#EFE7DC] bg-white p-4 transition-colors duration-200 hover:border-[#C96A26]/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF7EE] text-[#C96A26]">
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-velora-textGray">
                        {label}
                      </p>

                      <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-velora-dark">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* =========================
                CONTACT FORM
            ========================== */}
            <motion.section
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-xl border border-[#E8DED1] bg-white p-5 shadow-[0_8px_30px_rgba(17,17,17,0.04)] sm:p-6 lg:p-8"
            >
              {sent ? (
                <div className="flex min-h-[430px] flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF7EE]">
                    <CheckCircle
                      size={32}
                      strokeWidth={1.8}
                      className="text-[#C96A26]"
                    />
                  </div>

                  <h2 className="mt-6 font-premium text-2xl font-bold text-velora-dark sm:text-3xl">
                    Merci !
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-7 text-velora-textGray">
                    Votre message a bien été envoyé. Notre équipe vous
                    répondra dans les plus brefs délais.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setForm({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-[#E7DED2] bg-white px-5 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-[#C96A26] hover:text-[#C96A26]"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96A26]">
                      Assistance
                    </p>

                    <h2 className="mt-2 font-premium text-2xl font-bold text-velora-dark sm:text-3xl">
                      Envoyez-nous un message
                    </h2>

                 
                  </div>

                  {/* NOM + EMAIL */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-velora-textGray"
                      >
                        Nom complet
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        className="h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-[#C96A26] focus:ring-2 focus:ring-[#C96A26]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-velora-textGray"
                      >
                        Adresse email
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="email@exemple.com"
                        className="h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-[#C96A26] focus:ring-2 focus:ring-[#C96A26]/10"
                      />
                    </div>
                  </div>

                  {/* SUJET */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-velora-textGray"
                    >
                      Sujet
                    </label>

                    <select
                      id="subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-[#C96A26] focus:ring-2 focus:ring-[#C96A26]/10"
                    >
                      <option value="">Choisir un sujet</option>
                      <option value="commande">
                        Question sur une commande
                      </option>
                      <option value="produit">
                        Question sur un produit
                      </option>
                      <option value="retour">Retour ou échange</option>
                      <option value="personnalisation">
                        Personnalisation
                      </option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-velora-textGray"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={7}
                      required
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="min-h-[150px] w-full resize-none rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 py-4 text-sm text-velora-dark outline-none transition focus:border-[#C96A26] focus:ring-2 focus:ring-[#C96A26]/10"
                    />
                  </div>

                  {/* SUBMIT */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-velora-textGray">
                      Nous répondons généralement sous{" "}
                      <span className="font-semibold text-velora-dark">
                        24 heures ouvrées.
                      </span>
                    </p>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#C96A26] px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#B85E20] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.section>
          </div>
        </div>

        <ValuesSection />
      </main>

    </div>
  );
}