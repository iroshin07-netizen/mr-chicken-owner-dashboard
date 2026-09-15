import { createContext, useContext, useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) { setLoading(false); return; }
    supabase.auth.getSession().then(({data}) => { setSession(data.session); setLoading(false); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email,password) => supabase.auth.signInWithPassword({email,password});
  const signOut = () => supabase.auth.signOut();

  return <AuthContext.Provider value={{session,loading,signIn,signOut,supabaseConfigured}}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);