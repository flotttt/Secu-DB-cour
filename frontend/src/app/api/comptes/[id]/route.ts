import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { id_client, numero_compte, type_compte, solde, statut } = body;
    const result = await pool.query(
      `UPDATE comptes SET id_client = $1, numero_compte = $2, type_compte = $3, solde = $4, statut = $5
       WHERE id_compte = $6 RETURNING *`,
      [id_client, numero_compte, type_compte, solde, statut, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM comptes WHERE id_compte = $1', [id]);
    return NextResponse.json({ message: 'Compte supprime' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}