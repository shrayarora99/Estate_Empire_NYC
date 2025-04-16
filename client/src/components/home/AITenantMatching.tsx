import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AITenantMatching() {
  return (
    <section className="py-16 bg-[#0D1929] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#2563EB] bg-opacity-20 px-4 py-2 rounded-full text-[#3B82F6] font-medium text-sm mb-4">
            AI-Powered Technology
          </div>
          <h2 className="text-3xl font-bold mb-4">Perfect Match Guarantee</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our AI-driven matching algorithm analyzes over 50 data points to ensure tenants and properties are perfectly aligned, saving time and frustration.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 bg-[#152238] text-white flex justify-between items-center">
                <h3 className="font-semibold">Property Requirements</h3>
                <div className="bg-green-500 text-xs px-2 py-1 rounded-full">Premium Listing</div>
              </div>
              
              <div className="p-6">
                <h4 className="text-[#0D1929] font-bold text-xl mb-2">Park Slope Townhouse</h4>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  <span>135 7th Ave, Brooklyn, NY</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-dollar-sign text-[#F59E0B] mr-2"></i>
                        <h5 className="font-medium text-[#0D1929]">Minimum Income</h5>
                      </div>
                      <div className="text-[#0D1929] font-semibold">$120,000/year</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-credit-card text-[#F59E0B] mr-2"></i>
                        <h5 className="font-medium text-[#0D1929]">Credit Score</h5>
                      </div>
                      <div className="text-[#0D1929] font-semibold">700+</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-file-contract text-[#F59E0B] mr-2"></i>
                        <h5 className="font-medium text-[#0D1929]">Rental History</h5>
                      </div>
                      <div className="text-[#0D1929] font-semibold">3+ years</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-briefcase text-[#F59E0B] mr-2"></i>
                        <h5 className="font-medium text-[#0D1929]">Employment</h5>
                      </div>
                      <div className="text-[#0D1929] font-semibold">Stable (2+ years)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-24 bg-[#2563EB] rounded-l-lg"></div>
            <div className="absolute -bottom-4 right-8 w-16 h-8 bg-[#F59E0B] rounded-b-lg"></div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-6">How Our AI Matching Works</h3>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                    <i className="fas fa-robot"></i>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-2">Data Analysis</h4>
                  <p className="text-gray-300">
                    Our AI analyzes tenant credentials and property requirements to find the perfect matches, considering both objective criteria and subtle factors.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                    <i className="fas fa-percentage"></i>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-2">Match Scoring</h4>
                  <p className="text-gray-300">
                    Each potential match receives a comprehensive score, helping tenants focus on properties where they're most likely to be approved.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-2">Secure Verification</h4>
                  <p className="text-gray-300">
                    Documents are securely stored and verified using blockchain technology, ensuring privacy and preventing fraud.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/properties">
                <Button variant="default" className="bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0D1929] px-6 py-3 h-auto">
                  <span>Get Matched Now</span>
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
