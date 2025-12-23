import { query } from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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
        const sql = published
            ? 'SELECT * FROM posts WHERE published = true ORDER BY published_at DESC, created_at DESC'
            : 'SELECT * FROM posts ORDER BY created_at DESC';

        const rows = await query<RowDataPacket[]>(sql);

        return rows.map(row => ({
            ...row,
            tags: row.tags ? JSON.parse(row.tags) : [],
            seo_keywords: row.seo_keywords ? JSON.parse(row.seo_keywords) : []
        })) as Post[];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export async function getPostBySlug(slug: string) {
    try {
        const sql = 'SELECT * FROM posts WHERE slug = ?';
        const rows = await query<RowDataPacket[]>(sql, [slug]);

        if (rows.length === 0) return null;

        const post = {
            ...rows[0],
            tags: rows[0].tags ? JSON.parse(rows[0].tags) : [],
            seo_keywords: rows[0].seo_keywords ? JSON.parse(rows[0].seo_keywords) : []
        } as Post;

        // Increment views
        await query('UPDATE posts SET views = views + 1 WHERE slug = ?', [slug]);

        return post;
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'views'>) {
    try {
        const id = crypto.randomUUID();
        const now = new Date();

        const sql = `
      INSERT INTO posts (
        id, title_en, title_fr, title_ar, slug, excerpt_en, excerpt_fr, excerpt_ar,
        content_en, content_fr, content_ar, author_id, author_name, category, tags,
        featured_image, published, views, reading_time, seo_title_en, seo_title_fr,
        seo_title_ar, seo_description_en, seo_description_fr, seo_description_ar,
        seo_keywords, created_at, updated_at, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        await query(sql, [
            id, post.title_en, post.title_fr, post.title_ar, post.slug,
            post.excerpt_en, post.excerpt_fr, post.excerpt_ar,
            post.content_en, post.content_fr, post.content_ar,
            post.author_id, post.author_name, post.category,
            JSON.stringify(post.tags || []), post.featured_image,
            post.published, 0, post.reading_time,
            post.seo_title_en, post.seo_title_fr, post.seo_title_ar,
            post.seo_description_en, post.seo_description_fr, post.seo_description_ar,
            JSON.stringify(post.seo_keywords || []),
            now, now, post.published ? now : null
        ]);

        return { id, ...post, views: 0, created_at: now.toISOString(), updated_at: now.toISOString() };
    } catch (error) {
        console.error('Error creating post:', error);
        throw new Error('Failed to create post');
    }
}

export async function updatePost(id: string, updates: Partial<Post>) {
    try {
        const keys = Object.keys(updates).filter(k => k !== 'id');
        if (keys.length === 0) return null;

        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values = keys.map(k => {
            const value = (updates as any)[k];
            if (k === 'tags' || k === 'seo_keywords') {
                return JSON.stringify(value || []);
            }
            return value;
        });

        values.push(id);

        const sql = `UPDATE posts SET ${setClause}, updated_at = NOW() WHERE id = ?`;
        await query(sql, values);

        return { id, ...updates };
    } catch (error) {
        console.error('Error updating post:', error);
        throw new Error('Failed to update post');
    }
}

export async function deletePost(id: string) {
    try {
        await query('DELETE FROM posts WHERE id = ?', [id]);
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post');
    }
}
