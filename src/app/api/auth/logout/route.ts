import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mark as dynamic since this route uses cookies
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Clear the authentication cookie
    cookies().delete('token');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    );
  }
}