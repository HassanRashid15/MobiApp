import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useAccountStatus() {
  const { user, loading: authLoading } = useAuth();
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) {
        setIsActive(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("is_active")
        .eq("id", user.id)
        .single();
      setIsActive(data?.is_active ?? true);
      setLoading(false);
    };
    if (!authLoading) fetchStatus();
  }, [user, authLoading]);

  return { isActive, loading };
}
