import Header from "./NavBar";

export default function MentionsLegales() {
  return (
    <>
        <Header
        />
    <main className="flex-1 flex flex-col min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">

        <h1 className="text-4xl md:text-5xl font-bold mb-12 pb-2 text-center bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          Mentions Légales
        </h1>

        {/* 1. Éditeur */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">1. Éditeur du site</h2>
          <div className="space-y-2 text-zinc-300">
            <p><strong className="text-white">Raison sociale :</strong> LE PALAIS</p>
            <p><strong className="text-white">Nom commercial :</strong> JUST COOL</p>
            <p><strong className="text-white">Forme juridique :</strong> Société à responsabilité limitée (SARL)</p>
            <p><strong className="text-white">Capital social :</strong> 1 000 €</p>
            <p><strong className="text-white">Siège social :</strong> 2 boulevard de Riquier, 06300 Nice – France</p>
            <div className="pt-2">
              <p><strong className="text-white">Numéro d'immatriculation :</strong> RCS Nice 953 108 271</p>
              <p><strong className="text-white">SIRET :</strong> 953 108 271 00016</p>
              <p><strong className="text-white">Code NAF/APE :</strong> 56.10C (Restauration de type rapide)</p>
              <p><strong className="text-white">Numéro de TVA intracommunautaire :</strong> FR 50 953108271</p>
            </div>
            <div className="pt-2 border-t border-white/5">
              <p><strong className="text-white">Directeur de la publication :</strong> Wassim BEN MIMOUN, en qualité de gérant.</p>
              <p>
                <strong className="text-white">Site internet :</strong>{" "}
                <a href="https://justcool.fr" className="underline hover:text-red-500 transition-colors">
                  https://justcool.fr
                </a>
              </p>
            </div>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 2. Hébergement */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">2. Hébergement du site</h2>
          <div className="space-y-4 text-zinc-300">
            <p>Le site justcool.fr est hébergé par :</p>
            <div className="pl-4 border-l-2 border-red-600 py-1">
              <p><strong className="text-white">Vercel Inc.</strong></p>
              <p>340 S Lemon Ave #4133</p>
              <p>Walnut, CA 91789, États-Unis</p>
              <p>
                Site web :{" "}
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-500 transition-colors">
                  https://vercel.com
                </a>
              </p>
              <p>Téléphone : +1 (559) 288-7060</p>
              <p>Contact : privacy@vercel.com</p>
            </div>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 3. Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">3. Coordonnées de contact</h2>
          <div className="space-y-2 text-zinc-300">
            <p><strong className="text-white">Restaurant JUST COOL</strong></p>
            <p>Adresse : 2 boulevard de Riquier, 06300 Nice, France</p>
            <p>Téléphone : 04 97 12 53 03</p>
            <p>Adresse e-mail : contact@justcool.fr</p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 4. Médiation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">4. Médiation de la consommation</h2>
          <div className="space-y-4 text-zinc-300">
            <p>
              Conformément à l'article L. 612-1 du Code de la consommation, vous avez le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable de tout litige.
            </p>
            <p>En cas de litige, vous pouvez contacter :</p>
            <div className="pl-4 border-l-2 border-red-600 py-1">
              <p><strong className="text-white">Association des Médiateurs Européens (AME CONSO)</strong></p>
              <p>197, Boulevard Saint-Germain, 75007 Paris</p>
              <p>
                Site internet :{" "}
                <a href="https://www.mediationconso-ame.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-500 transition-colors">
                  www.mediationconso-ame.com
                </a>
              </p>
            </div>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 5. Propriété intellectuelle */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">5. Propriété intellectuelle</h2>
          <div className="space-y-4 text-zinc-300">
            <p>
              Le site justcool.fr et l'ensemble de son contenu (textes, images, photographies, logos, éléments graphiques, icônes, mise en page, structure, logiciels) sont la propriété exclusive de la société LE PALAIS ou font l'objet d'une autorisation d'utilisation.
            </p>
            <p>
              Toute reproduction, représentation ou diffusion, totale ou partielle, par quelque procédé que ce soit, sans l'autorisation écrite préalable de la société LE PALAIS est strictement interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 6. Données personnelles */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">6. Données personnelles et Cookies</h2>
          <div className="space-y-4 text-zinc-300">
            <p>
              La société LE PALAIS agit en qualité de responsable de traitement pour les données collectées sur le site. Les modalités de traitement de vos données et l'exercice de vos droits (accès, rectification, effacement) sont détaillés dans notre{" "}
              <strong className="text-white">Politique de confidentialité</strong>.
            </p>
            <p>
              Le site utilise des cookies pour son bon fonctionnement et la mesure d'audience. Vous pouvez paramétrer votre navigateur pour les refuser, bien que cela puisse affecter certaines fonctionnalités.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 7. Limitation de responsabilité */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">7. Limitation de responsabilité</h2>
          <div className="space-y-4 text-zinc-300">
            <p>
              La société LE PALAIS s'efforce d'assurer l'exactitude des informations mais ne peut garantir l'absence totale d'erreurs ou d'omissions. Le contenu du site est fourni à titre indicatif et peut être modifié sans préavis.
            </p>
            <p>
              La responsabilité de la société LE PALAIS ne saurait être engagée en cas d'indisponibilité du site ou de dommages résultant de l'utilisation du site ou de son contenu.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 8. Droit applicable */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">8. Droit applicable</h2>
          <div className="space-y-4 text-zinc-300">
            <p>
              Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut de résolution amiable, les tribunaux du ressort de la{" "}
              <strong className="text-white">Cour d'appel d'Aix-en-Provence</strong> seront seuls compétents.
            </p>
          </div>
        </section>

      </div>
    </main>
    </>
  );
}