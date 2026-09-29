export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 md:p-12 mb-10 shadow-lg relative overflow-hidden">
      <div className="max-w-2xl relative z-10">
        <span className="inline-block bg-blue-500/30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
          Nouveautés SOUKRA 2026
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Trouvez tout ce dont vous avez besoin au meilleur prix.
        </h2>
        <p className="mt-4 text-blue-100 text-base md:text-lg">
          Découvrez notre catalogue de produits sélectionnés avec soin, livrés rapidement chez vous.
        </p>
      </div>

      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    </section>
  );
}