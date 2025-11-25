import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product, ApiResponse } from '@/types/products'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data: ApiResponse<Product> = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-block mb-6 text-gray-600 hover:text-gray-900 transition-colors"
      >
        ← Volver a productos
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.nombre}
            className="w-full h-96 object-cover rounded mb-6"
          />
        )}
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {product.nombre}
        </h1>
        
        <div className="text-3xl font-bold text-gray-900 mb-8">
          ${product.precio}
        </div>

        {product.Category && (
          <div className="mb-6 p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">
              <strong>Categoría:</strong> {product.Category.nombre}
            </p>
          </div>
        )}

        {product.description && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Descripción
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-500">
          ID del producto: {product.id}
        </div>
      </div>
    </div>
  );
}