const WhyCreatedPortal = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-6 md:p-8 rounded-lg">
      <div className="md:w-1/2 flex justify-center items-center">
        <img
          src="/assets/why_portal_graphic.png" 
          alt="Why Portal Created"
          className="w-full max-w-sm md:max-w-md h-auto object-contain rounded-lg shadow-md"
        />
      </div>
      <div className="md:w-1/2 text-center md:text-left">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Why we created this Portal!
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We created the BloodConnect Portal to connect blood donors with recipients quickly and efficiently during 
          times of need.It ensures timely access to lifesaving blood and reduces delays caused by manual coordination.
          The portal fosters a supportive community and promotes regular blood donation.By digitizing the process, 
          we enhance transparency, tracking, and communication.
        </p>
      </div>
    </div>
  );
};

export default WhyCreatedPortal;