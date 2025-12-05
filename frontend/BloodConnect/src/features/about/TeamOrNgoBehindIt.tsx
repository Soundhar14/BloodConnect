const TeamOrNgoBehindIt = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-6 md:p-8 rounded-lg">
      <div className="md:w-1/2 flex justify-center items-center">
        <img
          src="/assets/team_graphic.png" 
          alt="Team or NGO"
          className="w-full max-w-sm md:max-w-md h-auto object-contain rounded-lg shadow-md"
        />
      </div>


      <div className="md:w-1/2 text-center md:text-left">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Team or NGO behind it
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Our team comprises healthcare professionals, tech enthusiasts, and social workers committed to saving lives.
          We collaborate with hospitals, blood banks, and local communities to ensure smooth operations and wide outreach.
          Our core values are compassion, responsibility, and service to humanity
        </p>
      </div>
    </div>
  );
};

export default TeamOrNgoBehindIt;