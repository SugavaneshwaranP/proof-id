// ============================================================================
// PROOF-ID / BACKED — INBOX & RFQ REPOSITORY (SUPABASE CANONICAL)
// Fulfills Slice 2 & Slice 6: Supplier inbox, structured RFQ / contact requests.
// ============================================================================

import { supabase } from "../supabaseClient";
import { enqueueOfflineMutation } from "../offlineQueue";

export const inboxRepository = {
  /**
   * Fetch inbox contact requests for a given profile ID (Owner only via RLS)
   */
  async getInboxMessages(profileId) {
    if (!profileId) throw new Error("Profile ID is required");

    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[inboxRepository] Error fetching messages:", error);
      throw error;
    }

    return data || [];
  },

  /**
   * Send a contact request / RFQ to a profile
   */
  async sendContactRequest({ profileId, senderName, senderEmail, subject = "New Inquiry", messageBody, rfqData = null }) {
    if (!profileId || !senderName || !senderEmail || !messageBody) {
      throw new Error("profileId, senderName, senderEmail, and messageBody are required");
    }

    // If RFQ data is provided, append structured metadata to message body
    let finalBody = messageBody;
    if (rfqData) {
      const rfqText = `\n\n--- Structured RFQ Specs ---\n` +
        (rfqData.quantity ? `Quantity: ${rfqData.quantity} ${rfqData.unit || "units"}\n` : "") +
        (rfqData.targetDate ? `Target Date: ${rfqData.targetDate}\n` : "") +
        (rfqData.deliveryRegion ? `Delivery Region: ${rfqData.deliveryRegion}\n` : "") +
        (rfqData.certifications ? `Required Certs: ${rfqData.certifications}\n` : "");
      finalBody += rfqText;
    }

    const payload = {
      profile_id: profileId,
      sender_name: senderName,
      sender_email: senderEmail,
      subject,
      message_body: finalBody,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("contact_requests")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn("[inboxRepository] Insert failed, queuing offline mutation:", error);
      await enqueueOfflineMutation({
        type: "SEND_CONTACT_REQUEST",
        payload,
      });
      throw error;
    }

    return data;
  },

  /**
   * Mark message as read
   */
  async markAsRead(messageId) {
    if (!messageId) throw new Error("messageId is required");

    const { data, error } = await supabase
      .from("contact_requests")
      .update({ is_read: true })
      .eq("id", messageId)
      .select()
      .single();

    if (error) {
      console.error("[inboxRepository] Mark as read failed:", error);
      throw error;
    }

    return data;
  },
};
