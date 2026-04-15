"use client";

import { useState } from "react";

interface FaqAccordionProps {
  questions: Array<{ question: string; answer: string }>;
  className?: string;
  defaultOpen?: number;
}

export default function FaqAccordion({
  questions,
  className = "",
  defaultOpen = 0,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`max-w-[800px] mx-auto ${className}`}>
      {questions.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`border rounded-lg mb-2 transition-colors ${
              isOpen ? "border-[#1B2A4A]" : "border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-6 text-left font-semibold text-gray-800 hover:text-[#1B2A4A] transition-colors"
            >
              <span>{item.question}</span>
              <span
                className={`text-xl leading-none ml-4 flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-45" : "rotate-0"
                }`}
              >
                +
              </span>
            </button>

            <div
              className="overflow-hidden transition-[max-height] duration-[400ms] ease-in-out"
              style={{ maxHeight: isOpen ? "500px" : "0px" }}
            >
              <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
