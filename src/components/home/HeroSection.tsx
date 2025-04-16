import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ScoreRing from "@/components/ui/ScoreRing";

export default function HeroSection() {
  return (
    <section className="bg-[#0D1929] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Stop Chasing, Start Closing!
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Pre-screen tenants and properties for the perfect match. Cut down viewing delays and accelerate the speed-to-lease process.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/properties">
                <Button variant="default" className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-6 py-3 h-auto text-md w-full sm:w-auto">
                  <span>Find Your Perfect Home</span>
                  <i className="fas fa-home ml-2"></i>
                </Button>
              </Link>
              <Link href="/landlord-dashboard">
                <Button variant="default" className="bg-white hover:bg-gray-100 text-[#0D1929] px-6 py-3 h-auto text-md w-full sm:w-auto">
                  <span>List Your Property</span>
                  <i className="fas fa-building ml-2"></i>
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-300"></div>
                <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-300"></div>
                <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-300"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-300">
                  Trusted by <span className="font-bold text-white">1,000+</span> landlords and <span className="font-bold text-white">5,000+</span> tenants
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative h-96 rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" 
              alt="Modern apartment building" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1929] to-transparent opacity-70"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[#0D1929] font-semibold">Chelsea Modern Condo</h3>
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Perfect Match
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <i className="fas fa-map-marker-alt text-[#2563EB] mr-1"></i>
                  <span>514 W 24th St, New York, NY</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-[#0D1929] font-bold text-xl">$3,500</div>
                    <div className="text-gray-500 text-sm ml-1">/month</div>
                  </div>
                  
                  <div className="flex items-center bg-[#152238] px-3 py-1 rounded-full">
                    <ScoreRing 
                      score={92} 
                      size="sm" 
                      className="mr-2 w-6 h-6" 
                    />
                    <span className="text-white text-xs font-medium">Score Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
