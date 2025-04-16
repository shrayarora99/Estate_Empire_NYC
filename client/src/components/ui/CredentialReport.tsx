import { Card, CardContent } from "@/components/ui/card";
import ScoreRing from "@/components/ui/ScoreRing";
import { TenantProfile } from "@shared/schema";

interface CredentialReportProps {
  profile: TenantProfile;
  user: {
    fullName: string;
    profilePicture?: string;
  };
  detailedInfo?: {
    income?: number;
    creditScore?: number;
    rentalHistory?: number;
    rentToIncomeRatio?: number;
    paymentHistory?: string;
    previousEvictions?: number;
  };
}

export default function CredentialReport({ 
  profile, 
  user,
  detailedInfo
}: CredentialReportProps) {
  // Helper functions to determine rating text
  const getRatingText = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Poor";
  };
  
  const getRatingColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 bg-[#0D1929] text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Tenant Verification Report</h3>
          {profile.verificationBadge && (
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Verified</span>
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <img 
            className="h-16 w-16 rounded-full border-2 border-gray-200" 
            src={user.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
            alt={`${user.fullName}'s profile`} 
          />
          <div className="ml-4">
            <h4 className="text-lg font-semibold text-[#0D1929]">{user.fullName}</h4>
            <div className="flex items-center mt-1">
              {profile.verificationBadge && (
                <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <i className="fas fa-badge-check mr-1"></i>
                  <span>Verified Tenant</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-auto">
            <ScoreRing 
              score={profile.overallScore || 0} 
              size="lg"
              className="w-20 h-20"
            />
          </div>
        </div>
        
        {/* Credential Details */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <i className="fas fa-coins text-[#F59E0B] mr-2"></i>
                <h5 className="font-medium text-[#0D1929]">Income</h5>
              </div>
              <div className="text-sm text-gray-500">
                ${detailedInfo?.income?.toLocaleString() || 'N/A'}/year
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${getRatingColor(profile.incomeScore || 0).replace('text-', 'bg-')} h-2 rounded-full`} 
                style={{ width: `${profile.incomeScore || 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>
                Rent-to-income ratio: {detailedInfo?.rentToIncomeRatio || 'N/A'}%
              </span>
              <span className={`font-semibold ${getRatingColor(profile.incomeScore || 0)}`}>
                {getRatingText(profile.incomeScore || 0)}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <i className="fas fa-credit-card text-[#F59E0B] mr-2"></i>
                <h5 className="font-medium text-[#0D1929]">Credit Score</h5>
              </div>
              <div className="text-sm text-gray-500">
                {detailedInfo?.creditScore || 'N/A'}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${getRatingColor(profile.creditScore || 0).replace('text-', 'bg-')} h-2 rounded-full`} 
                style={{ width: `${profile.creditScore || 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>
                Payment history: {detailedInfo?.paymentHistory || 'N/A'}
              </span>
              <span className={`font-semibold ${getRatingColor(profile.creditScore || 0)}`}>
                {getRatingText(profile.creditScore || 0)}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <i className="fas fa-history text-[#F59E0B] mr-2"></i>
                <h5 className="font-medium text-[#0D1929]">Rental History</h5>
              </div>
              <div className="text-sm text-gray-500">
                {detailedInfo?.rentalHistory || 0} years
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${getRatingColor(profile.rentalHistoryScore || 0).replace('text-', 'bg-')} h-2 rounded-full`} 
                style={{ width: `${profile.rentalHistoryScore || 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>
                Previous evictions: {detailedInfo?.previousEvictions || 'None'}
              </span>
              <span className={`font-semibold ${getRatingColor(profile.rentalHistoryScore || 0)}`}>
                {getRatingText(profile.rentalHistoryScore || 0)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="w-full bg-[#2563EB] hover:bg-[#3B82F6] text-white font-medium py-2 rounded-md flex items-center justify-center">
            <i className="fas fa-file-download mr-2"></i>
            <span>Download Full Report</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
