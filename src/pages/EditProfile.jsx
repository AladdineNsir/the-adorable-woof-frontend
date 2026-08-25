
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  ChevronRight,
  Home,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

import {
  getProfile,
  updateProfile,
} from "../services/authApi";

export default function EditProfile() {

  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    try {

      const data = await getProfile();

      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        street: data.user.address?.street || "",
        city: data.user.address?.city || "",
        zipCode: data.user.address?.zipCode || "",
        country: data.user.address?.country || "",
      });

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const handleChange = (e) => {

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSaving(true);

   try {
  await updateProfile(form);

  // Récupérer les données mises à jour depuis le serveur
  const data = await getProfile();

  // Mettre à jour le user global + localStorage
  updateUser(data.user);

  toast.success("Profil mis à jour avec succès.");

  navigate("/account");
} catch (err) {

      toast.error(
  err.response?.data?.message ||
  "Erreur lors de la mise à jour."
);

    } finally {

      setSaving(false);

    }

  };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EC]">

        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full border-2 border-velora-dark border-t-transparent animate-spin" aria-hidden="true" />
          <div className="text-sm font-semibold text-velora-dark">Chargement...</div>
        </div>

      </div>

    );

  }

  return (

    <>

      <Navbar />


      <div className="min-h-screen bg-[#F7F3EC]">

        {/* HERO / Breadcrumb */}

        <section className="bg-white border-b border-velora-dark/5">

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >

              <div className="flex items-center justify-center gap-2">

                <div className="h-px w-8 bg-velora-gold" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-velora-gold">Modifier mon profil</span>

                <div className="h-px w-16 bg-velora-gold" />

              </div>

              <h2 className="mt-4 text-2xl sm:text-3xl font-premium font-bold text-velora-dark">Modifier votre profil</h2>

            </motion.div>

          </div>

        </section>

        {/* CONTENU */}

        <section className="py-8">

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb */}

            

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-xl border border-[#E8DED1] bg-white shadow-[0_8px_30px_rgba(17,17,17,0.04)]"
            >

              {/* Header */}

              <div className="flex items-start justify-between border-b border-[#EFE7DC] p-5 sm:p-6 lg:p-7">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-velora-gold">Informations</p>



                </div>

                <Link to="/account" className="inline-flex items-center gap-2 rounded-lg border border-[#E7DED2] bg-white px-4 h-10 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold">
                  ← Profil
                </Link>

              </div>

              <form onSubmit={handleSubmit} className="p-5 sm:p-6 lg:p-7 space-y-7">
                {/* Nom + Email */}

                <div className="grid gap-4 lg:grid-cols-2">

                  {/* Nom */}

                  <div>

                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Nom complet *</label>

                    <div className="relative">

                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-velora-gold" />

                      <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Votre nom" className="h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] pl-12 pr-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />

                    </div>

                  </div>

                  {/* Email */}

                  <div>

                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Adresse email *</label>

                    <div className="relative">

                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-velora-gold" />

                      <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="nom@email.com" className="h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] pl-12 pr-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />

                    </div>

                  </div>

                </div>

{/* Téléphone */}

                <div>

                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Téléphone</label>

                  <div className="relative">

                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-velora-gold" />

                    <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+216 xx xxx xxx" className="h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] pl-12 pr-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />

                  </div>

                </div>
{/* Adresse */}

                <div>

                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Adresse</label>

                  <div className="relative">

                    <MapPin size={18} className="absolute left-4 top-4 text-velora-gold" />

                    <textarea rows={4} name="street" value={form.street} onChange={handleChange} placeholder="Rue, Avenue..." className="w-full resize-none min-h-[110px] rounded-lg border border-[#E7DED2] bg-[#FCFAF7] py-3 pl-12 pr-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />

                  </div>

                </div>

{/* Ville / Code Postal / Pays */}

                <div className="grid gap-4 lg:grid-cols-3">

  {/* Ville */}

  <div>


    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Ville</label>

    <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Nabeul" className="h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />

  </div>

  {/* Code Postal */}

  <div>


    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Code postal</label>

    <input type="text" name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="8000" className="h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />

  </div>

  {/* Pays */}

  <div>


    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Pays</label>

    <input type="text" name="country" value={form.country} onChange={handleChange} placeholder="Tunisie" className="h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />

  </div>

</div>

                {/* Séparateur */}

                <div className="border-t border-[#EFE7DC] pt-6">

                  <h3 className="text-lg sm:text-xl font-premium font-bold text-velora-dark">Vérifiez vos informations</h3>

                  <p className="mt-2 text-sm leading-6 text-velora-textGray">Assurez-vous que vos coordonnées sont correctes afin de faciliter la livraison de vos commandes et de recevoir toutes les informations importantes concernant votre compte.</p>

                </div>
{/* Boutons */}


                <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">

                  <button type="button" onClick={() => navigate("/account")} className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold">
                    Annuler
                  </button>

                  <button type="submit" disabled={saving} className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-velora-gold px-6 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60">
                    <Save size={18} />
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>

                </div>

</form>

</motion.div>

</div>

</section>

</div>

<Footer />

</>

);

}