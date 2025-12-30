'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Package, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProductsPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [user]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products', {
                headers: { 'x-user-id': user!.uid }
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Produits & Services</h1>
                    <p className="text-gray-600 mt-1">Gérez votre catalogue</p>
                </div>
                <Link
                    href="/dashboard/entreprise/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus className="h-5 w-5" />
                    Nouveau Produit
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-8 w-8 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit</h3>
                        <p className="text-gray-600 mb-6">Ajoutez vos produits et services</p>
                        <Link
                            href="/dashboard/entreprise/products/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus className="h-5 w-5" />
                            Ajouter un produit
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Package className="h-5 w-5 text-purple-600" />
                                </div>
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium capitalize">
                                    {product.type}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description || 'Aucune description'}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-2xl font-bold text-blue-600">{product.price?.toFixed(2)} €</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
