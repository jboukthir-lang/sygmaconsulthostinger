'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Package } from 'lucide-react';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Produits & Services</h1>
                    <p className="text-gray-600 mt-1">Gérez votre catalogue</p>
                </div>
                <Link
                    href="/dashboard/entreprise/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="h-5 w-5" />
                    Nouveau Produit
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit</h3>
                        <p className="text-gray-600 mb-6">Ajoutez vos produits et services</p>
                        <Link
                            href="/dashboard/entreprise/products/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5" />
                            Ajouter un produit
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-blue-600">{product.unit_price}€</span>
                                <span className="text-sm text-gray-500">TVA {product.vat_rate}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
