import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import SEO from "../components/SEO";

const questions = [
  {
    question: "Combien coûte la livraison ?",
    answer: "La livraison est facturée 7 DT partout en Tunisie. Le montant exact est affiché avant la confirmation de la commande.",
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Les commandes sont généralement livrées sous 2 à 4 jours ouvrables après confirmation téléphonique.",
  },
  {
    question: "Comment suivre ma commande ?",
    answer: "Connectez-vous à votre compte puis ouvrez la rubrique Mes commandes. Notre équipe vous contacte également pour confirmer la livraison.",
  },
  {
    question: "Puis-je retourner un article ?",
    answer: "Contactez-nous avant l'expédition avec votre numéro de commande afin que notre équipe vous indique la procédure adaptée.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <SEO
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: questions.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      <main className="min-h-[70vh] bg-[#F7F3EC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF7EE] text-velora-gold">
            <HelpCircle size={24} />
          </div>
          <h1 className="mt-4 font-premium text-3xl font-bold text-velora-dark">Questions fréquentes</h1>
          <p className="mt-2 text-sm leading-6 text-velora-textGray">Les réponses essentielles avant votre commande.</p>
        </div>

        <div className="space-y-3">
          {questions.map((item, index) => {
            const open = openIndex === index;
            return (
              <section key={item.question} className="overflow-hidden rounded-xl border border-[#E8DED1] bg-white">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-velora-dark"
                >
                  {item.question}
                  <ChevronDown size={18} className={`shrink-0 transition-transform ${open ? "rotate-180 text-velora-gold" : ""}`} />
                </button>
                {open && <p className="border-t border-[#EFE7DC] px-5 py-4 text-sm leading-6 text-velora-textGray">{item.answer}</p>}
              </section>
            );
          })}
        </div>
      </div>
      </main>
    </>
  );
}
