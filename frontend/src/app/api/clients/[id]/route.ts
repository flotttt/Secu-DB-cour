import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nom, prenom, email, telephone, adresse, date_naissance } = body;
    const result = await pool.query(
      `UPDATE clients SET nom = $1, prenom = $2, email = $3, telephone = $4, adresse = $5, date_naissance = $6
       WHERE id_client = $7 RETURNING *`,
      [nom, prenom, email, telephone, adresse, date_naissance, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM clients WHERE id_client = $1', [id]);
    return NextResponse.json({ message: 'Client supprime' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}