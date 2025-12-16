import { ClientSession, User } from "@/types";
import { supabase } from './supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const SESSION_KEY = 'cehpoint_session';
const USER_KEY = 'cehpoint_user';
const QUESTIONNAIRE_DRAFT_KEY = 'cehpoint_questionnaire_draft';

const isBrowser = typeof window !== 'undefined';

const cacheUser = (user: User) => {
  if (isBrowser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

const getCachedUser = (): User | null => {
  if (!isBrowser) return null;
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

const mapSupabaseUser = (user: SupabaseUser): User => ({
  id: user.id,
  email: user.email || '',
  companyName: (user.user_metadata as Record<string, any>)?.companyName || user.email?.split('@')[0] || '',
  createdAt: user.created_at || new Date().toISOString(),
});

export function saveSession(session: ClientSession): void {
  if (isBrowser) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export function getSession(): ClientSession | null {
  if (isBrowser) {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function clearSession(): void {
  if (isBrowser) {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function saveUser(user: User): void {
  cacheUser(user);
}

export async function getUser(forceRefresh = false): Promise<User | null> {
  if (!forceRefresh) {
    const cached = getCachedUser();
    if (cached) return cached;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user) {
    clearUser();
    return null;
  }

  const mapped = mapSupabaseUser(data.session.user);
  cacheUser(mapped);
  return mapped;
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return Boolean(user);
}

export function clearUser(): void {
  if (isBrowser) {
    localStorage.removeItem(USER_KEY);
  }
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
  clearUser();
  clearSession();
  if (isBrowser) {
    localStorage.removeItem(QUESTIONNAIRE_DRAFT_KEY);
  }
}

export function saveQuestionnaireDraft(data: any): void {
  if (isBrowser) {
    localStorage.setItem(QUESTIONNAIRE_DRAFT_KEY, JSON.stringify({
      ...data,
      lastSaved: new Date().toISOString(),
    }));
  }
}

export function getQuestionnaireDraft(): any | null {
  if (isBrowser) {
    const data = localStorage.getItem(QUESTIONNAIRE_DRAFT_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function clearQuestionnaireDraft(): void {
  if (isBrowser) {
    localStorage.removeItem(QUESTIONNAIRE_DRAFT_KEY);
  }
}
