import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

const StarIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" className="text-yellow-400">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

const FlameIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0">
    <path d="M12 6v6l4 2" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

const reviews = [
  { text: "Le meilleur Naan de Nice sans hésiter. La pâte est incroyable et l'accueil toujours au top !", author: "Sofiane B." },
  { text: "Portions généreuses et produits frais. Le Naan burger est une tuerie ! Je recommande à 100%.", author: "Marie L." },
  { text: "Super adresse dans le quartier Riquier. Rapide, propre et vraiment délicieux.", author: "Kevin D." },
];

const commitments = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "La Fraîcheur Avant Tout",
    desc: "Des viandes sélectionnées avec soin, des légumes frais et des sauces gourmandes préparées pour sublimer chaque bouchée.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
      </svg>
    ),
    title: "Générosité & Goût",
    desc: "Chez Just Cool, nous ne lésinons pas sur les portions. Chaque plat est une promesse de satiété et de plaisir gustatif.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    title: "Accueil Chaleureux",
    desc: "Notre équipe est le cœur battant du restaurant. Un accueil professionnel et souriant qui fait notre réputation à Nice.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
      </svg>
    ),
    title: "Rapidité & Qualité",
    desc: "Le meilleur du street-food sans compromis sur la qualité. Nous servons vite, mais nous servons bien.",
  },
];

