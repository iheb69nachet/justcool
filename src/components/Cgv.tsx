export default function CGV() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-12">

        <h1 className="text-4xl md:text-5xl font-bold mb-12 pb-2 text-center bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          Conditions Générales de Vente (CGV)
        </h1>

        <p className="text-zinc-400 italic text-center">Dernière mise à jour : 24 décembre 2025</p>

        <p className="text-zinc-300 text-lg">
          Les présentes Conditions Générales de Vente (ci-après "CGV") s'appliquent à toutes les commandes passées auprès du restaurant{" "}
          <strong className="text-white">JUST COOL</strong>, exploité par la société{" "}
          <strong className="text-white">LE PALAIS</strong>, via le site internet{" "}
          <a href="https://justcool.fr" className="underline hover:text-red-500 transition-colors">
            https://justcool.fr
          </a>.
        </p>

        <hr className="border-white/10" />

        {/* 1. Objet */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">1. Objet</h2>
          <div className="space-y-4 text-zinc-300">
            <p>
              Les présentes CGV ont pour objet de définir les conditions dans lesquelles les clients (ci-après "le Client") peuvent commander des produits alimentaires et des boissons (ci-après "les Produits") proposés par le restaurant JUST COOL. Toute commande effectuée sur le site implique l'acceptation sans réserve des présentes CGV.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 2. Produits */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">2. Produits</h2>
          <div className="space-y-4 text-zinc-300">
            <p>Les Produits proposés sont ceux figurant sur le menu en ligne du site le jour de la consultation.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Disponibilité :</strong> Les offres de Produits sont valables dans la limite des stocks disponibles au restaurant. En cas d'indisponibilité, le restaurant contactera le Client pour proposer un échange ou un remboursement.</li>
              <li><strong className="text-white">Photos :</strong> Les photographies du menu sont illustratives et non contractuelles.</li>
              <li><strong className="text-white">Allergènes :</strong> Les informations sur les allergènes sont disponibles sur demande au restaurant ou via les coordonnées de contact.</li>
            </ul>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 3. Commandes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">3. Commandes</h2>
          <div className="space-y-4 text-zinc-300">
            <p>Le processus de commande comprend :</p>
            <div className="space-y-3">
              {[
                "La sélection des Produits dans le panier.",
                "La validation du panier.",
                "Le choix du mode de retrait (Vente à emporter / Click & Collect) ou de livraison (le cas échéant).",
                "Le paiement de la commande.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-red-600 font-bold w-4 shrink-0 text-right">{i + 1}.</span>
                  <p className="flex-1">{step}</p>
                </div>
              ))}
            </div>
            <p>La vente n'est considérée comme définitive qu'après confirmation par e-mail et encaissement du paiement.</p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 4. Prix et Paiement */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">4. Prix et Paiement</h2>
          <div className="space-y-4 text-zinc-300">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Prix :</strong> Les prix sont indiqués en Euros (€) Toutes Taxes Comprises (TTC), au taux de TVA en vigueur au jour de la commande.</li>
              <li><strong className="text-white">Paiement :</strong> Le paiement s'effectue en ligne par carte bancaire via la plateforme sécurisée <strong className="text-white">Stripe</strong>. Les données bancaires ne sont pas stockées par le site justcool.fr.</li>
              <li><strong className="text-white">Défaut de paiement :</strong> Le restaurant se réserve le droit de suspendre ou d'annuler toute commande en cas de problème de paiement ou de litige existant avec le Client.</li>
            </ul>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 5. Absence de droit de rétractation */}
        <section className="space-y-4 border-l-4 border-red-600 pl-6 bg-white/5 py-4 rounded-r-lg">
          <h2 className="text-2xl font-bold text-red-600 italic underline underline-offset-8">
            5. Absence de droit de rétractation
          </h2>
          <div className="space-y-4 text-zinc-300 mt-4">
            <p>
              Conformément à l'article <strong className="text-white">L. 221-28 4° du Code de la consommation</strong>, le droit de rétractation ne s'applique pas aux contrats de fourniture de biens qui, par leur nature, sont susceptibles de se détériorer ou de se périmer rapidement.
            </p>
            <p className="font-bold text-white uppercase bg-red-600/10 p-2 rounded">
              Par conséquent, aucune commande de Produits alimentaires validée et payée ne pourra faire l'objet d'un droit de rétractation, d'un échange ou d'un remboursement après sa préparation.
            </p>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 6. Retrait et Livraison */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">6. Retrait et Livraison</h2>
          <div className="space-y-4 text-zinc-300">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Click & Collect :</strong> Le Client s'engage à retirer sa commande au restaurant (2 boulevard de Riquier, Nice) au créneau horaire choisi. En cas de retard important, la qualité des Produits ne peut être garantie.</li>
              <li><strong className="text-white">Livraison :</strong> Si le service est disponible, le Client doit fournir des informations exactes (code, étage, téléphone). Le retard de livraison raisonnable ne peut donner lieu à dommages et intérêts.</li>
            </ul>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 7. Responsabilité */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">7. Responsabilité</h2>
          <div className="space-y-4 text-zinc-300">
            <p>La responsabilité de la société LE PALAIS ne saurait être engagée en cas de :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Dommages liés à une mauvaise conservation des Produits par le Client après retrait ou livraison.</li>
              <li>Interruptions du service liées à des problèmes techniques indépendants de sa volonté.</li>
              <li>Événement de force majeure.</li>
            </ul>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 8. Médiation et Litiges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">8. Médiation et Litiges</h2>
          <div className="space-y-4 text-zinc-300">
            <p>
              Pour toute réclamation, le Client est invité à contacter le restaurant à :{" "}
              <a href="mailto:contact@justcool.fr" className="underline hover:text-red-500 transition-colors">
                contact@justcool.fr
              </a>.
            </p>
            <p>Si aucun accord amiable n'est trouvé, le Client peut recourir gratuitement au médiateur de la consommation :</p>
            <div className="pl-4 border-l-2 border-red-600 py-1">
              <p><strong className="text-white">AME CONSO</strong></p>
              <p>197 Boulevard Saint-Germain, 75007 Paris</p>
              <p>
                Site web :{" "}
                <a href="https://www.mediationconso-ame.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-500 transition-colors">
                  www.mediationconso-ame.com
                </a>
              </p>
            </div>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* 9. Droit applicable */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">9. Droit applicable et Juridiction</h2>
          <div className="space-y-4 text-zinc-300">
            <p>
              Les présentes CGV sont soumises au droit français. À défaut de résolution amiable, tout litige relatif à leur interprétation ou leur exécution sera porté devant les tribunaux compétents du ressort de la{" "}
              <strong className="text-white">Cour d'appel d'Aix-en-Provence</strong>.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}