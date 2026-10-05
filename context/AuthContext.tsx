"use client";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
export interface SessionUser { id: string; email: string; display_name: string; }
interface AuthValue { user: SessionUser | null; token: string | null; signIn: (token: string, user: SessionUser) => void; signOut: () => void; }
const AuthContext = createContext<AuthValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ token: string; user: SessionUser } | null>(null);
  const signIn = useCallback((token: string, user: SessionUser) => { setSession({ token, user }); }, []);
  const signOut = useCallback(() => setSession(null), []);
  const value = useMemo(() => ({ user: session?.user ?? null, token: session?.token ?? null, signIn, signOut }), [session, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthValue { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value; }
