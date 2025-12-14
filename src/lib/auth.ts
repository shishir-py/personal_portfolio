import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

interface UserJwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthResult {
  success: boolean;
  message?: string;
  user?: Omit<UserJwtPayload, 'iat' | 'exp'>;
}

export async function verifyJwtToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
    
    const { payload } = await jwtVerify(token, secret);
    
    return payload as unknown as UserJwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function generateJwtToken(payload: Omit<UserJwtPayload, 'iat' | 'exp'>) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
    
    const jwt = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(secret);
    
    return jwt;
  } catch (error) {
    console.error('JWT generation failed:', error);
    throw new Error('Failed to generate token');
  }
}

export async function verifyAuth(request: Request): Promise<AuthResult> {
  try {
    // Check for token in cookies first (server-side)
    let token: string | undefined;
    
    // For API routes, try to get token from cookies in the request headers
    if (request) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = parseCookies(cookieHeader);
        token = cookies['token'];
      }
      
      // If no token in cookies, check Authorization header
      if (!token) {
        const authHeader = request.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }
    } else {
      // For server components, use the cookies() function
      const cookieStore = cookies();
      token = cookieStore.get('token')?.value;
    }
    
    if (!token) {
      return {
        success: false,
        message: 'Authentication token is missing'
      };
    }
    
    // Verify token
    const payload = await verifyJwtToken(token);
    
    if (!payload) {
      return {
        success: false,
        message: 'Invalid authentication token'
      };
    }
    
    // Return user information from payload
    return {
      success: true,
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role
      }
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      success: false,
      message: 'Authentication failed'
    };
  }
}

// Helper function to parse cookies from header
function parseCookies(cookieHeader: string) {
  const list: Record<string, string> = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    const trimmedName = name?.trim();
    if (trimmedName) {
      list[trimmedName] = rest.join('=');
    }
  });
  return list;
}