/**
 * Authentication Helper Functions (Supabase-backed)
 *
 * Use these in API routes to validate the Authorization bearer token that
 * Supabase sets on the client after OTP verification.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from './supabase';
import type { User } from '@/types';

/**
 * Get authenticated user from API request using the Supabase bearer token.
 */
export async function getAuthenticatedUser(req: NextApiRequest): Promise<User | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email || '',
    companyName: data.user.user_metadata?.companyName || data.user.email?.split('@')[0] || '',
    createdAt: data.user.created_at || new Date().toISOString(),
  };
}

/**
 * Require authentication in API route. Returns null and sends 401 if missing.
 */
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | null> {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  return user;
}
