import { Link } from "wouter";
import EstateEmpireLogo from "@/components/ui/icons/EstateEmpireLogo";

export default function Footer() {
  return (
    <footer className="bg-[#0D1929] text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 relative mr-3">
                <EstateEmpireLogo />
              </div>
              <div className="text-xl font-bold">Estate Empire</div>
            </div>
            <p className="text-gray-400 mb-4">Stop Chasing, Start Closing!</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For Tenants</h4>
            <ul className="space-y-2">
              <li><Link href="/how-it-works"><a className="text-gray-400 hover:text-white">How It Works</a></Link></li>
              <li><Link href="/properties"><a className="text-gray-400 hover:text-white">Search Properties</a></Link></li>
              <li><Link href="/documents"><a className="text-gray-400 hover:text-white">Get Pre-Screened</a></Link></li>
              <li><Link href="/tenant-dashboard"><a className="text-gray-400 hover:text-white">Tenant Dashboard</a></Link></li>
              <li><Link href="/testimonials"><a className="text-gray-400 hover:text-white">Success Stories</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For Landlords</h4>
            <ul className="space-y-2">
              <li><Link href="/landlord-benefits"><a className="text-gray-400 hover:text-white">Landlord Benefits</a></Link></li>
              <li><Link href="/landlord-dashboard"><a className="text-gray-400 hover:text-white">List Your Property</a></Link></li>
              <li><Link href="/screening-process"><a className="text-gray-400 hover:text-white">Screening Process</a></Link></li>
              <li><Link href="/property-management"><a className="text-gray-400 hover:text-white">Property Management Tools</a></Link></li>
              <li><Link href="/pricing"><a className="text-gray-400 hover:text-white">Pricing & Plans</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/about"><a className="text-gray-400 hover:text-white">About Us</a></Link></li>
              <li><Link href="/blog"><a className="text-gray-400 hover:text-white">Blog</a></Link></li>
              <li><Link href="/faq"><a className="text-gray-400 hover:text-white">FAQ</a></Link></li>
              <li><Link href="/contact"><a className="text-gray-400 hover:text-white">Contact Us</a></Link></li>
              <li><Link href="/terms"><a className="text-gray-400 hover:text-white">Terms of Service</a></Link></li>
              <li><Link href="/privacy"><a className="text-gray-400 hover:text-white">Privacy Policy</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Estate Empire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
