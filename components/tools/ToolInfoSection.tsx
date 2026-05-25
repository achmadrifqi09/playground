import React from 'react';

interface Step {
  step: number;
  title: string;
  description: string;
}

interface Feature {
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ToolInfoSectionProps {
  introduction: string;
  steps: Step[];
  features: Feature[];
  faqs: FaqItem[];
}

export default function ToolInfoSection({
  introduction,
  steps,
  features,
  faqs,
}: ToolInfoSectionProps) {
  return (
    <section className="mt-16 space-y-12 border-t border-border pt-12">
      <div className="prose prose-invert max-w-none">
        <p className="text-muted-foreground leading-relaxed text-base">{introduction}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">How to Use</h2>
        <ol className="space-y-4">
          {steps.map((item) => (
            <li key={item.step} className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 text-primary text-sm font-bold flex items-center justify-center border border-primary/30">
                {item.step}
              </span>
              <div>
                <p className="font-semibold text-foreground text-sm">{item.title}</p>
                <p className="text-muted-foreground text-sm mt-0.5">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">Features</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="flex gap-3 p-4 rounded-xl border border-border bg-card/40"
            >
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-semibold text-foreground text-sm">{feature.title}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
        <dl className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-border pb-6 last:border-0 last:pb-0">
              <dt className="font-semibold text-foreground text-sm mb-2">{faq.question}</dt>
              <dd className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
