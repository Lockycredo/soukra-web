import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 flex flex-col justify-between p-4 text-gray-800">
      <div>
        <div className="h-44 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 font-medium overflow-hidden">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="h-full w-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-sm text-gray-400">Image indisponible</span>
          )}
        </div>
        
        {product.category && (
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full">
            {product.category.name}
          </span>
        )}

        <h3 className="text-lg font-bold text-gray-900 mt-2">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {product.description || 'Aucune description fournie.'}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xl font-extrabold text-emerald-600">
          {product.price.toLocaleString()} FCFA
        </span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          Voir
        </button>
      </div>
    </div>
  );
}