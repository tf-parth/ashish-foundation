import type { Metadata } from "next";
import {
  FileText,
  Download,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { TRANSPARENCY_DOCS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Transparency",
  description:
    "Ashish Foundation is committed to transparency and accountability. Access our reports, certificates and official documents.",
};

export default function TransparencyPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-green blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-saffron blur-3xl" />
        </div>
        <div className="container-narrow mx-auto px-4 md:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-saffron border border-saffron/30 rounded-full bg-saffron/10 mb-6">
            Accountability
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Transparency
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            We believe in complete transparency and accountability to our donors,
            volunteers and communities.
          </p>
        </div>
      </section>

      {/* Trust Statement */}
      <section className="section-padding bg-cream">
        <div className="container-narrow mx-auto">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-green/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green" />
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-forest mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Our Commitment to Trust
              </h2>
              <p className="text-base text-charcoal-light leading-relaxed">
                Ashish Foundation is committed to maintaining the highest
                standards of transparency. We make our organizational documents,
                reports and records available to demonstrate our accountability
                to everyone who supports our mission.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="section-padding bg-offwhite">
        <div className="container-narrow mx-auto">
          <SectionHeading
            title="Reports & Documents"
            subtitle="Access our official documents and reports."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRANSPARENCY_DOCS.map((doc, i) => (
              <ScrollReveal key={doc.title} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-6 border border-forest/5 hover:border-green/20 transition-all duration-500 hover:shadow-lg h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-forest/5 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-forest" />
                    </div>
                    {doc.available ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green/10 text-green text-xs font-medium rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-saffron/10 text-saffron text-xs font-medium rounded-full">
                        <Clock className="w-3 h-3" />
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-lg font-semibold text-forest mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {doc.title}
                  </h3>
                  <p className="text-sm text-charcoal-light leading-relaxed flex-1 mb-4">
                    {doc.description}
                  </p>

                  {doc.available ? (
                    <button className="inline-flex items-center gap-2 text-sm font-medium text-green hover:text-forest transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm text-charcoal-light/50">
                      <AlertCircle className="w-4 h-4" />
                      Will be uploaded soon
                    </span>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.5}>
            <div className="mt-12 bg-cream rounded-2xl p-6 md:p-8 text-center border border-forest/5">
              <p className="text-sm text-charcoal-light leading-relaxed">
                <strong className="text-forest">Note:</strong> Documents and
                reports will be uploaded as they become available. For any
                specific information requests, please{" "}
                <a href="/contact" className="text-green hover:text-forest underline">
                  contact us
                </a>
                .
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
