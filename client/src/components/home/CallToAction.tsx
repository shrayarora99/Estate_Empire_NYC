import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CallToAction() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D1929] rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Rental Experience?
              </h2>
              <p className="text-gray-300 mb-8">
                Join Estate Empire today and experience the future of renting. Our AI-powered platform makes finding your perfect match faster and easier than ever.
              </p>
              
              <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
                <Link href="/signup">
                  <Button variant="default" className="w-full md:w-auto bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0D1929] px-6 py-3 h-auto">
                    <span>Get Started</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full md:w-auto bg-transparent border border-white text-white hover:bg-white hover:text-[#0D1929] px-6 py-3 h-auto">
                    <span>Schedule a Demo</span>
                    <i className="fas fa-calendar-alt ml-2"></i>
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8">
                <div className="text-gray-300 text-sm mb-2">Trusted by leading real estate companies:</div>
                <div className="flex space-x-6">
                  <div className="h-8 w-24 bg-gray-600 rounded opacity-50"></div>
                  <div className="h-8 w-24 bg-gray-600 rounded opacity-50"></div>
                  <div className="h-8 w-24 bg-gray-600 rounded opacity-50"></div>
                </div>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1" 
                alt="Modern apartment interior" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D1929] to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
