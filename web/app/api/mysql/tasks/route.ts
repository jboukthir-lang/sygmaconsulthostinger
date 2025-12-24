import { NextRequest, NextResponse } from 'next/server';
import { queryAll, executeQuery } from '@/lib/mysql';

// GET /api/mysql/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assigned_to');

    let query = 'SELECT * FROM tasks_with_priority WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (assignedTo) {
      query += ' AND assigned_to = ?';
      params.push(assignedTo);
    }

    query += ' ORDER BY created_at DESC';

    const tasks = await queryAll(query, params);

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error: any) {
    console.error('❌ Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/mysql/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priority_id, status, assigned_to, due_date, created_by } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const result: any = await executeQuery(
      `INSERT INTO tasks (title, description, priority_id, status, assigned_to, due_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description || null, priority_id || null, status || 'pending', assigned_to || null, due_date || null, created_by || null]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        title,
        description,
        priority_id,
        status: status || 'pending'
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error creating task:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/mysql/tasks - Update task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, priority_id, status, assigned_to, due_date } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (priority_id !== undefined) {
      updates.push('priority_id = ?');
      params.push(priority_id);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
      if (status === 'completed') {
        updates.push('completed_at = CURRENT_TIMESTAMP');
      }
    }
    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assigned_to);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    params.push(id);

    await executeQuery(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    return NextResponse.json({
      success: true,
      message: 'Task updated successfully'
    });
  } catch (error: any) {
    console.error('❌ Error updating task:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/mysql/tasks - Delete task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      );
    }

    await executeQuery('DELETE FROM tasks WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
