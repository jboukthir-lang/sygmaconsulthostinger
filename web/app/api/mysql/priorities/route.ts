import { NextRequest, NextResponse } from 'next/server';
import { queryAll, executeQuery } from '@/lib/mysql';

// GET /api/mysql/priorities - Get all priorities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active_only') === 'true';

    let query = 'SELECT * FROM priorities';
    const params: any[] = [];

    if (activeOnly) {
      query += ' WHERE is_active = ?';
      params.push(true);
    }

    query += ' ORDER BY display_order ASC, name ASC';

    const priorities = await queryAll(query, params);

    return NextResponse.json({
      success: true,
      data: priorities,
      count: priorities.length
    });
  } catch (error: any) {
    console.error('❌ Error fetching priorities:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/mysql/priorities - Create new priority
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, name_ar, name_fr, color, icon, display_order } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const result: any = await executeQuery(
      `INSERT INTO priorities (name, name_ar, name_fr, color, icon, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, name_ar || null, name_fr || null, color || '#001F3F', icon || null, display_order || 0]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        name,
        name_ar,
        name_fr,
        color,
        icon,
        display_order
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error creating priority:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
