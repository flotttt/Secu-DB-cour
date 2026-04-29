import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY id_client DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, prenom, email, telephone, adresse, date_naissance } = body;
    const result = await pool.query(
      `INSERT INTO clients (nom, prenom, email, telephone, adresse, date_naissance)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nom, prenom, email, telephone, adresse, date_naissance]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}