'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Eye, Loader2, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function NewPostPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'fr' | 'ar'>('en');

    const [formData, setFormData] = useState({
        title_en: '',
        title_fr: '',
        title_ar: '',
        slug: '',
        excerpt_en: '',
        excerpt_fr: '',
        excerpt_ar: '',
        content_en: '',
        content_fr: '',
        content_ar: '',
        author_name: user?.displayName || 'Admin',
        category: 'Business Advisory',
        tags: [] as string[],
        featured_image: '',
        published: false,
        reading_time: 5,
        seo_title_en: '',
        seo_title_fr: '',
        seo_title_ar: '',
        seo_description_en: '',
        seo_description_fr: '',
        seo_description_ar: '',
        seo_keywords: [] as string[]
    });

    const [tagInput, setTagInput] = useState('');
    const [keywordInput, setKeywordInput] = useState('');

    const categories = [
        'Business Advisory',
        'Market Analysis',
        'Investment Strategies',
        'Company News',
        'Industry Insights',
        'Economic Trends'
    ];

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (lang: 'en' | 'fr' | 'ar', value: string) => {
        setFormData(prev => ({
            ...prev,
            [`title_${lang}`]: value,
            // Auto-generate slug from English title
            slug: lang === 'en' ? generateSlug(value) : prev.slug
        }));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    const addKeyword = () => {
        if (keywordInput.trim() && !formData.seo_keywords.includes(keywordInput.trim())) {
            setFormData(prev => ({
                ...prev,
                seo_keywords: [...prev.seo_keywords, keywordInput.trim()]
            }));
            setKeywordInput('');
        }
    };

    const removeKeyword = (keyword: string) => {
        setFormData(prev => ({
            ...prev,
            seo_keywords: prev.seo_keywords.filter(k => k !== keyword)
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `posts/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, featured_image: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
        e.preventDefault();
        setLoading(true);

        try {
            const postData = {
                ...formData,
                published: publish,
                published_at: publish ? new Date().toISOString() : null,
                author_id: user?.uid || null,
                // Auto-fill SEO fields if empty
                seo_title_en: formData.seo_title_en || formData.title_en,
                seo_title_fr: formData.seo_title_fr || formData.title_fr,
                seo_title_ar: formData.seo_title_ar || formData.title_ar,
                seo_description_en: formData.seo_description_en || formData.excerpt_en,
                seo_description_fr: formData.seo_description_fr || formData.excerpt_fr,
                seo_description_ar: formData.seo_description_ar || formData.excerpt_ar,
            };

            const { error } = await supabase
                .from('posts')
                .insert([postData]);

            if (error) throw error;

            alert(publish ? 'Post published successfully!' : 'Post saved as draft!');
            router.push('/admin/posts');
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/posts"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#001F3F] mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Posts
                    </Link>
                    <h1 className="text-3xl font-bold text-[#001F3F]">Create New Post</h1>
                    <p className="text-gray-600 mt-1">Write and publish a new blog post</p>
                </div>

                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                    {/* Featured Image */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-[#001F3F] mb-4">Featured Image</h2>
                        <div className="flex items-center gap-4">
                            {formData.featured_image ? (
                                <div className="relative">
                                    <img
                                        src={formData.featured_image}
                                        alt="Featured"
                                        className="w-48 h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Upload className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                            <div>
                                <label className="cursor-pointer px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors inline-flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                                <p className="text-sm text-gray-500 mt-2">Recommended: 1200x630px</p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-[#001F3F] mb-4">Basic Information</h2>

                        {/* Language Tabs */}
                        <div className="flex gap-2 mb-6 border-b">
                            <button
                                type="button"
                                onClick={() => setActiveTab('en')}
                                className={`px-4 py-2 font-medium transition-colors ${
                                    activeTab === 'en'
                                        ? 'text-[#001F3F] border-b-2 border-[#D4AF37]'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                English
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('fr')}
                                className={`px-4 py-2 font-medium transition-colors ${
                                    activeTab === 'fr'
                                        ? 'text-[#001F3F] border-b-2 border-[#D4AF37]'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Français
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('ar')}
                                className={`px-4 py-2 font-medium transition-colors ${
                                    activeTab === 'ar'
                                        ? 'text-[#001F3F] border-b-2 border-[#D4AF37]'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                العربية
                            </button>
                        </div>

                        {/* Title */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title ({activeTab.toUpperCase()})
                            </label>
                            <input
                                type="text"
                                required
                                value={formData[`title_${activeTab}` as keyof typeof formData] as string}
                                onChange={(e) => handleTitleChange(activeTab, e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                placeholder={`Enter post title in ${activeTab.toUpperCase()}`}
                            />
                        </div>

                        {/* Slug (Only show for EN) */}
                        {activeTab === 'en' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                    placeholder="post-url-slug"
                                />
                            </div>
                        )}

                        {/* Excerpt */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt ({activeTab.toUpperCase()})
                            </label>
                            <textarea
                                required
                                rows={3}
                                value={formData[`excerpt_${activeTab}` as keyof typeof formData] as string}
                                onChange={(e) => setFormData(prev => ({ ...prev, [`excerpt_${activeTab}`]: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                placeholder="Brief summary of the post"
                            />
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content ({activeTab.toUpperCase()})
                            </label>
                            <textarea
                                required
                                rows={12}
                                value={formData[`content_${activeTab}` as keyof typeof formData] as string}
                                onChange={(e) => setFormData(prev => ({ ...prev, [`content_${activeTab}`]: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 font-mono text-sm"
                                placeholder="Write your post content (supports markdown)"
                            />
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-[#001F3F] mb-4">Metadata</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.author_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reading Time (minutes)</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.reading_time}
                                onChange={(e) => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) || 5 }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                    placeholder="Add a tag..."
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366]"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-[#001F3F] mb-4">SEO Settings</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SEO Title ({activeTab.toUpperCase()})
                            </label>
                            <input
                                type="text"
                                value={formData[`seo_title_${activeTab}` as keyof typeof formData] as string}
                                onChange={(e) => setFormData(prev => ({ ...prev, [`seo_title_${activeTab}`]: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                placeholder="Leave empty to use post title"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SEO Description ({activeTab.toUpperCase()})
                            </label>
                            <textarea
                                rows={2}
                                value={formData[`seo_description_${activeTab}` as keyof typeof formData] as string}
                                onChange={(e) => setFormData(prev => ({ ...prev, [`seo_description_${activeTab}`]: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                placeholder="Leave empty to use excerpt"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SEO Keywords</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                    placeholder="Add SEO keyword..."
                                />
                                <button
                                    type="button"
                                    onClick={addKeyword}
                                    className="px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366]"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.seo_keywords.map(keyword => (
                                    <span key={keyword} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                                        {keyword}
                                        <button type="button" onClick={() => removeKeyword(keyword)}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                        <Link
                            href="/admin/posts"
                            className="text-gray-600 hover:text-[#001F3F]"
                        >
                            Cancel
                        </Link>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save as Draft
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={loading}
                                className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] transition-colors font-semibold flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                                Publish Now
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
