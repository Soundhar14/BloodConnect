import AccordionItem from './Accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: "Do my data secured?",
      answer:
        "Yes, your data is secured with industry-standard encryption and privacy practices. We prioritize the protection of your personal information through robust security measures and strict data handling policies.",
    },
    {
      question: "How can I register as a blood donor?",
      answer:
        "You can register as a blood donor by clicking on the 'Register' button in the header or the hero section. Fill out the required information, and your profile will be created.",
    },
    {
      question: "What are the eligibility criteria for blood donation?",
      answer:
        "General criteria include being at least 18 years old, weighing over 50 kg, and being in good health. Specific criteria may vary, so please refer to local blood bank guidelines.",
    },
    {
      question: "How do I find a blood donor near me?",
      answer:
        "Use the search functionality on our homepage. You can search by location and blood group to find available donors in your vicinity. Contact details will be provided upon a successful match.",
    },
    {
      question: "Can I donate blood if I have a medical condition?",
      answer:
        "It depends on the specific condition. Certain medical conditions or medications may temporarily or permanently disqualify you from donating. Please consult with a healthcare professional or a blood bank representative.",
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-red-600">FAQ</span>
          <span className="text-black lowercase font-medium">s</span>
        </h2>
        <p className="text-center text-gray-600 mb-10 md:mb-12 text-lg md:text-xl">
          Find what you need to ask here.
        </p>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100 space-y-6">
  {faqs.map((faq, index) => (
    <div
      key={index}
      className="bg-white rounded-lg p-4"
      style={{
        boxShadow: '0px 0px 10px 0px rgba(92, 90, 90, 0.5)',
      }}
    >
      <AccordionItem
        question={faq.question}
        answer={faq.answer}
      />
    </div>
  ))}
</div>

      </div>
    </section>
  );
};

export default FAQSection;
