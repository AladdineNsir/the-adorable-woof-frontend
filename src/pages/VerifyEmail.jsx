import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyEmail } from "../services/authApi";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  const success = status === "success";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-4">
      <section className="w-full max-w-[460px] rounded-2xl border border-[#E8DED1] bg-white p-8 text-center shadow-[0_20px_60px_rgba(17,17,17,0.10)] sm:p-10">
        {status === "loading" ? (
          <p className="text-sm text-[#5F554E]">Vérification en cours...</p>
        ) : (
          <>
            {success ? <CheckCircle2 className="mx-auto text-velora-gold" size={52} /> : <XCircle className="mx-auto text-red-600" size={52} />}
            <h1 className="mt-5 font-premium text-3xl font-bold text-velora-dark">
              {success ? "Email confirmé" : "Lien invalide ou expiré"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#5F554E]">
              {success ? "Votre compte est maintenant actif. Vous pouvez vous connecter." : "Demandez un nouveau lien de vérification ou recommencez votre inscription."}
            </p>
            <Link to={success ? "/login" : "/register"} className="mt-7 inline-flex h-11 items-center rounded-lg bg-velora-gold px-6 text-sm font-semibold text-white">
              {success ? "Se connecter" : "Retour à l'inscription"}
            </Link>
          </>
        )}
      </section>
    </main>
  );
}