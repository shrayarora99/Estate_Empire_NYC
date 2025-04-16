import { useState } from "react";
import { Link, useLocation } from "wouter";
import EstateEmpireLogo from "@/components/ui/icons/EstateEmpireLogo";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-[#0D1929] text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="h-10 w-10 relative cursor-pointer">
                  <EstateEmpireLogo />
                </div>
              </Link>
            </div>
            <div className="ml-4 text-xl font-bold">
              <Link href="/">Estate Empire</Link>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className={`text-white hover:text-[#FBBF24] px-3 py-2 rounded-md text-sm font-medium border-b-2 ${location === "/" ? "border-[#2563EB]" : "border-transparent hover:border-[#FBBF24]"}`}>
                Home
              </a>
            </Link>
            <Link href="/properties">
              <a className={`text-gray-300 hover:text-white hover:border-[#FBBF24] px-3 py-2 rounded-md text-sm font-medium border-b-2 ${location === "/properties" ? "border-[#2563EB]" : "border-transparent"}`}>
                For Tenants
              </a>
            </Link>
            <Link href="/landlord-dashboard">
              <a className={`text-gray-300 hover:text-white hover:border-[#FBBF24] px-3 py-2 rounded-md text-sm font-medium border-b-2 ${location === "/landlord-dashboard" ? "border-[#2563EB]" : "border-transparent"}`}>
                For Landlords
              </a>
            </Link>
            <Link href="/how-it-works">
              <a className={`text-gray-300 hover:text-white hover:border-[#FBBF24] px-3 py-2 rounded-md text-sm font-medium border-b-2 ${location === "/how-it-works" ? "border-[#2563EB]" : "border-transparent"}`}>
                How It Works
              </a>
            </Link>
          </nav>
          
          <div className="flex items-center">
            <Link href="/login">
              <Button variant="default" className="bg-[#2563EB] hover:bg-[#3B82F6] text-white mr-2">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="default" className="bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0D1929]">
                Sign Up
              </Button>
            </Link>
            
            <div className="md:hidden ml-4">
              <button 
                type="button" 
                className="text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/">
                <a className={`${location === "/" ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium`}>
                  Home
                </a>
              </Link>
              <Link href="/properties">
                <a className={`${location === "/properties" ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium`}>
                  For Tenants
                </a>
              </Link>
              <Link href="/landlord-dashboard">
                <a className={`${location === "/landlord-dashboard" ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium`}>
                  For Landlords
                </a>
              </Link>
              <Link href="/how-it-works">
                <a className={`${location === "/how-it-works" ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} block px-3 py-2 rounded-md text-base font-medium`}>
                  How It Works
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
