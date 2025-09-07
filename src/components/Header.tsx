const Header = () => {
  return (
    <header className="bg-gradient-pnb text-white py-4 px-4">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <div className="bg-pnb-gold text-pnb-red px-4 py-2 rounded-lg font-bold text-xl border-2 border-pnb-gold">
          PNB
        </div>
        <div>
          <h1 className="text-xl font-semibold">Punjab National Bank</h1>
          <p className="text-sm opacity-90">Home Loan Calculator - India's Trusted Bank Since 1894</p>
        </div>
      </div>
    </header>
  );
};

export default Header;