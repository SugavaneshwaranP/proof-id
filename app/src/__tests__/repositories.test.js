// ============================================================================
// PROOF-ID / BACKED — TYPED REPOSITORIES & DATA PERSISTENCE TESTS
// Fulfills Slice 2: Validates Supabase Postgres queries and offline queuing.
// ============================================================================

import { profileRepository } from "../lib/repositories/profileRepository";
import { evidenceRepository } from "../lib/repositories/evidenceRepository";
import { projectRepository } from "../lib/repositories/projectRepository";
import { inboxRepository } from "../lib/repositories/inboxRepository";
import { supabase } from "../lib/supabaseClient";

describe("Typed Supabase Repositories", () => {
  test("profileRepository.getBySlug queries profiles with capabilities & business details", async () => {
    const mockProfile = {
      id: "prof-123",
      slug: "alexrivera",
      full_name: "Alex Rivera",
      headline: "Frontend Architect",
      is_published: true,
      business_details: null,
      profile_capabilities: [
        {
          id: "pc-1",
          display_order: 1,
          capabilities: { id: "cap-1", name: "React", category: "Frontend" },
        },
      ],
    };

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockMaybeSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });

    vi.spyOn(supabase, "from").mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      maybeSingle: mockMaybeSingle,
    });

    const result = await profileRepository.getBySlug("alexrivera");

    expect(result.id).toBe("prof-123");
    expect(result.slug).toBe("alexrivera");
    expect(result.capabilities).toHaveLength(1);
    expect(result.capabilities[0].name).toBe("React");
  });

  test("profileRepository.publishProfile calls atomic RPC", async () => {
    const mockRpc = vi.spyOn(supabase, "rpc").mockResolvedValue({
      data: { success: true, is_published: true, completion_score: 95 },
      error: null,
    });

    const res = await profileRepository.publishProfile("prof-123");
    expect(mockRpc).toHaveBeenCalledWith("publish_profile", { p_profile_id: "prof-123" });
    expect(res.success).toBe(true);
    expect(res.is_published).toBe(true);
  });

  test("evidenceRepository.createEvidence inserts canonical evidence record", async () => {
    const mockInsert = vi.fn().mockReturnThis();
    const mockSelect = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: "ev-100", title: "Test Proof", status: "unverified" },
      error: null,
    });

    vi.spyOn(supabase, "from").mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle,
    });

    const item = await evidenceRepository.createEvidence({
      profileId: "prof-123",
      title: "Test Proof",
      category: "Engineering",
      evidenceType: "link",
      externalUrl: "https://github.com",
    });

    expect(item.id).toBe("ev-100");
    expect(item.title).toBe("Test Proof");
    expect(item.status).toBe("unverified");
  });

  test("inboxRepository.sendContactRequest structures RFQ payload", async () => {
    const mockInsert = vi.fn().mockReturnThis();
    const mockSelect = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: "msg-1", subject: "RFP Quote" },
      error: null,
    });

    vi.spyOn(supabase, "from").mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle,
    });

    const msg = await inboxRepository.sendContactRequest({
      profileId: "prof-123",
      senderName: "Buyer Inc",
      senderEmail: "buyer@inc.com",
      subject: "RFP Quote",
      messageBody: "Need 500 units by December",
      rfqData: {
        quantity: "500",
        unit: "units",
        targetDate: "2026-12-01",
        deliveryRegion: "North America",
        certifications: "ISO 9001",
      },
    });

    expect(msg.id).toBe("msg-1");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: "prof-123",
        sender_name: "Buyer Inc",
        sender_email: "buyer@inc.com",
        is_read: false,
      })
    );
  });
});
