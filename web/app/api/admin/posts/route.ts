import { NextResponse } from 'next/server';
import { getPosts, createPost, updatePost, deletePost } from '@/lib/posts';

export async function GET() {
    try {
        const posts = await getPosts(false); // All posts for admin
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error in GET /api/admin/posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const post = await createPost(body);
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/admin/posts:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        const post = await updatePost(id, updates);
        return NextResponse.json(post);
    } catch (error) {
        console.error('Error in PATCH /api/admin/posts:', error);
        return NextResponse.json(
            { error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        await deletePost(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in DELETE /api/admin/posts:', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}
