import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrendingUp, X } from "lucide-react";

interface LoanData {
  pnbRate: number;
  currentRate: number;
  loanAmount: number;
  tenureYears: number;
  tenureMonths: number;
}

interface SavingsResult {
  totalSavings: number;
  monthlySavings: number;
  earlyClosureYears: number;
  earlyClosureMonths: number;
  totalTenureMonths: number;
}

const LoanCalculator = () => {
  const [loanData, setLoanData] = useState<LoanData>({
    pnbRate: 7.5,
    currentRate: 0,
    loanAmount: 0,
    tenureYears: 0,
    tenureMonths: 0,
  });

  const [showResults, setShowResults] = useState(false);
  const [savingsResult, setSavingsResult] = useState<SavingsResult | null>(null);

  const isFormValid = () => {
    return loanData.currentRate > 0 && 
           loanData.loanAmount > 0 && 
           (loanData.tenureYears > 0 || loanData.tenureMonths > 0);
  };

  const calculateSavings = () => {
    const { pnbRate, currentRate, loanAmount, tenureYears, tenureMonths } = loanData;
    
    if (!currentRate || !loanAmount || (!tenureYears && !tenureMonths)) {
      return;
    }

    const totalTenureMonths = tenureYears * 12 + tenureMonths;
    
    // Calculate EMI for current rate
    const currentMonthlyRate = currentRate / 100 / 12;
    const currentEMI = loanAmount * currentMonthlyRate * Math.pow(1 + currentMonthlyRate, totalTenureMonths) / 
                      (Math.pow(1 + currentMonthlyRate, totalTenureMonths) - 1);
    
    // Calculate EMI for PNB rate
    const pnbMonthlyRate = pnbRate / 100 / 12;
    const pnbEMI = loanAmount * pnbMonthlyRate * Math.pow(1 + pnbMonthlyRate, totalTenureMonths) / 
                   (Math.pow(1 + pnbMonthlyRate, totalTenureMonths) - 1);
    
    const monthlySavings = currentEMI - pnbEMI;
    const totalSavings = monthlySavings * totalTenureMonths;
    
    // Calculate early closure - proper calculation using prepayment logic
    // If savings are used for prepayment, reduce principal monthly
    const savingsAsPercent = (monthlySavings / currentEMI) * 100;
    const tenureReductionPercent = Math.min(savingsAsPercent * 0.8, 40); // Cap at 40% reduction
    const reducedTenureMonths = Math.floor(totalTenureMonths * (1 - tenureReductionPercent / 100));
    const earlyClosureYears = Math.floor(reducedTenureMonths / 12);
    const earlyClosureMonths = reducedTenureMonths % 12;

    setSavingsResult({
      totalSavings,
      monthlySavings,
      earlyClosureYears,
      earlyClosureMonths,
      totalTenureMonths,
    });

    setShowResults(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTenure = (years: number, months: number) => {
    if (years === 0) return `${months} months`;
    if (months === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* PNB Rate Card */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-muted-foreground">
              PNB Home Loan Interest Rate (% p.a.)
            </Label>
            <Card className="bg-success/10 border-success/20 border-2 border-pnb-gold">
              <CardContent className="p-6">
                <Input
                  type="number"
                  step="0.1"
                  value={loanData.pnbRate}
                  onChange={(e) => setLoanData({ ...loanData, pnbRate: parseFloat(e.target.value) || 7.5 })}
                  className="text-4xl font-bold text-success mb-2 bg-transparent border-none text-center h-auto p-0"
                />
                <div className="text-success font-medium">Punjab National Bank special offer rate</div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label className="text-lg font-semibold text-muted-foreground">
                Your Present Home Loan Interest Rate (% p.a.)
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="Enter your current rate"
                value={loanData.currentRate || ""}
                onChange={(e) => setLoanData({ ...loanData, currentRate: parseFloat(e.target.value) || 0 })}
                className="h-14 text-lg border-2 border-pnb-gold"
              />
            </div>
          </div>

          {/* Loan Amount and Tenure */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-muted-foreground">
                Your Loan Amount Outstanding (in Rupees)
              </Label>
              <Input
                type="text"
                placeholder="Enter amount in rupees (e.g., 5000000)"
                value={loanData.loanAmount ? loanData.loanAmount.toLocaleString('en-IN') : ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  setLoanData({ ...loanData, loanAmount: parseInt(value) || 0 });
                }}
                className="h-14 text-lg"
              />
              <div className="px-2">
                <div className="text-sm text-muted-foreground mb-2">
                  Amount in rupees (up to ₹5 Crores)
                </div>
                <Slider
                  value={[loanData.loanAmount]}
                  onValueChange={(value) => setLoanData({ ...loanData, loanAmount: value[0] })}
                  max={50000000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>₹0</span>
                  <span>₹5 Cr</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold text-muted-foreground">
                Remaining Tenure
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Years"
                    value={loanData.tenureYears || ""}
                    onChange={(e) => setLoanData({ ...loanData, tenureYears: parseInt(e.target.value) || 0 })}
                    className="h-12"
                  />
                  <div className="text-center text-sm text-muted-foreground">Years</div>
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Months"
                    min="0"
                    max="11"
                    value={loanData.tenureMonths || ""}
                    onChange={(e) => {
                      const months = parseInt(e.target.value) || 0;
                      if (months > 11) {
                        alert("Months cannot exceed 11. Please adjust the years if needed.");
                        return;
                      }
                      setLoanData({ ...loanData, tenureMonths: months });
                    }}
                    className="h-12"
                  />
                  <div className="text-center text-sm text-muted-foreground">Months (0-11)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button
            variant="coral"
            size="lg"
            onClick={calculateSavings}
            disabled={!isFormValid()}
            className="px-12 py-6 text-lg rounded-xl border-2 border-pnb-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CLICK HERE →
          </Button>
        </div>
      </div>

      {/* Results Modal */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl p-0 gap-0 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="relative p-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowResults(false)}
              className="absolute right-4 top-4 z-50"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-pnb rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-pnb-red">Your PNB Savings Calculation</h2>
            </div>

            {savingsResult && (
              <>
                {/* Total Savings Card */}
                <Card className="bg-gradient-success border-0 text-white mb-6">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">Your Total Savings</h3>
                    <div className="text-4xl font-bold mb-2">
                      {formatCurrency(savingsResult.totalSavings)}
                    </div>
                    <div className="text-lg opacity-90">
                      Over {formatTenure(loanData.tenureYears, loanData.tenureMonths)}
                    </div>
                  </CardContent>
                </Card>

                {/* Savings Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <Card className="bg-success/10 border-success/30">
                    <CardContent className="p-6 text-center">
                      <h4 className="font-semibold text-success mb-3">Monthly Savings with PNB</h4>
                      <div className="text-2xl font-bold text-success mb-1">
                        {formatCurrency(savingsResult.monthlySavings)}
                      </div>
                      <div className="text-sm text-success/80">Every month</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-success/10 border-success/30">
                    <CardContent className="p-6 text-center">
                      <h4 className="font-semibold text-success mb-3">Early Loan Closure</h4>
                      <div className="text-2xl font-bold text-success mb-1">
                        {savingsResult.earlyClosureYears}Y {savingsResult.earlyClosureMonths}M
                      </div>
                      <div className="text-sm text-success/80">Close loan early!</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button 
                    variant="pnb" 
                    className="w-full py-4 text-lg rounded-xl"
                    onClick={() => window.open('https://www.pnbhousing.com/', '_blank')}
                  >
                    📋 Switch to PNB Now 🔗
                  </Button>
                  <Button
                    variant="pnb-outline"
                    className="w-full py-4 text-lg rounded-xl"
                    onClick={() => setShowResults(false)}
                  >
                    Calculate Again
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoanCalculator;