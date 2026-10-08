import React from 'react';
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="space-y-12 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans">
      
      {/* Header */}
      <div className="space-y-4 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-blue-400 text-xs font-mono">
          <FileText className="w-3.5 h-3.5" />
          <span>Effective Date: October 8, 2026 • Platform Terms of Service</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white">Terms and Conditions</h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          These Terms & Conditions govern your access to and use of the PROOF::ID Network web application and verification services.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-sans">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-500">1.</span> Evidence Authenticity Mandate
          </h2>
          <p>
            Users creating Person or Business profiles agree to attach only genuine, truthful, and authorized evidence. Uploading fraudulent certificates, forged credentials, or misleading B2B capacity specifications is strictly prohibited and results in immediate account suspension.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-500">2.</span> Deterministic Engine & Verification Disclaimers
          </h2>
          <p>
            The profile completion indicator and deterministic matching scores are mathematical indicators of profile completeness and structured data overlap. They do **not** represent a guarantee of hireability, financial solvency, or business performance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-500">3.</span> Intellectual Property & Public License
          </h2>
          <p>
            You retain all ownership rights to your uploaded media and documentation. By setting profile elements to "Public", you grant PROOF::ID a limited license to display and render allow-listed fields for public viewers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-500">4.</span> Limitation of Liability
          </h2>
          <p>
            PROOF::ID Network is provided on an "AS IS" and "AS AVAILABLE" basis. To the maximum extent permitted by law, PROOF::ID shall not be liable for direct or indirect damages resulting from third-party verifier responses or business disputes between buyers and suppliers.
          </p>
        </section>

      </div>

    </div>
  );
}
