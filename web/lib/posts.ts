import { supabase } from './supabase';

export interface Post {
    id: string;
    title_en: string;
    title_fr: string;
    title_ar: string;
    slug: string;
    excerpt_en: string;
    excerpt_fr: string;
    excerpt_ar: string;
    content_en: string;
    content_fr: string;
    content_ar: string;
    author_id?: string;
    author_name: string;
    category: string;
    tags?: string[];
    featured_image?: string;
    published: boolean;
    views: number;
    reading_time: number;
    seo_title_en?: string;
    seo_title_fr?: string;
    seo_title_ar?: string;
    seo_description_en?: string;
    seo_description_fr?: string;
    seo_description_ar?: string;
    seo_keywords?: string[];
    created_at?: string;
    updated_at?: string;
    published_at?: string;
}

export async function getPosts(published = true) {
    try {
        let query = supabase
            .from('posts')
            .select('*');

        if (published) {
            query = query.eq('published', true).order('published_at', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as Post[];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export async function getPostBySlug(slug: string) {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        if (!data) return null;

        // Increment views in background
        supabase.rpc('increment_views', { post_id: data.id }).then(({ error }) => {
            if (error) console.error('Error incrementing views:', error);
        });

        return data as Post;
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'views'>) {
    try {
        const { data, error } = await supabase
            .from('posts')
            .insert([{ ...post, views: 0 }])
            .select()
            .single();

        if (error) throw error;
        return data as Post;
    } catch (error) {
        console.error('Error creating post:', error);
        throw new Error('Failed to create post');
    }
}

export async function updatePost(id: string, updates: Partial<Post>) {
    try {
        const { data, error } = await supabase
            .from('posts')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Post;
    } catch (error) {
        console.error('Error updating post:', error);
        throw new Error('Failed to update post');
    }
}

export async function deletePost(id: string) {
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post');
    }
}
