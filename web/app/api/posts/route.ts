import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/posts';

export async function GET() {
    try {
        const posts = await getPosts(true); // Only published posts
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error in GET /api/posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}
