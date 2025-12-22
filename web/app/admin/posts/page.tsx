'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase, Post } from '@/lib/supabase';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Search,
    Loader2,
    FileText,
    Calendar,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPostsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        drafts: 0,
        totalViews: 0
    });

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login?redirect=/admin/posts');
            } else {
                fetchPosts();
            }
        }
    }, [user, authLoading, router]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setPosts(data);
                calculateStats(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (postsData: Post[]) => {
        const total = postsData.length;
        const published = postsData.filter(p => p.published).length;
        const drafts = total - published;
        const totalViews = postsData.reduce((sum, p) => sum + (p.views || 0), 0);

        setStats({ total, published, drafts, totalViews });
    };

    const togglePublish = async (postId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('posts')
                .update({
                    published: !currentStatus,
                    published_at: !currentStatus ? new Date().toISOString() : null
                })
                .eq('id', postId);

            if (error) throw error;
            fetchPosts();
        } catch (error) {
            console.error('Error toggling publish status:', error);
            alert('Failed to update publish status');
        }
    };

    const deletePost = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId);

            if (error) throw error;
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch =
            post.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.title_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' ? true :
            filterStatus === 'published' ? post.published :
            !post.published;

        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-[#001F3F] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#001F3F]">Posts Management</h1>
                            <p className="text-gray-600 mt-1">Create and manage blog posts for your website</p>
                        </div>
                        <Link
                            href="/admin/posts/new"
                            className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] transition-colors font-semibold"
                        >
                            <Plus className="h-5 w-5" />
                            New Post
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Posts</p>
                                    <p className="text-3xl font-bold text-[#001F3F] mt-1">{stats.total}</p>
                                </div>
                                <FileText className="h-10 w-10 text-blue-500 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Published</p>
                                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.published}</p>
                                </div>
                                <Eye className="h-10 w-10 text-green-500 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Drafts</p>
                                    <p className="text-3xl font-bold text-orange-600 mt-1">{stats.drafts}</p>
                                </div>
                                <Calendar className="h-10 w-10 text-orange-500 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Views</p>
                                    <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalViews}</p>
                                </div>
                                <TrendingUp className="h-10 w-10 text-purple-500 opacity-20" />
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search posts by title or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filterStatus === 'all'
                                        ? 'bg-[#001F3F] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterStatus('published')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filterStatus === 'published'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Published
                            </button>
                            <button
                                onClick={() => setFilterStatus('draft')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filterStatus === 'draft'
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Drafts
                            </button>
                        </div>
                    </div>
                </div>

                {/* Posts Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-700">Title</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Views</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPosts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-gray-500">
                                            No posts found. Create your first post to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPosts.map((post) => (
                                        <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900 line-clamp-2">{post.title_en}</div>
                                                <div className="text-sm text-gray-500 mt-1">by {post.author_name}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {post.published ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1 w-fit">
                                                        <Eye className="h-3 w-3" />
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full flex items-center gap-1 w-fit">
                                                        <EyeOff className="h-3 w-3" />
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-gray-600">{post.views || 0}</td>
                                            <td className="p-4 text-gray-600 text-sm">{formatDate(post.created_at)}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/posts/edit/${post.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => togglePublish(post.id!, post.published!)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title={post.published ? "Unpublish" : "Publish"}
                                                    >
                                                        {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => deletePost(post.id!)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Back to Dashboard */}
                <div className="mt-8 text-center">
                    <Link
                        href="/admin"
                        className="text-[#001F3F] hover:text-[#D4AF37] font-medium"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