export default function About() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.05em; }
        .font-body { font-family: 'Inter', sans-serif; }
        .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-in.visible { opacity: 1; transform: none; }
        .fade-delay-1 { transition-delay: 0.1s; }
        .fade-delay-2 { transition-delay: 0.2s; }
        .fade-delay-3 { transition-delay: 0.3s; }
        .fade-delay-4 { transition-delay: 0.4s; }
        .red-glow { box-shadow: 0 0 60px rgba(220,38,38,0.15); }
      `}</style>
      <NavBar />
      {/* HERO */}
      <section className="relative overflow-hidden pt-24 pb-24 bg-black">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-zinc-900/50 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <p className={`font-display text-red-500 text-lg tracking-widest uppercase mb-4 fade-in ${visible ? "visible" : ""}`}>
            L'ADN Just Cool
          </p>
          <h1 className={`font-display text-6xl md:text-8xl text-white mb-8 leading-none fade-in fade-delay-1 ${visible ? "visible" : ""}`}>
            Plus qu'un fast-food,<br />
            <span className="bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
              une expérience de goût à Nice.
            </span>
          </h1>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-start fade-in fade-delay-2 ${visible ? "visible" : ""}`}>
            <p className="font-body text-zinc-400 text-lg leading-relaxed">
              Situé au cœur du quartier <strong className="text-white">Nice Riquier</strong>, à deux pas du Port, Just Cool est né d'une ambition simple : marier la rapidité d'un{" "}
              <strong className="text-white">fast-food halal</strong> de qualité avec l'exigence des meilleurs ingrédients. Un lieu moderne au design soigné, devenu une escale incontournable pour les amateurs de street-food à Nice.
            </p>
            <blockquote className="border-l-2 border-red-500 pl-6 py-2">
              <p className="font-body text-white font-medium text-lg italic">
                "Nous ne servons pas simplement des repas, nous créons des moments de convivialité autour de saveurs authentiques."
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* NAAN SECTION */}
      <section className="py-20 bg-zinc-950 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-sm font-bold uppercase tracking-wider font-body">
                <FlameIcon size={14} /> Expert du Naan
              </div>
              <h2 className="font-display text-5xl md:text-6xl text-white leading-tight">
                L'Âme de Notre Menu :<br />
                <span className="text-red-500">Notre Naan Artisanal</span>
              </h2>
              <p className="font-body text-zinc-400 text-lg leading-relaxed">
                Le secret de Just Cool réside dans son pain <strong className="text-white">Naan artisanal</strong>, préparé et cuit sur place chaque jour. Reconnu par beaucoup comme le{" "}
                <strong className="text-white">meilleur Naan de Nice</strong>, notre pâte est travaillée pour offrir ce moelleux incomparable.
              </p>
              <ol className="space-y-5">
                {[
                  { n: "1", title: "Pâte Pétrie Quotidiennement", desc: "Une texture aérienne et légère, fruit d'un pétrissage matinal méticuleux." },
                  { n: "2", title: "Le Cœur Fondant", desc: <span>Garnis au <strong className="text-zinc-300">véritable fromage Kiri</strong> pour un <strong className="text-zinc-300">Cheese Naan</strong> à l'onctuosité inégalée.</span> },
                  { n: "3", title: "Cuisson Minute", desc: "Saisi à haute température pour conserver tout son moelleux et son parfum." },
                ].map((step) => (
                  <li key={step.n} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0 font-display text-white text-lg">
                      {step.n}
                    </div>
                    <div>
                      <h3 className="font-body text-white font-bold text-lg">{step.title}</h3>
                      <p className="font-body text-zinc-500">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-square bg-gradient-to-br from-red-600 to-zinc-800 rounded-3xl p-8 flex flex-col justify-end overflow-hidden relative group">
                <div className="absolute top-6 right-6 opacity-10 transition-transform group-hover:scale-110 duration-500">
                  <FlameIcon size={180} className="text-white" />
                </div>
                <div className="relative z-10">
                  <p className="font-body text-white/60 font-medium mb-2">Signature Just Cool</p>
                  <h3 className="font-display text-4xl md:text-5xl text-white mb-4">"Fait Maison, Fait Avec Amour."</h3>
                  <div className="h-1 w-20 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMITMENTS */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-5xl text-white mb-4">
              Nos Engagements :<br />Qualité & Accueil 🤝
            </h2>
            <div className="h-1.5 w-20 bg-red-600 mx-auto rounded-full mb-6" />
            <p className="font-body text-zinc-400 text-lg">
              En tant que <strong className="text-white">restaurant halal de référence à Nice</strong>, votre satisfaction est notre priorité.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commitments.map((c, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-red-500/30 transition-all group cursor-default"
              >
                <div className="mb-5 transition-transform duration-300 group-hover:scale-110 inline-block">{c.icon}</div>
                <h3 className="font-body text-white font-bold text-lg mb-3 group-hover:text-red-500 transition-colors">{c.title}</h3>
                <p className="font-body text-zinc-500 leading-relaxed text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS + REVIEWS + CONTACT */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {[
              { label: "Note Google", value: "4.8/5", icon: <StarIcon size={22} /> },
              { label: "Avis Clients", value: "+270", icon: <StarIcon size={22} /> },
              { label: "Ouvert 7j/7", value: "11h – 00h30", icon: <ClockIcon /> },
            ].map((s, i) => (
              <div key={i} className="bg-black/50 border border-white/5 rounded-2xl p-7 flex items-center justify-between group hover:border-red-500/40 transition-colors">
                <div>
                  <p className="font-body text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="font-display text-3xl text-white">{s.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 group-hover:scale-110 transition-transform">{s.icon}</div>
              </div>
            ))}
          </div>

          {/* Reviews + Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Reviews */}
            <div>
              <h2 className="font-display text-5xl text-white mb-4">
                Ce que nos clients<br /><span className="text-red-500">disent de nous.</span>
              </h2>
              <p className="font-body text-zinc-400 text-base mb-10">
                Votre confiance est notre plus belle récompense. Nous mettons tout en œuvre pour vous offrir une expérience irréprochable.
              </p>
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <article key={i} className="bg-black border border-white/5 p-6 rounded-2xl">
                    <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <StarIcon key={j} />)}</div>
                    <p className="font-body text-zinc-300 italic mb-3">"{r.text}"</p>
                    <p className="font-body text-white font-bold text-sm">— {r.author}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="relative">
              <div className="absolute inset-0 bg-red-600/15 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative bg-zinc-900 border border-white/10 p-8 md:p-10 rounded-3xl space-y-7 red-glow">
                <div>
                  <h3 className="font-display text-3xl text-white mb-1 underline decoration-red-500 decoration-4">
                    Le Point de Ralliement
                  </h3>
                  <p className="font-body text-zinc-400 text-sm">Venez nous rendre visite au cœur du quartier Riquier à Nice.</p>
                </div>
                <div className="space-y-4">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Just+Cool+Nice+Riquier"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group"
                  >
                    <MapPinIcon />
                    <span className="font-body">2 Boulevard de Riquier, 06300 Nice</span>
                  </a>
                  <div className="flex items-center gap-4 text-zinc-300">
                    <ClockIcon />
                    <span className="font-body">
                      Ouvert tous les jours : <time dateTime="11:00-00:30">11h00 – 00h30</time>
                    </span>
                  </div>
                </div>
                <a
                  href="/"
                  className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all group font-body w-full"
                >
                  Découvrir la Carte
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    <ArrowRightIcon />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}