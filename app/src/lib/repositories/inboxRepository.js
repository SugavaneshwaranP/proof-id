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

  /**
   * Submit formal B2B quote response for an inquiry/RFQ
   */
  async createQuoteResponse({
    contactRequestId,
    supplierProfileId,
    unitPrice,
    currency = "USD",
    moq = 1,
    leadTimeDays = 7,
    paymentTerms = "Net 30",
    validUntil = null,
    quoteNotes = "",
  }) {
    if (!contactRequestId || !supplierProfileId || !unitPrice) {
      throw new Error("contactRequestId, supplierProfileId, and unitPrice are required");
    }

    const payload = {
      contact_request_id: contactRequestId,
      supplier_profile_id: supplierProfileId,
      unit_price: Number(unitPrice),
      currency,
      moq: Number(moq) || 1,
      lead_time_days: Number(leadTimeDays) || 7,
      payment_terms: paymentTerms,
      valid_until: validUntil || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      quote_notes: quoteNotes,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("quote_responses")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("[inboxRepository] Create quote response error:", error);
      throw error;
    }

    return data;
  },

  /**
   * Fetch quote responses for a contact request
   */
  async getQuoteResponses(contactRequestId) {
    if (!contactRequestId) return [];

    const { data, error } = await supabase
      .from("quote_responses")
      .select("*")
      .eq("contact_request_id", contactRequestId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[inboxRepository] getQuoteResponses error:", error);
      return [];
    }

    return data || [];
  },
};
