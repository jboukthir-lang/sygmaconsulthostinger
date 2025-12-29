'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Plus, Search, Trash2, Upload, Loader2, Image as ImageIcon, Eye, Save } from 'lucide-react';
import Image from 'next/image';

interface GalleryItem {
    id: string;
    title_en: string;
    title_fr: string;
    title_ar: string;
    category: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export default function AdminGalleryPage() {
    const { language, t } = useLanguage();
    const { user } = useAuth();

    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [titleEn, setTitleEn] = useState('');
    const [titleFr, setTitleFr] = useState('');
    const [titleAr, setTitleAr] = useState('');
    const [category, setCategory] = useState('general');
    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    async function fetchImages() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('gallery_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    const resetForm = () => {
        setTitleEn('');
        setTitleFr('');
        setTitleAr('');
        setCategory('general');
        setFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert('Veuillez sélectionner une image');
            return;
        }

        try {
            setSaving(true);
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

            console.log('Uploading to gallery bucket:', fileName);

            // Upload Image
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            console.log('Upload successful:', uploadData);

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(fileName);

            console.log('Public URL:', publicUrl);

            // Insert Record
            const { error: insertError } = await supabase
                .from('gallery_items')
                .insert({
                    title_en: titleEn || 'Untitled',
                    title_fr: titleFr || 'Sans titre',
                    title_ar: titleAr || 'بدون عنوان',
                    category,
                    image_url: publicUrl,
                    is_active: true
                });

            if (insertError) {
                console.error('Insert error:', insertError);
                throw new Error(`Database insert failed: ${insertError.message}`);
            }

            alert('✅ Image ajoutée avec succès!');
            fetchImages();
            setShowModal(false);
            resetForm();
        } catch (error: any) {
            console.error('Error saving image:', error);
            alert(`Erreur: ${error.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm(t.galleryView.deleteConfirm)) return;

        try {
            // Delete from Storage (optional optimization)
            // Extract filename from URL...

            // Delete from DB
            const { error } = await supabase
                .from('gallery_items')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setImages(images.filter(img => img.id !== id));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const filteredImages = images.filter(img =>
        img.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.title_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.title_ar?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#001F3F]">{t.galleryView.title}</h1>
                    <p className="text-gray-600 mt-1">{t.galleryView.subtitle}</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] transition-colors shadow-lg shadow-[#D4AF37]/20 font-semibold"
                >
                    <Plus className="h-5 w-5" />
                    {t.galleryView.newImage}
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-[#001F3F]" />
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        {t.galleryView.noImages}
                    </div>
                ) : (
                    filteredImages.map((img) => (
                        <div key={img.id} className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                            <div className="relative h-48 w-full bg-gray-100">
                                <Image
                                    src={img.image_url}
                                    alt={img[`title_${language}` as keyof GalleryItem] as string || 'Gallery Image'}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleDelete(img.id, img.image_url)}
                                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-[#001F3F] truncate">
                                    {img[`title_${language}` as keyof GalleryItem] as string || t.galleryView.imageTitle}
                                </h3>
                                <span className="text-xs text-gray-500 uppercase tracking-wider mt-1 block">
                                    {img.category}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-[#001F3F]">{t.galleryView.newImage}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Image Upload */}
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#001F3F]/50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    required
                                />
                                {imagePreview ? (
                                    <div className="relative h-40 w-full rounded-lg overflow-hidden mx-auto">
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="py-4">
                                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">{t.galleryView.uploadImage}</p>
                                    </div>
                                )}
                            </div>

                            {/* Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                    >
                                        <option value="general">General</option>
                                        <option value="events">Events</option>
                                        <option value="office">Office</option>
                                        <option value="team">Team</option>
                                    </select>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Title (English)"
                                    value={titleEn}
                                    onChange={(e) => setTitleEn(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Titre (Français)"
                                    value={titleFr}
                                    onChange={(e) => setTitleFr(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="العنوان (العربية)"
                                    value={titleAr}
                                    onChange={(e) => setTitleAr(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm text-right"
                                    dir="rtl"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    {t.common.cancel}
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving || !file}
                                    className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {t.common.save}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
