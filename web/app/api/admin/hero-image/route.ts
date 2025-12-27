import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET - Fetch active hero image
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hero_images')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching hero image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hero image' },
      { status: 500 }
    );
  }
}

// POST - Upload new hero image
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must not exceed 5 MB' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `hero_${Date.now()}.${fileExt}`;
    const filePath = `hero/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from('public')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('public')
      .getPublicUrl(filePath);

    // Get current active hero image
    const { data: currentHero } = await supabaseAdmin
      .from('hero_images')
      .select('id')
      .eq('is_active', true)
      .single();

    // Deactivate old hero image if exists
    if (currentHero) {
      await supabaseAdmin
        .from('hero_images')
        .update({ is_active: false })
        .eq('id', currentHero.id);
    }

    // Insert new hero image
    const { data: newHeroImage, error: insertError } = await supabaseAdmin
      .from('hero_images')
      .insert({
        image_url: publicUrl,
        uploaded_by: userId || 'admin',
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      data: newHeroImage,
      message: 'Image uploaded successfully',
    });
  } catch (error: any) {
    console.error('Error uploading hero image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// DELETE - Delete hero image
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    // Get image data
    const { data: heroImage } = await supabaseAdmin
      .from('hero_images')
      .select('image_url')
      .eq('id', id)
      .single();

    if (!heroImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Extract file path from URL
    const urlParts = heroImage.image_url.split('/');
    const filePath = `hero/${urlParts[urlParts.length - 1]}`;

    // Delete from storage
    await supabaseAdmin.storage.from('public').remove([filePath]);

    // Delete from database
    await supabaseAdmin.from('hero_images').delete().eq('id', id);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting hero image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}
