import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { requestPasswordReset } from "../services/passwordResetApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#E8DED1] bg-white p-6 shadow-[0_20px_60px_rgba(17,17,17,0.08)] sm:p-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-velora-textGray hover:text-velora-gold"><ArrowLeft size={15} /> Retour à la connexion</Link>
        <h1 className="mt-8 font-premium text-3xl font-bold text-velora-dark">Mot de passe oublié ?</h1>
        <p className="mt-2 text-sm leading-6 text-velora-textGray">Entrez votre email et nous vous enverrons un lien de réinitialisation.</p>
        {sent ? <p className="mt-6 rounded-lg bg-[#EEF9F1] p-4 text-sm leading-6 text-[#2F7D57]">Si cette adresse existe, un lien de réinitialisation a été envoyé.</p> : <form onSubmit={handleSubmit} className="mt-6 space-y-4"><label className="block text-xs font-semibold text-velora-dark">Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nom@email.com" className="mt-2 h-11 w-full rounded-lg border border-[#E7DED2] px-3 text-sm outline-none focus:border-velora-gold" /></label><button type="submit" disabled={loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-velora-gold text-sm font-semibold text-white disabled:opacity-60"><Mail size={16} />{loading ? "Envoi..." : "Envoyer le lien"}</button></form>}
      </section>
    </main>
  );
}
