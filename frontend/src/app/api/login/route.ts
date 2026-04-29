import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    // REQUETE VULNERABLE AUX INJECTIONS SQL (a des fins pedagogiques)
    // Ne JAMAIS faire ceci en production !
    const query = `SELECT * FROM utilisateurs WHERE username = '${username}' AND password = '${password}'`;
    
    console.log('Requete SQL:', query);
    
    const result = await pool.query(query);
    
    if (result.rows.length > 0) {
      return NextResponse.json({ 
        success: true, 
        user: result.rows[0],
        message: 'Connexion reussie'
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Identifiants invalides' 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}