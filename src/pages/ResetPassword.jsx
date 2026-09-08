import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { resetPassword } from "../services/passwordResetApi";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmation) return toast.error("Les mots de passe ne correspondent pas.");
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success("Mot de passe réinitialisé.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lien invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#E8DED1] bg-white p-6 shadow-[0_20px_60px_rgba(17,17,17,0.08)] sm:p-8">
        <CheckCircle className="text-velora-gold" size={28} />
        <h1 className="mt-5 font-premium text-3xl font-bold text-velora-dark">Nouveau mot de passe</h1>
        <p className="mt-2 text-sm leading-6 text-velora-textGray">Choisissez un mot de passe d'au moins 6 caractères.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4"><label className="block text-xs font-semibold text-velora-dark">Nouveau mot de passe<div className="relative mt-2"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-velora-gold" /><input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 w-full rounded-lg border border-[#E7DED2] pl-10 pr-3 text-sm outline-none focus:border-velora-gold" /></div></label><label className="block text-xs font-semibold text-velora-dark">Confirmer le mot de passe<input type="password" required minLength={6} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-[#E7DED2] px-3 text-sm outline-none focus:border-velora-gold" /></label><button type="submit" disabled={loading} className="h-11 w-full rounded-lg bg-velora-gold text-sm font-semibold text-white disabled:opacity-60">{loading ? "Enregistrement..." : "Réinitialiser le mot de passe"}</button></form><Link to="/login" className="mt-5 block text-center text-xs font-semibold text-velora-textGray hover:text-velora-gold">Retour à la connexion</Link>
      </section>
    </main>
  );
}
