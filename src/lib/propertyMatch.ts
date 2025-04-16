import { Property, TenantProfile } from "@shared/schema";
import { getScoreRating } from "./scoring";

export interface PropertyMatch {
  property: Property;
  matchScore: number;
  matchAreas: {
    income: {
      score: number;
      rating: string;
      details: string;
    };
    creditScore: {
      score: number;
      rating: string;
      details: string;
    };
    rentalHistory: {
      score: number;
      rating: string;
      details: string;
    };
    employment: {
      score: number;
      rating: string;
      details: string;
    };
  };
}

/**
 * Calculate the match score between a tenant and a property
 * This is a frontend calculation for UI purposes - the actual matching
 * algorithm runs on the backend for security and accuracy
 */
export function calculatePropertyMatchScore(
  tenantProfile: TenantProfile,
  property: Property
): number {
  if (!tenantProfile || !property) {
    return 0;
  }

  // Match on income requirement
  let incomeMatch = 100;
  if (property.minimumIncome && tenantProfile.incomeScore) {
    // Convert the tenant's income score to an estimated annual income
    // This is just a frontend approximation
    const estimatedAnnualIncome = tenantProfile.incomeScore * 1500; // Rough estimate
    const incomeRatio = estimatedAnnualIncome / property.minimumIncome;
    incomeMatch = Math.min(100, Math.round(incomeRatio * 100));
  }

  // Match on credit score
  let creditMatch = 100;
  if (property.minimumCreditScore && tenantProfile.creditScore) {
    // Convert tenant's credit score rating to an estimated FICO score
    // This is just a frontend approximation
    const estimatedCreditScore = 550 + (tenantProfile.creditScore * 2.5);
    creditMatch = Math.min(100, Math.round((estimatedCreditScore / property.minimumCreditScore) * 100));
  }

  // Match on rental history
  let rentalMatch = 100;
  if (property.requiredRentalHistory && tenantProfile.rentalHistoryScore) {
    // Convert tenant's rental history score to estimated months of history
    // This is just a frontend approximation
    const estimatedMonthsHistory = tenantProfile.rentalHistoryScore * 0.8;
    rentalMatch = Math.min(100, Math.round((estimatedMonthsHistory / property.requiredRentalHistory) * 100));
  }

  // Match on employment stability
  let employmentMatch = 100;
  if (property.requiredEmploymentStability && tenantProfile.employmentScore) {
    // Convert tenant's employment score to estimated months of stability
    // This is just a frontend approximation
    const estimatedMonthsEmployment = tenantProfile.employmentScore * 0.6;
    employmentMatch = Math.min(100, Math.round((estimatedMonthsEmployment / property.requiredEmploymentStability) * 100));
  }

  // Calculate weighted match score
  const weightedMatch = (
    (incomeMatch * 0.35) +
    (creditMatch * 0.30) +
    (rentalMatch * 0.20) +
    (employmentMatch * 0.15)
  );

  return Math.round(weightedMatch);
}

/**
 * Generate a detailed property match report for tenant-property compatibility
 */
export function generatePropertyMatchReport(
  tenantProfile: TenantProfile,
  property: Property
): PropertyMatch {
  if (!tenantProfile || !property) {
    return {
      property,
      matchScore: 0,
      matchAreas: {
        income: { score: 0, rating: "N/A", details: "Information unavailable" },
        creditScore: { score: 0, rating: "N/A", details: "Information unavailable" },
        rentalHistory: { score: 0, rating: "N/A", details: "Information unavailable" },
        employment: { score: 0, rating: "N/A", details: "Information unavailable" }
      }
    };
  }

  // Calculate individual match scores
  const incomeScore = tenantProfile.incomeScore || 0;
  const creditScore = tenantProfile.creditScore || 0;
  const rentalHistoryScore = tenantProfile.rentalHistoryScore || 0;
  const employmentScore = tenantProfile.employmentScore || 0;

  // Generate match details
  const incomeDetails = property.minimumIncome 
    ? `Required: $${property.minimumIncome.toLocaleString()}/year`
    : "No minimum income requirement";

  const creditDetails = property.minimumCreditScore 
    ? `Required: ${property.minimumCreditScore}+`
    : "No minimum credit score requirement";

  const rentalDetails = property.requiredRentalHistory 
    ? `Required: ${Math.round(property.requiredRentalHistory / 12)} years`
    : "No rental history requirement";

  const employmentDetails = property.requiredEmploymentStability 
    ? `Required: ${Math.round(property.requiredEmploymentStability / 12)} years stability`
    : "No employment stability requirement";

  // Calculate overall match score
  const matchScore = calculatePropertyMatchScore(tenantProfile, property);

  return {
    property,
    matchScore,
    matchAreas: {
      income: {
        score: incomeScore,
        rating: getScoreRating(incomeScore),
        details: incomeDetails
      },
      creditScore: {
        score: creditScore,
        rating: getScoreRating(creditScore),
        details: creditDetails
      },
      rentalHistory: {
        score: rentalHistoryScore,
        rating: getScoreRating(rentalHistoryScore),
        details: rentalDetails
      },
      employment: {
        score: employmentScore,
        rating: getScoreRating(employmentScore),
        details: employmentDetails
      }
    }
  };
}

/**
 * Sort properties by match score (highest first)
 */
export function sortPropertiesByMatchScore(
  properties: Property[], 
  tenantProfile: TenantProfile
): Property[] {
  if (!properties || !properties.length || !tenantProfile) {
    return properties || [];
  }

  return [...properties].sort((a, b) => {
    const scoreA = calculatePropertyMatchScore(tenantProfile, a);
    const scoreB = calculatePropertyMatchScore(tenantProfile, b);
    return scoreB - scoreA;
  });
}
