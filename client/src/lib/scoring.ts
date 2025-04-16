// Constants for score calculations
const SCORE_RANGES = {
  EXCELLENT: { min: 85, max: 100 },
  GOOD: { min: 70, max: 84 },
  FAIR: { min: 60, max: 69 },
  POOR: { min: 0, max: 59 },
};

// Calculate income score based on income and target rent
export function calculateIncomeScore(annualIncome: number, rentPerMonth: number): number {
  // Calculate rent-to-income ratio (monthly rent * 12 / annual income)
  const rentToIncomeRatio = (rentPerMonth * 12) / annualIncome;
  
  // Industry standard is typically 30% or lower for rent-to-income ratio
  if (rentToIncomeRatio <= 0.25) {
    // Excellent: 25% or less of income goes to rent
    return Math.min(100, Math.max(SCORE_RANGES.EXCELLENT.min, 100 - rentToIncomeRatio * 100));
  } else if (rentToIncomeRatio <= 0.30) {
    // Good: 26-30% of income goes to rent
    return Math.min(SCORE_RANGES.GOOD.max, Math.max(SCORE_RANGES.GOOD.min, 95 - (rentToIncomeRatio - 0.25) * 200));
  } else if (rentToIncomeRatio <= 0.40) {
    // Fair: 31-40% of income goes to rent
    return Math.min(SCORE_RANGES.FAIR.max, Math.max(SCORE_RANGES.FAIR.min, 75 - (rentToIncomeRatio - 0.30) * 150));
  } else {
    // Poor: More than 40% of income goes to rent
    return Math.max(SCORE_RANGES.POOR.min, 55 - (rentToIncomeRatio - 0.40) * 100);
  }
}

// Calculate credit score rating (simplified version)
export function calculateCreditScoreRating(creditScore: number): number {
  if (creditScore >= 750) {
    return Math.min(100, 85 + (creditScore - 750) / 10);
  } else if (creditScore >= 700) {
    return Math.min(SCORE_RANGES.GOOD.max, 70 + (creditScore - 700) / 2);
  } else if (creditScore >= 650) {
    return Math.min(SCORE_RANGES.FAIR.max, 60 + (creditScore - 650) / 2);
  } else if (creditScore >= 580) {
    return Math.min(SCORE_RANGES.POOR.max, 30 + (creditScore - 580) / 2);
  } else {
    return Math.max(SCORE_RANGES.POOR.min, 30 - (580 - creditScore) / 10);
  }
}

// Calculate rental history score based on years of rental history and evictions
export function calculateRentalHistoryScore(
  yearsOfHistory: number, 
  evictionCount: number, 
  latePaymentCount: number
): number {
  // Start with a base score
  let score = 70;
  
  // Add points for years of history (up to 5 years)
  score += Math.min(yearsOfHistory, 5) * 5;
  
  // Subtract points for evictions (severe penalty)
  score -= evictionCount * 50;
  
  // Subtract points for late payments
  score -= latePaymentCount * 2;
  
  // Ensure the score is within the valid range
  return Math.min(100, Math.max(0, score));
}

// Calculate employment stability score
export function calculateEmploymentScore(
  yearsAtCurrentJob: number, 
  monthsUnemployedLast3Years: number
): number {
  // Start with a base score
  let score = 70;
  
  // Add points for job stability (up to 5 years)
  score += Math.min(yearsAtCurrentJob, 5) * 6;
  
  // Subtract points for unemployment gaps
  score -= monthsUnemployedLast3Years * 3;
  
  // Ensure the score is within the valid range
  return Math.min(100, Math.max(0, score));
}

// Calculate overall tenant credential score
export function calculateOverallScore(
  incomeScore: number,
  creditScore: number,
  rentalHistoryScore: number,
  employmentScore: number
): number {
  // Weighted average of all scores
  // Income and credit are weighted more heavily than rental history and employment
  const weightedScore = (
    (incomeScore * 0.35) +
    (creditScore * 0.30) +
    (rentalHistoryScore * 0.20) +
    (employmentScore * 0.15)
  );
  
  return Math.round(weightedScore);
}

// Get text rating for a score
export function getScoreRating(score: number): string {
  if (score >= SCORE_RANGES.EXCELLENT.min) {
    return "Excellent";
  } else if (score >= SCORE_RANGES.GOOD.min) {
    return "Good";
  } else if (score >= SCORE_RANGES.FAIR.min) {
    return "Fair";
  } else {
    return "Poor";
  }
}

// Get color class for a score
export function getScoreColor(score: number): string {
  if (score >= SCORE_RANGES.EXCELLENT.min) {
    return "text-green-600";
  } else if (score >= SCORE_RANGES.GOOD.min) {
    return "text-yellow-600";
  } else if (score >= SCORE_RANGES.FAIR.min) {
    return "text-orange-600";
  } else {
    return "text-red-600";
  }
}

// Get background color class for a score
export function getScoreBgColor(score: number): string {
  if (score >= SCORE_RANGES.EXCELLENT.min) {
    return "bg-green-500";
  } else if (score >= SCORE_RANGES.GOOD.min) {
    return "bg-yellow-500";
  } else if (score >= SCORE_RANGES.FAIR.min) {
    return "bg-orange-500";
  } else {
    return "bg-red-500";
  }
}
