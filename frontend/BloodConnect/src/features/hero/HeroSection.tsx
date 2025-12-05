
 const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 overflow-hidden min-h-[700px] flex items-center justify-center relative">

      {/* Bg image*/}
      <img
        src="/Frame 1000004594.svg" 
        alt="home hero bg"
        className="absolute top-0 left-0 w-full h-full object-cover object-middle z-0" 
      />

      {/*Hero section font and sub text content*/}
      <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 md:mb-6 leading-tight drop-shadow-md">
            <span className="text-black">FIND </span>
            <span className="text-red-600">BLOOD DONOR</span>
          <br />
            <span className="text-black">NEAR YOU</span>
          </h1>

          <p className="text-2xl mb-8 md:mb-10 drop-shadow-sm" style={{ color: 'rgba(39, 39, 42, 0.8)' }}>
            Connecting Life Savers With Life Breakers.
          </p>


        {/* Buttons in hero section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto">
          {/* Search for donor Button */}
          <a href="/search" role="button" className="rounded-lg shadow-md inline-flex justify-center items-center transition-colors duration-300 whitespace-nowrap"
              style={{
                width: '200px',
                height: '56px',
                backgroundColor: '#E0DEDE',
                 borderRadius: '25px',
                color: 'rgba(23, 22, 22, 0.9)',
                boxShadow: '0 0 25px rgba(92, 90, 90, 0.8)',
                fontWeight: 600,
                paddingLeft: '0',
                paddingRight: '0',
              }}>
            Search for Donor
          </a>


          {/* Register Button */}
          <a href="/register" role="button" className="rounded-lg inline-flex justify-center items-center transition-colors duration-300 whitespace-nowrap"
              style={{
                width: '200px',
                height: '56px',
                backgroundColor: '#FF0000',        
                color: '#FFFFFF',  
                 borderRadius: '25px',                
                boxShadow: '0 0 25px rgba(255, 0, 0, 0.5)',  
                fontWeight: 600,
                paddingLeft: '0',
                paddingRight: '0',
              }}>
            Register
          </a>
        </div>
      </div>
    </section>

  );
};

export default HeroSection;