
import WhyCreatedPortal from './WhyCreatedPortal';
import MissionStatement from './MissionStatement';
import TeamOrNgoBehindIt from './TeamOrNgoBehindIt';

const AboutUsSection = () => {
  return (
    <section id = "about" className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-red-600 text-left mb-12">
          KNOW MORE ABOUT US
        </h2>

        <div className="space-y-16 lg:space-y-24"> 
          <WhyCreatedPortal />
          <MissionStatement />
          <TeamOrNgoBehindIt />
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;