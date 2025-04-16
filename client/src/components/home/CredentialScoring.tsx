import ScoreRing from "@/components/ui/ScoreRing";
import CredentialReport from "@/components/ui/CredentialReport";
import { TenantProfile } from "@shared/schema";

interface CredentialFactor {
  id: number;
  name: string;
  description: string;
  score: number;
}

export default function CredentialScoring() {
  const credentialFactors: CredentialFactor[] = [
    {
      id: 1,
      name: "Income Verification",
      description: "Income stability and rent-to-income ratio",
      score: 85
    },
    {
      id: 2,
      name: "Credit History",
      description: "Credit score and payment history",
      score: 72
    },
    {
      id: 3,
      name: "Rental History",
      description: "Previous rental references and history",
      score: 91
    }
  ];
  
  // Sample tenant profile
  const sampleProfile: TenantProfile = {
    id: 1,
    userId: 1,
    incomeVerified: true,
    creditScoreVerified: true,
    rentalHistoryVerified: true,
    employmentVerified: true,
    incomeScore: 85,
    creditScore: 72,
    rentalHistoryScore: 91,
    employmentScore: 88,
    overallScore: 92,
    verificationBadge: true,
    verifiedAt: new Date(),
    updatedAt: new Date()
  };
  
  const sampleUser = {
    fullName: "Michael Johnson",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  };
  
  const detailedInfo = {
    income: 95000,
    creditScore: 722,
    rentalHistory: 5,
    rentToIncomeRatio: 22,
    paymentHistory: "Good",
    previousEvictions: 0
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-[#2563EB] bg-opacity-10 px-4 py-2 rounded-full text-[#2563EB] font-medium text-sm mb-4">
              Tenant Credential System
            </div>
            <h2 className="text-3xl font-bold text-[#0D1929] mb-4">Advanced Credential Scoring</h2>
            <p className="text-gray-600 mb-8">
              Our proprietary scoring system evaluates tenants across multiple dimensions to create a comprehensive profile that landlords can trust.
            </p>
            
            <div className="space-y-6">
              {credentialFactors.map(factor => (
                <div key={factor.id} className="flex items-center">
                  <ScoreRing 
                    score={factor.score} 
                    size="md" 
                    className="w-16 h-16" 
                  />
                  
                  <div className="ml-4">
                    <h4 className="text-[#0D1929] font-medium">{factor.name}</h4>
                    <p className="text-gray-500 text-sm">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <CredentialReport 
            profile={sampleProfile} 
            user={sampleUser}
            detailedInfo={detailedInfo}
          />
        </div>
      </div>
    </section>
  );
}
