import React, { useState, useRef } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is UniSpace?",
    answer:
      "UniSpace is a web-based platform that blends workspace booking with community engagement and gamification, designed for students, freelancers, and remote workers.",
  },
  {
    question: "How do I book a workspace?",
    answer:
      "Filter by location, type, or features, check real-time availability, select your date and time (min. 1 hour), and proceed with payment (₦300/hour).",
  },
  {
    question: "What are UniPoints and how do I earn them?",
    answer:
      "UniPoints are rewards you earn through bookings (+1 point for 3+ hrs), community participation (+0.0001 to +0.0005 points per action), referrals (+10 points), and streaks (5-8 points).",
  },
  {
    question: "Can I cancel a booking?",
    answer: "Yes, you can cancel up to 24 hours before for a full refund.",
  },
  {
    question: "How does the streak system work?",
    answer:
      "Earn a streak with daily login + booking. Miss a day? Redeem with 50 UniPoints within 24 hours to continue.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  return (
    <section id="faq" aria-label="Frequently Asked Questions" className="py-12 md:py-20">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-4 text-[2rem] leading-[1.3] text-[#1B04BE]">
            Frequently Asked Questions
          </h2>
          <p className="text-[#4B5563] text-lg max-w-2xl mx-auto font-[400] leading-[1.5]">
            Everything You Need to Know!
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">
          {/* FAQ Cards */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 gap-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#F9FAFB] rounded-lg p-4 shadow-sm border border-[#E5E7EB] transition-all duration-300"
              >
                <button
                  className="w-full flex justify-between items-center text-left focus:outline-none"
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                >
                  <span className="text-[#1B04BE] text-[1.25rem] font-[500] leading-[1.4]">
                    {faq.question}
                  </span>
                  {openIndex === idx ? (
                    <Minus
                      className="w-6 h-6 text-[#1B04BE]"
                      strokeWidth={2}
                      aria-label="Collapse answer"
                    />
                  ) : (
                    <Plus
                      className="w-6 h-6 text-[#1B04BE]"
                      strokeWidth={2}
                      aria-label="Expand answer"
                    />
                  )}
                </button>
                {openIndex === idx && (
                  <p
                    ref={el => { answerRefs.current[idx] = el; }}
                    id={`faq-answer-${idx}`}
                    className="mt-3 text-[#4B5563] text-[1rem] font-[400] leading-[1.5] transition-all duration-300"
                  >
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
          {/* Image Side */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <img
              src="/faq-image.png"
              alt="faq image"
              className="max-w-xs md:max-w-sm lg:max-w-md w-full h-auto object-contain animate-pulse"
              style={{ animationDuration: '10s' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;