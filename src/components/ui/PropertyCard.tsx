import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import ScoreRing from '@/components/ui/ScoreRing';
import { Property } from '@shared/schema';

interface PropertyCardProps {
  property: Property;
  matchScore?: number;
}

export default function PropertyCard({ property, matchScore }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  const getMatchScoreColor = () => {
    if (!matchScore) return "bg-gray-500";
    if (matchScore >= 85) return "bg-green-500";
    if (matchScore >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl">
      <div className="relative h-48">
        <img 
          src={property.images[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <div className="bg-[#0D1929] bg-opacity-80 text-white px-3 py-1 rounded-full text-sm font-medium">
            ${property.pricePerMonth}/mo
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex space-x-2">
          <div 
            className="bg-white bg-opacity-80 p-2 rounded-full cursor-pointer"
            onClick={toggleFavorite}
          >
            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}></i>
          </div>
          <div className="bg-white bg-opacity-80 p-2 rounded-full cursor-pointer">
            <i className="fas fa-share text-[#0D1929]"></i>
          </div>
        </div>
        
        {matchScore && (
          <div className="absolute bottom-4 right-4">
            <div className={`flex items-center ${getMatchScoreColor()} bg-opacity-90 px-3 py-1 rounded-full`}>
              <div className="relative w-5 h-5 mr-1">
                <ScoreRing score={matchScore} size="sm" showLabel={false} className="w-5 h-5" />
              </div>
              <span className="text-white text-xs font-medium">{matchScore}% Match</span>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-[#0D1929] mb-1">{property.title}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <i className="fas fa-map-marker-alt mr-1"></i>
          <span>{property.address}, {property.city}, {property.state}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <i className="fas fa-bed mr-1"></i>
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-bath mr-1"></i>
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-ruler-combined mr-1"></i>
            <span>{property.squareFeet} sq ft</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-1 text-yellow-400">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className={`${Math.random() > 0.5 ? 'fas' : 'far'} fa-star`}></i>
              <span className="text-gray-600 text-sm ml-1">
                {(4 + Math.random()).toFixed(1)}
              </span>
            </div>
            
            <Link href={`/property/${property.id}`}>
              <a className="bg-[#2563EB] hover:bg-[#3B82F6] text-white px-4 py-2 rounded-md text-sm font-medium">
                View Details
              </a>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
