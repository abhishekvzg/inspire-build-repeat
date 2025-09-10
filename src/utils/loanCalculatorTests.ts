// Test cases for loan calculator early closure calculation

interface TestCase {
  name: string;
  loanAmount: number;
  currentRate: number;
  pnbRate: number;
  tenureMonths: number;
  expectedMonthlySavings: number;
  expectedEarlyClosureMonths: number;
}

export const loanCalculatorTestCases: TestCase[] = [
  {
    name: "Test Case 1: High savings scenario",
    loanAmount: 5000000, // 50 lakhs
    currentRate: 12.0,
    pnbRate: 7.5,
    tenureMonths: 240, // 20 years
    expectedMonthlySavings: 20000, // Approximate
    expectedEarlyClosureMonths: 180, // Approximate 15 years
  },
  {
    name: "Test Case 2: Moderate savings scenario",
    loanAmount: 3000000, // 30 lakhs
    currentRate: 9.5,
    pnbRate: 7.5,
    tenureMonths: 180, // 15 years
    expectedMonthlySavings: 6000, // Approximate
    expectedEarlyClosureMonths: 150, // Approximate 12.5 years
  },
  {
    name: "Test Case 3: Low savings scenario",
    loanAmount: 2000000, // 20 lakhs
    currentRate: 8.5,
    pnbRate: 7.5,
    tenureMonths: 120, // 10 years
    expectedMonthlySavings: 2000, // Approximate
    expectedEarlyClosureMonths: 110, // Approximate 9 years
  },
  {
    name: "Test Case 4: Minimal savings scenario",
    loanAmount: 1000000, // 10 lakhs
    currentRate: 8.0,
    pnbRate: 7.5,
    tenureMonths: 60, // 5 years
    expectedMonthlySavings: 500, // Approximate
    expectedEarlyClosureMonths: 55, // Approximate 4.5 years
  },
  {
    name: "Test Case 5: Large loan amount",
    loanAmount: 10000000, // 1 crore
    currentRate: 11.0,
    pnbRate: 7.5,
    tenureMonths: 300, // 25 years
    expectedMonthlySavings: 35000, // Approximate
    expectedEarlyClosureMonths: 220, // Approximate 18 years
  },
];

// Function to calculate EMI
export const calculateEMI = (principal: number, rate: number, tenure: number): number => {
  const monthlyRate = rate / 100 / 12;
  return principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
         (Math.pow(1 + monthlyRate, tenure) - 1);
};

// Function to calculate early closure with prepayment
export const calculateEarlyClosureMonths = (
  loanAmount: number,
  pnbRate: number,
  monthlySavings: number,
  totalTenureMonths: number
): number => {
  const pnbMonthlyRate = pnbRate / 100 / 12;
  const pnbEMI = calculateEMI(loanAmount, pnbRate, totalTenureMonths);
  
  let remainingPrincipal = loanAmount;
  let monthsPassed = 0;
  
  // Simulate loan with prepayment using savings
  while (remainingPrincipal > 0 && monthsPassed < totalTenureMonths) {
    const interestPayment = remainingPrincipal * pnbMonthlyRate;
    const principalPayment = pnbEMI - interestPayment;
    const prepayment = Math.max(0, monthlySavings); // Use savings as prepayment
    
    remainingPrincipal -= (principalPayment + prepayment);
    monthsPassed++;
    
    if (remainingPrincipal <= 0) break;
  }
  
  return monthsPassed;
};

// Function to run all test cases
export const runLoanCalculatorTests = (): void => {
  console.log("Running Loan Calculator Test Cases:");
  console.log("===================================");
  
  loanCalculatorTestCases.forEach((testCase, index) => {
    const currentEMI = calculateEMI(testCase.loanAmount, testCase.currentRate, testCase.tenureMonths);
    const pnbEMI = calculateEMI(testCase.loanAmount, testCase.pnbRate, testCase.tenureMonths);
    const actualMonthlySavings = currentEMI - pnbEMI;
    const actualEarlyClosureMonths = calculateEarlyClosureMonths(
      testCase.loanAmount,
      testCase.pnbRate,
      actualMonthlySavings,
      testCase.tenureMonths
    );
    
    console.log(`\n${testCase.name}:`);
    console.log(`Loan Amount: ₹${testCase.loanAmount.toLocaleString()}`);
    console.log(`Current Rate: ${testCase.currentRate}% | PNB Rate: ${testCase.pnbRate}%`);
    console.log(`Tenure: ${testCase.tenureMonths} months`);
    console.log(`Current EMI: ₹${Math.round(currentEMI).toLocaleString()}`);
    console.log(`PNB EMI: ₹${Math.round(pnbEMI).toLocaleString()}`);
    console.log(`Monthly Savings: ₹${Math.round(actualMonthlySavings).toLocaleString()}`);
    console.log(`Early Closure: ${actualEarlyClosureMonths} months (${Math.floor(actualEarlyClosureMonths/12)}Y ${actualEarlyClosureMonths%12}M)`);
    console.log(`Total Savings: ₹${Math.round(actualMonthlySavings * testCase.tenureMonths).toLocaleString()}`);
  });
  
  console.log("\n===================================");
  console.log("All test cases completed successfully!");
};