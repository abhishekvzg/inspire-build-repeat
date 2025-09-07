// Test cases for loan calculator validation

export interface TestCase {
  name: string;
  input: {
    pnbRate: number;
    currentRate: number;
    loanAmount: number;
    tenureYears: number;
    tenureMonths: number;
  };
  expectedOutput: {
    monthlySavings: number; // Approximate
    totalSavings: number; // Approximate
    earlyClosureYears: number;
    earlyClosureMonths: number;
  };
}

export const testCases: TestCase[] = [
  {
    name: "Test Case 1: High rate difference, large loan",
    input: {
      pnbRate: 7.5,
      currentRate: 12.0,
      loanAmount: 5000000,
      tenureYears: 15,
      tenureMonths: 0,
    },
    expectedOutput: {
      monthlySavings: 20000, // Approximate
      totalSavings: 3600000, // Approximate
      earlyClosureYears: 9,
      earlyClosureMonths: 0,
    },
  },
  {
    name: "Test Case 2: Small rate difference, medium loan",
    input: {
      pnbRate: 7.5,
      currentRate: 8.5,
      loanAmount: 2000000,
      tenureYears: 10,
      tenureMonths: 6,
    },
    expectedOutput: {
      monthlySavings: 2000, // Approximate
      totalSavings: 252000, // Approximate
      earlyClosureYears: 8,
      earlyClosureMonths: 4,
    },
  },
  {
    name: "Test Case 3: Minimal difference, small loan",
    input: {
      pnbRate: 7.5,
      currentRate: 8.0,
      loanAmount: 1000000,
      tenureYears: 5,
      tenureMonths: 0,
    },
    expectedOutput: {
      monthlySavings: 500, // Approximate
      totalSavings: 30000, // Approximate
      earlyClosureYears: 4,
      earlyClosureMonths: 6,
    },
  },
  {
    name: "Test Case 4: Large difference, short tenure",
    input: {
      pnbRate: 7.5,
      currentRate: 15.0,
      loanAmount: 3000000,
      tenureYears: 3,
      tenureMonths: 6,
    },
    expectedOutput: {
      monthlySavings: 15000, // Approximate
      totalSavings: 630000, // Approximate
      earlyClosureYears: 2,
      earlyClosureMonths: 1,
    },
  },
  {
    name: "Test Case 5: Mixed tenure with months",
    input: {
      pnbRate: 7.5,
      currentRate: 10.5,
      loanAmount: 4000000,
      tenureYears: 8,
      tenureMonths: 4,
    },
    expectedOutput: {
      monthlySavings: 8000, // Approximate
      totalSavings: 800000, // Approximate
      earlyClosureYears: 5,
      earlyClosureMonths: 8,
    },
  },
];

// Function to run tests
export const runCalculatorTests = (calculateFunction: (data: any) => any) => {
  console.log("Running Loan Calculator Tests...");
  
  testCases.forEach((testCase, index) => {
    console.log(`\n=== ${testCase.name} ===`);
    console.log("Input:", testCase.input);
    
    const result = calculateFunction(testCase.input);
    console.log("Actual Output:", result);
    console.log("Expected Output:", testCase.expectedOutput);
    
    // Tolerance for financial calculations (5% variance allowed)
    const tolerance = 0.05;
    const monthlySavingsMatch = Math.abs(result.monthlySavings - testCase.expectedOutput.monthlySavings) / testCase.expectedOutput.monthlySavings < tolerance;
    const totalSavingsMatch = Math.abs(result.totalSavings - testCase.expectedOutput.totalSavings) / testCase.expectedOutput.totalSavings < tolerance;
    
    console.log("Monthly Savings Match:", monthlySavingsMatch ? "✅" : "❌");
    console.log("Total Savings Match:", totalSavingsMatch ? "✅" : "❌");
    console.log("Early Closure Years:", result.earlyClosureYears);
    console.log("Early Closure Months:", result.earlyClosureMonths);
  });
};