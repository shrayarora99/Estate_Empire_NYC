import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import CredentialScoring from "@/components/home/CredentialScoring";
import FeaturedListings from "@/components/home/FeaturedListings";
import AITenantMatching from "@/components/home/AITenantMatching";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <CredentialScoring />
      <FeaturedListings />
      <AITenantMatching />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
