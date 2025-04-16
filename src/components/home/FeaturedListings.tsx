import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import PropertyCard from '@/components/ui/PropertyCard';
import { Property } from '@shared/schema';
import { Button } from '@/components/ui/button';

export default function FeaturedListings() {
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['/api/properties/featured'],
    queryFn: async () => {
      const response = await fetch('/api/properties/featured?limit=3');
      if (!response.ok) {
        throw new Error('Failed to fetch featured properties');
      }
      return response.json() as Promise<Property[]>;
    }
  });

  const [matchScores, setMatchScores] = useState<Record<number, number>>({});

  useEffect(() => {
    // This would normally come from the tenant-property matching algorithm
    // For demo purposes, we're using random scores
    if (properties) {
      const scores: Record<number, number> = {};
      properties.forEach(property => {
        // Generate a score between 70 and 98
        scores[property.id] = Math.floor(Math.random() * 28) + 70;
      });
      setMatchScores(scores);
    }
  }, [properties]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="inline-block bg-[#F59E0B] bg-opacity-10 px-4 py-2 rounded-full text-[#F59E0B] font-medium text-sm mb-4">
              Perfect Matches
            </div>
            <h2 className="text-3xl font-bold text-[#0D1929]">Featured Properties</h2>
          </div>
          
          <div className="hidden md:flex space-x-2">
            <button className="p-2 rounded-full border border-gray-300 text-gray-500 hover:text-[#0D1929] hover:border-[#0D1929]">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="p-2 rounded-full border border-gray-300 text-gray-500 hover:text-[#0D1929] hover:border-[#0D1929]">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(index => (
              <div key={index} className="bg-gray-100 h-80 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            <p>Error loading properties. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties?.map(property => (
              <PropertyCard 
                key={property.id}
                property={property}
                matchScore={matchScores[property.id]}
              />
            ))}
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Link href="/properties">
            <Button variant="outline" className="border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors duration-300 px-6 py-3 h-auto">
              <span>View All Properties</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
