import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Champs manquants' },
        { status: 400 }
      );
    }

    const existing = await pool.query(
      'SELECT * FROM utilisateurs WHERE username = $1',
      [username]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Nom d utilisateur deja pris' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO utilisateurs (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, 'user']
    );

    const user = result.rows[0];

    await pool.query(
      'SELECT log_audit_event($1, $2, $3)',
      [username, 'register', 'success']
    );

    return NextResponse.json({
      success: true,
      message: 'Compte cree',
      user: {
        id_utilisateur: user.id_utilisateur,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
