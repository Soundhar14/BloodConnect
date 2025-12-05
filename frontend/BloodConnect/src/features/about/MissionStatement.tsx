

const MissionStatement = () => {
  return (
    <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 p-6 md:p-8 rounded-lg">
      <div className="md:w-1/2 flex justify-center items-center">
        <img
          src="/assets/mission_graphic.png"
          alt="Mission Statement"
          className="w-full max-w-sm md:max-w-md h-auto object-contain rounded-lg shadow-md"
        />
      </div>

      
      <div className="md:w-1/2 text-center md:text-left">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Mission Statement
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Our mission is to bridge the gap between blood donors and recipients through a reliable, efficient, and 
          accessible platform.We strive to save lives by enabling quick, transparent, and secure blood donations.
          Our goal is to build a compassionate community committed to timely and life-saving support
        </p>
      </div>
    </div>
  );
};

export default MissionStatement;