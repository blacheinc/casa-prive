// app/api/auth/login/route.ts - PRODUCTION LOGIN API
import { NextRequest, NextResponse } from 'next/server';
import { generateToken, setAuthCookie, verifyAdminCredentials } from '@/lib/auth';

// Rate limiting storage (in production, use Redis)
const loginAttempts = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  
  if (!attempt) {
    loginAttempts.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  // Reset after 15 minutes
  if (now - attempt.timestamp > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  // Max 5 attempts per 15 minutes
  if (attempt.count >= 5) {
    return false;
  }
  
  attempt.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials
    const isValid = await verifyAdminCredentials(username, password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = await generateToken(username, 'admin');
    
    // Set cookie
    await setAuthCookie(token);

    // Reset rate limit on successful login
    loginAttempts.delete(ip);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}