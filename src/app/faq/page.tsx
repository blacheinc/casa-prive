// src/app/faq/page.tsx - Casa Privé x Alora Beach Resort
'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Tickets & Reservations',
      questions: [
        {
          q: 'How do I get tickets for Casa Privé at Alora Beach Resort?',
          a: 'You can purchase tickets through our online booking system on the website. Select your preferred event date, choose a ticket package, and complete the payment process. You\'ll receive a confirmation email with your ticket details.',
        },
        {
          q: 'How far in advance can I purchase tickets?',
          a: 'Tickets are released up to 30 days before each monthly event. We recommend purchasing early as tickets sell out quickly.',
        },
        {
          q: 'What if tickets are sold out?',
          a: 'If tickets are sold out, you can join our waitlist. We\'ll notify you via email and phone if tickets become available. Waitlist positions are filled on a first-come, first-served basis.',
        },
        {
          q: 'Can I modify my ticket after purchase?',
          a: 'Yes, you can modify your ticket up to 48 hours before the event. Contact us via email at info@casaprivé.com or call +233 24 496 3777 to make changes.',
        },
      ],
    },
    {
      category: 'Ticket Packages',
      questions: [
        {
          q: 'What\'s included in the ticket packages?',
          a: 'Our packages include premium bottle service and mixers. The Indoor Table Package (₵20,000) includes 2 Moet Nectar Rose, 1 Hennessy XO, 1 Don Julio 1942, 8 mixers, and 10 bottles of water. The Balcony Table Package (₵10,000) includes 2 Moet Nectar Rose, 1 Hennessy VSOP, 5 mixers, and 5 bottles of water.',
        },
        {
          q: 'How many guests can be included per ticket package?',
          a: 'Each table ticket accommodates a maximum of 6 guests. This limit is strictly enforced to ensure comfort and maintain our intimate atmosphere.',
        },
        {
          q: 'Can I order additional drinks beyond the package?',
          a: 'Yes, you can order additional drinks from our premium menu at the event. All items are available for purchase at their listed prices.',
        },
      ],
    },
    {
      category: 'Dress Code & Entry',
      questions: [
        {
          q: 'What is the dress code?',
          a: 'Elegant attire is required. We expect business formal, cocktail attire, or evening wear. Casual wear, sportswear, and sneakers are not permitted.',
        },
        {
          q: 'What time should I arrive?',
          a: 'Please arrive 15 minutes before the event starts at Alora Beach Resort. Late arrivals may not be accommodated depending on the event type.',
        },
        {
          q: 'Is there an age restriction?',
          a: 'Yes, Casa Privé events at Alora Beach Resort are exclusively for adults. All guests must be 21 years or older with valid identification.',
        },
      ],
    },
    {
      category: 'Cancellations & Refunds',
      questions: [
        {
          q: 'What is your cancellation policy?',
          a: 'Cancellations made 48+ hours before the event receive a full refund minus 10% processing fee. Cancellations 24-48 hours before receive a 50% refund. Cancellations less than 24 hours before or no-shows receive no refund.',
        },
        {
          q: 'How long does it take to receive a refund?',
          a: 'Approved refunds are processed within 5-7 business days and will appear in your original payment method.',
        },
      ],
    },
    {
      category: 'Payment & Pricing',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, and mobile money payments through our secure payment gateway.',
        },
        {
          q: 'Are prices inclusive of taxes?',
          a: 'Yes, all prices displayed include applicable taxes. There are no hidden fees.',
        },
      ],
    },
    {
      category: 'Events & Venue',
      questions: [
        {
          q: 'When and where are events held?',
          a: 'Casa Privé hosts exclusive monthly events at Alora Beach Resort in Accra, Ghana. Check our tickets page for upcoming dates.',
        },
        {
          q: 'Can I take photos during the event?',
          a: 'Photography is permitted for personal use only. However, please respect other guests\' privacy. Commercial photography or videography requires prior authorization.',
        },
        {
          q: 'Is there parking at Alora Beach Resort?',
          a: 'Yes, Alora Beach Resort provides parking for event guests. We recommend arriving early to secure a spot.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 py-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <HelpCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 font-light text-sm">
            Everything you need to know about Casa Privé × Alora Beach Resort events
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-6" />
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-slate-800/50 border border-emerald-700/30 p-6 rounded">
              <h2 className="text-xl font-light text-emerald-400 mb-4">{section.category}</h2>
              <div className="space-y-3">
                {section.questions.map((faq, faqIndex) => {
                  const globalIndex = sectionIndex * 100 + faqIndex;
                  return (
                    <FAQItem
                      key={globalIndex}
                      question={faq.q}
                      answer={faq.a}
                      isOpen={openIndex === globalIndex}
                      onToggle={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-slate-800/50 border border-yellow-700/30 p-8 rounded text-center">
          <h3 className="text-xl font-light text-white mb-4">Still Have Questions?</h3>
          <p className="text-gray-300 mb-6 text-sm font-light">
            Our team is here to help you with any inquiries about Casa Privé × Alora Beach Resort events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/feedback"
              className="px-6 py-3 bg-emerald-600 text-white text-sm font-light tracking-wider rounded hover:bg-emerald-500 transition"
            >
              CONTACT US
            </a>
            <a
              href="mailto:info@casaprivé.com"
              className="px-6 py-3 border-2 border-emerald-600 text-emerald-400 text-sm font-light tracking-wider rounded hover:bg-emerald-600 hover:text-white transition"
            >
              EMAIL SUPPORT
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-slate-700 rounded overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition"
      >
        <span className="text-white font-light text-sm pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-yellow-500 flex-shrink-0" size={20} />
        ) : (
          <ChevronDown className="text-emerald-500 flex-shrink-0" size={20} />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-300 text-sm font-light leading-relaxed border-t border-slate-700 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}
