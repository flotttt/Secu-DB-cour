import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  let username = 'unknown';
  
  try {
    const body = await req.json();
    username = body.username || 'unknown';
    const { password } = body;
    
    await pool.query(
      'SELECT log_audit_event($1, $2, $3)',
      [username, 'login_attempt', 'pending']
    );
    
    const result = await pool.query(
      'SELECT * FROM utilisateurs WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      await pool.query(
        'SELECT log_audit_event($1, $2, $3)',
        [username, 'login_attempt', 'failed']
      );
      return NextResponse.json({ 
        success: false, 
        message: 'Identifiants invalides' 
      }, { status: 401 });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      await pool.query(
        'SELECT log_audit_event($1, $2, $3)',
        [username, 'login_attempt', 'failed']
      );
      return NextResponse.json({ 
        success: false, 
        message: 'Identifiants invalides' 
      }, { status: 401 });
    }
    
    await pool.query(
      'SELECT log_audit_event($1, $2, $3)',
      [username, 'login_attempt', 'success']
    );
    
    return NextResponse.json({ 
      success: true, 
      user: { 
        id_utilisateur: user.id_utilisateur,
        username: user.username, 
        role: user.role 
      },
      message: 'Connexion reussie'
    });
    
  } catch (error) {
    const errorMessage = (error as Error).message;
    
    await pool.query(
      'SELECT log_audit_event($1, $2, $3, $4)',
      [username, 'login_error', 'error', errorMessage]
    );
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}
