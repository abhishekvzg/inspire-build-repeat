const HeroSection = () => {
  return (
    <section className="bg-gradient-pnb text-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="bg-pnb-red/90 rounded-3xl p-12 mb-8 shadow-2xl border-4 border-pnb-gold">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight border-4 border-pnb-gold rounded-2xl p-4">
            GAIN BIG WITH PNB HOME LOANS
          </h1>
          <p className="text-xl md:text-2xl opacity-95 font-medium">
            Switch to India's most trusted bank and save thousands every month
          </p>
        </div>
        
        <div className="bg-gradient-gold rounded-2xl p-8 border-2 border-pnb-gold">
          <h2 className="text-2xl md:text-3xl font-bold text-pnb-red mb-4">
            Know Your Gain Here
          </h2>
          <p className="text-lg text-pnb-red/80 font-medium">
            Enter your details below to calculate potential savings with PNB
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;