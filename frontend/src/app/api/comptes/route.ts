import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM comptes ORDER BY id_compte DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_client, numero_compte, type_compte, solde, statut } = body;
    const result = await pool.query(
      `INSERT INTO comptes (id_client, numero_compte, type_compte, solde, statut)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_client, numero_compte, type_compte, solde, statut || 'actif']
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}