import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";

export function useRealtimeTable(table, initialData = [], orderColumn = "created_at") {
  const [rows, setRows] = useState(initialData);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    let active = true;
    if (!supabaseConfigured) { setRows(initialData); setLoading(false); return; }

    supabase.from(table).select("*").order(orderColumn, {ascending:false}).then(({data,error}) => {
      if (active && !error) setRows(data || []);
      if (active) setLoading(false);
    });

    const channel = supabase.channel(`${table}-live`)
      .on("postgres_changes", {event:"*", schema:"public", table}, payload => {
        setRows(current => {
          if (payload.eventType === "INSERT") return [payload.new, ...current];
          if (payload.eventType === "UPDATE") return current.map(r => r.id === payload.new.id ? payload.new : r);
          if (payload.eventType === "DELETE") return current.filter(r => r.id !== payload.old.id);
          return current;
        });
      }).subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, [table]);

  return {rows, loading};
}