// ============================================================================
// PROOF-ID / BACKED — ANALYTICS REPOSITORY (SUPABASE CANONICAL)
// Fulfills Slice 2 & Slice 3: Server-side aggregated daily analytics with RLS.
// ============================================================================

import { supabase } from "../supabaseClient";

export const analyticsRepository = {
  /**
   * Fetch aggregate analytics summary via Postgres RPC
   */
  async getSummary(profileId, days = 30) {
    if (!profileId) throw new Error("profileId is required");

    const { data, error } = await supabase.rpc("get_profile_analytics_summary", {
      p_profile_id: profileId,
      p_days: days,
    });

    if (error) {
      console.warn("[analyticsRepository] RPC error, calculating fallback:", error);
      // Fallback query directly against daily_analytics
      const { data: rows, error: rowErr } = await supabase
        .from("daily_analytics")
        .select("page_views, unique_visitors, messages_received, link_shares")
        .eq("profile_id", profileId);

      if (rowErr || !rows) {
        return { page_views: 0, unique_visitors: 0, messages_received: 0, link_shares: 0 };
      }

      return rows.reduce(
        (acc, r) => ({
          page_views: acc.page_views + (r.page_views || 0),
          unique_visitors: acc.unique_visitors + (r.unique_visitors || 0),
          messages_received: acc.messages_received + (r.messages_received || 0),
          link_shares: acc.link_shares + (r.link_shares || 0),
        }),
        { page_views: 0, unique_visitors: 0, messages_received: 0, link_shares: 0 }
      );
    }

    return data || { page_views: 0, unique_visitors: 0, messages_received: 0, link_shares: 0 };
  },

  /**
   * Fetch daily analytics timeline for chart rendering
   */
  async getTimeline(profileId, days = 14) {
    if (!profileId) throw new Error("profileId is required");

    const { data, error } = await supabase
      .from("daily_analytics")
      .select("log_date, page_views, unique_visitors, messages_received, link_shares")
      .eq("profile_id", profileId)
      .order("log_date", { ascending: true })
      .limit(days);

    if (error) {
      console.error("[analyticsRepository] Error fetching timeline:", error);
      return [];
    }

    return data || [];
  },

  /**
   * Increment page view on public profile visit
   */
  async trackView(profileId) {
    if (!profileId) return;
    try {
      const today = new Date().toISOString().split("T")[0];
      await supabase.rpc("increment_daily_page_view", {
        p_profile_id: profileId,
        p_date: today,
      });
    } catch {
      // Non-blocking telemetry
    }
  },
};
