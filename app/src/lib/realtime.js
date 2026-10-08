// ============================================================================
// REAL-TIME ARCHITECTURE MODULE
// Wiring strictly the FOUR SCOPED CHANNELS that earned their place:
// 1. profile:{id}:activity — Live activity feed on Dashboard Home
// 2. evidence:{profile_id} — Live status update for "Confirmed" proof badges
// 3. inbox:{profile_id} — Instant inbox update on quote request arrival
// 4. admin:reports — Real-time moderation ticket queue for admins
// ============================================================================

import { supabase } from "./supabaseClient";

/**
 * Custom Event Dispatcher for Local Realtime Synchrony
 */
function dispatchLocalRealtimeEvent(channelName, payload) {
  const event = new CustomEvent("backed-realtime-event", {
    detail: { channel: channelName, payload, timestamp: new Date().toISOString() },
  });
  window.dispatchEvent(event);
}

/**
 * 1. Subscribe to Dashboard Home Live Activity Channel
 */
export function subscribeToActivityChannel(profileId, onNewActivity) {
  if (!profileId) return () => {};

  const channel = supabase
    .channel(`profile:${profileId}:activity`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "contact_requests",
        filter: `profile_id=eq.${profileId}`,
      },
      (payload) => {
        onNewActivity({ type: "message", data: payload.new });
      }
    )
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "verification_events",
        filter: `profile_id=eq.${profileId}`,
      },
      (payload) => {
        onNewActivity({ type: "verification", data: payload.new });
      }
    )
    .subscribe((status) => {
      console.log(`[Realtime Activity Channel] Status for ${profileId}:`, status);
    });

  const localHandler = (e) => {
    if (e.detail?.channel === `profile:${profileId}:activity`) {
      onNewActivity(e.detail.payload);
    }
  };
  window.addEventListener("backed-realtime-event", localHandler);

  return () => {
    supabase.removeChannel(channel);
    window.removeEventListener("backed-realtime-event", localHandler);
  };
}

/**
 * 2. Subscribe to Proof Badge Status Updates Channel
 */
export function subscribeToEvidenceChannel(profileId, onEvidenceStatusChange) {
  if (!profileId) return () => {};

  const channel = supabase
    .channel(`evidence:${profileId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "evidence_items",
        filter: `profile_id=eq.${profileId}`,
      },
      (payload) => {
        onEvidenceStatusChange(payload.new);
      }
    )
    .subscribe((status) => {
      console.log(`[Realtime Evidence Channel] Status for ${profileId}:`, status);
    });

  const localHandler = (e) => {
    if (e.detail?.channel === `evidence:${profileId}`) {
      onEvidenceStatusChange(e.detail.payload);
    }
  };
  window.addEventListener("backed-realtime-event", localHandler);

  return () => {
    supabase.removeChannel(channel);
    window.removeEventListener("backed-realtime-event", localHandler);
  };
}

/**
 * 3. Subscribe to Inbox New Messages Channel
 */
export function subscribeToInboxChannel(profileId, onNewMessage) {
  if (!profileId) return () => {};

  const channel = supabase
    .channel(`inbox:${profileId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "contact_requests",
        filter: `profile_id=eq.${profileId}`,
      },
      (payload) => {
        onNewMessage(payload.new);
      }
    )
    .subscribe((status) => {
      console.log(`[Realtime Inbox Channel] Status for ${profileId}:`, status);
    });

  const localHandler = (e) => {
    if (e.detail?.channel === `inbox:${profileId}`) {
      onNewMessage(e.detail.payload);
    }
  };
  window.addEventListener("backed-realtime-event", localHandler);

  return () => {
    supabase.removeChannel(channel);
    window.removeEventListener("backed-realtime-event", localHandler);
  };
}

/**
 * 4. Subscribe to Admin Moderation Reports Queue Channel
 */
export function subscribeToAdminReportsChannel(onNewReport) {
  const channel = supabase
    .channel("admin:reports")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "reports",
      },
      (payload) => {
        onNewReport(payload.new);
      }
    )
    .subscribe((status) => {
      console.log("[Realtime Admin Reports Channel] Status:", status);
    });

  const localHandler = (e) => {
    if (e.detail?.channel === "admin:reports") {
      onNewReport(e.detail.payload);
    }
  };
  window.addEventListener("backed-realtime-event", localHandler);

  return () => {
    supabase.removeChannel(channel);
    window.removeEventListener("backed-realtime-event", localHandler);
  };
}

/**
 * Real-time Event Broadcasters (Client-Initiated & Triggered)
 */
export function broadcastActivityEvent(profileId, activityData) {
  dispatchLocalRealtimeEvent(`profile:${profileId}:activity`, activityData);
}

export function broadcastEvidenceStatusUpdate(profileId, evidenceData) {
  dispatchLocalRealtimeEvent(`evidence:${profileId}`, evidenceData);
}

export function broadcastInboxMessage(profileId, messageData) {
  dispatchLocalRealtimeEvent(`inbox:${profileId}`, messageData);
  dispatchLocalRealtimeEvent(`profile:${profileId}:activity`, {
    type: "message",
    data: messageData,
  });
}

export function broadcastAdminReport(reportData) {
  dispatchLocalRealtimeEvent("admin:reports", reportData);
}
