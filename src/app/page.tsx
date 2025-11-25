import Link from 'next/link';
import { Product, ApiResponse, Category } from '../types/products';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const data: ApiResponse<Product[]> = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  // Extraer categorías únicas
  const categories: Category[] = [];
  const categoryMap = new Map<number, Category>();
  
  products.forEach(product => {
    if (product.Category && !categoryMap.has(product.Category.id)) {
      categoryMap.set(product.Category.id, product.Category);
      categories.push(product.Category);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Productos</h1>
      
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-gray-600 self-center mr-2">
            Filtrar por categoría:
          </span>
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
            >
              {cat.nombre}
            </span>
          ))}
        </div>
      )}
      
      {products.length === 0 ? (
        <p className="text-center py-12 bg-white rounded-lg border border-gray-200">
          No hay productos disponibles
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.nombre}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {product.nombre}
              </h2>
              <p className="text-2xl font-bold text-gray-900 mb-3">
                ${product.precio}
              </p>
              {product.Category && (
                <p className="text-sm text-gray-500 mb-2">
                  Categoría: {product.Category.nombre}
                </p>
              )}
              {product.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}