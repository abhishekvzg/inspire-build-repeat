import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LoanCalculator from "@/components/LoanCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <main className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <LoanCalculator />
      </main>
    </div>
  );
};

export default Index;
