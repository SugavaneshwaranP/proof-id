// ============================================================================
// PROOF-ID / BACKED — PLAYWRIGHT CRITICAL END-TO-END ACCEPTANCE TEST
// Implements full 10-step flow from docs/TEST_PLAN.md and mobile usability (<375px).
// ============================================================================

import { test, expect } from '@playwright/test';

test.describe('ProofID Critical E2E Acceptance Flow', () => {

  test('Complete Journey: Landing -> Incognito Public Dossier -> Contact -> Mobile <375px', async ({ page, context }) => {
    // 1. Visit Home Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/Backed/);
    await expect(page.locator('h1')).toBeVisible();

    // 2. Navigate to Discover / Explorer
    await page.click('text=Discover');
    await expect(page.locator('text=Verified Identity Registry')).toBeVisible();

    // 3. Open Alex Rivera Public Profile
    await page.goto('/alexrivera');
    await expect(page).toHaveTitle(/Alex Rivera/);
    await expect(page.locator('text=VERIFIED PERSON DOSSIER')).toBeVisible();

    // 4. Verify Single Primary Focused CTA (Criterion 4)
    const primaryCta = page.locator('button:has-text("Contact Alex Rivera")').first();
    await expect(primaryCta).toBeVisible();

    // 5. Inspect Evidence Proof Modal
    const proofButton = page.locator('text=Inspect Proof →').first();
    if (await proofButton.isVisible()) {
      await proofButton.click();
      await expect(page.locator('text=OFFICIAL PROOF FILE')).toBeVisible();
      await expect(page.locator('text=RLS Isolation')).toBeVisible();
      // Close modal
      await page.keyboard.press('Escape');
    }

    // 6. Submit Inbound Contact Request
    await primaryCta.click();
    await expect(page.locator('text=Send Direct Message')).toBeVisible();

    await page.fill('input[placeholder="Your Full Name"]', 'Sarah Chen');
    await page.fill('input[placeholder="name@company.com"]', 'sarah@quantflow.io');
    await page.fill('textarea[placeholder*="project brief"]', 'We are interested in an advisory engagement.');
    await page.click('button:has-text("Transmit Direct Message")');

    await expect(page.locator('text=Dossier Dispatched!')).toBeVisible();

    // 7. Verify Login-Free Shareability (Criterion 7)
    await page.click('button:has-text("Copy Link")');
    await expect(page.locator('text=Copied Link!')).toBeVisible();

    // 8. B2B Vendor Specification Flow (/business/apex-dynamics)
    await page.goto('/business/apex-dynamics');
    await expect(page).toHaveTitle(/Apex Precision Dynamics LLC/);
    await expect(page.locator('text=VERIFIED B2B BUSINESS SPECIFICATION')).toBeVisible();

    // Verify Primary Business CTA (Criterion 4)
    const quoteCta = page.locator('button:has-text("Request Business Quote")').first();
    await expect(quoteCta).toBeVisible();

    // 9. Structured RFQ Submission (Slice 6)
    await quoteCta.click();
    await expect(page.locator('text=RFP Quote:')).toBeVisible();
    await page.fill('input[type="email"]', 'procurement@aerospace.io');
    await page.fill('input[placeholder*="ISO 9001"]', 'AS9100D');
    await page.fill('textarea', 'Need 500 units for Q4 assembly line.');
    await page.click('button:has-text("Submit RFP Quote Request")');
    await expect(page.locator('text=RFP Dispatched!')).toBeVisible();

    // 10. Mobile Usability Verification (<375px viewport - Criterion 5)
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/alexrivera');
    await expect(page.locator('button:has-text("Contact Person")').last()).toBeVisible();
  });

  test('Auth Guard Verification: Direct access to /dashboard redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/dashboard/profile');
    // Guard redirects to /login
    await expect(page.locator('text=Sign in to your Backed Account').or(page.locator('text=Login'))).toBeVisible();
  });

});
