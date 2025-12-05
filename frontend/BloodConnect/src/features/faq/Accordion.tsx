import React, { useState } from 'react';

interface AccordionItemProps {
  question: string;
  answer: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ maxWidth: '1250px', width: '100%' }}>
      <button
        className={`flex justify-between items-center w-full py-2 text-lg md:text-xl font-medium text-left transition-colors duration-200 focus:outline-none 
        ${isOpen ? 'text-red-600' : 'text-black hover:text-red-600 focus:text-red-700'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question.replace(/\s+/g, '-')}`}
      >
        <span>{question}</span>
        <span>
          {/* Arrow icon with rotation */}
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Divider line only when open */}
      {isOpen && <div className="border-t border-gray-300 my-2"></div>}

      {/* Answer content */}
      {isOpen && (
        <div
          id={`faq-answer-${question.replace(/\s+/g, '-')}`}
          className="pb-4 pt-2 text-gray-600 text-base md:text-lg animate-fade-in"
        >
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
