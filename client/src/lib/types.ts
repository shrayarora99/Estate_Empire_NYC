import { User, TenantProfile, Property, Document, PropertyView } from "@shared/schema";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface UserWithProfile extends User {
  tenantProfile?: TenantProfile;
}

export interface PropertyWithDetails extends Property {
  landlord?: User;
  viewings?: PropertyView[];
}

export interface DocumentWithDetails extends Document {
  documentTypeName: string;
}

export interface PropertySearchFilters {
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  availableFrom?: Date;
}

// Structure for credential scoring breakdown
export interface CredentialBreakdown {
  income: {
    score: number;
    details: {
      annualIncome: number;
      rentToIncomeRatio: number;
    };
  };
  credit: {
    score: number;
    details: {
      creditScore: number;
      paymentHistory: string;
    };
  };
  rentalHistory: {
    score: number;
    details: {
      yearsOfHistory: number;
      previousEvictions: number;
    };
  };
  employment: {
    score: number;
    details: {
      yearsAtCurrentJob: number;
      stabilityRating: string;
    };
  };
  overall: number;
}

// Response structure for the tenant-property matching API
export interface MatchResponse {
  property: Property;
  matchScore: number;
}

// External API response types
export interface RealtyPropertyData {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  images: string[];
  description: string;
  yearBuilt: number;
  features: string[];
}

export interface MLSListing {
  mlsId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  images: string[];
  description: string;
  daysOnMarket: number;
  listingDate: string;
  status: string;
}

export interface MLSSearchParams {
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
}

// Dashboard data structures
export interface TenantDashboardData {
  profile: TenantProfile;
  documents: Document[];
  propertyViews: PropertyView[];
  matchedProperties: Property[];
}

export interface LandlordDashboardData {
  properties: Property[];
  propertyViews: {
    propertyId: number;
    views: PropertyView[];
  }[];
  stats: {
    totalProperties: number;
    totalViews: number;
    pendingApplications: number;
    approvedApplications: number;
  };
}
