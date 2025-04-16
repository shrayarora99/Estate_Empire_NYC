import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import PropertyCard from "@/components/ui/PropertyCard";
import { Property, TenantProfile } from "@shared/schema";
import { calculatePropertyMatchScore } from "@/lib/propertyMatch";

export default function PropertySearch() {
  const { toast } = useToast();
  
  // Search filters state
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    minPrice: 0,
    maxPrice: 10000,
    bedrooms: "",
    bathrooms: "",
    propertyType: ""
  });
  
  // Price range for display
  const [priceRange, setPriceRange] = useState([0, 10000]);
  
  // Get all properties
  const { data: properties, isLoading: isPropertiesLoading, error: propertiesError } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json() as Promise<Property[]>;
    }
  });
  
  // Get tenant profile for match scoring (in a real app, this would be the authenticated user's profile)
  const { data: tenantProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['/api/tenant-profiles/1'],
    queryFn: async () => {
      const response = await fetch('/api/tenant-profiles/1');
      if (!response.ok) {
        throw new Error('Failed to fetch tenant profile');
      }
      return response.json() as Promise<TenantProfile>;
    }
  });
  
  // Filtered properties
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  // Match scores
  const [matchScores, setMatchScores] = useState<Record<number, number>>({});
  
  // Handle filter changes
  const handleFilterChange = (name: string, value: string | number | number[]) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    handleFilterChange('minPrice', value[0]);
    handleFilterChange('maxPrice', value[1]);
  };
  
  // Apply filters to properties
  useEffect(() => {
    if (!properties) return;
    
    let filtered = [...properties];
    
    // Apply filters
    if (filters.city) {
      filtered = filtered.filter(property => 
        property.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    
    if (filters.state) {
      filtered = filtered.filter(property => 
        property.state.toLowerCase() === filters.state.toLowerCase()
      );
    }
    
    if (filters.minPrice > 0) {
      filtered = filtered.filter(property => 
        property.pricePerMonth >= filters.minPrice
      );
    }
    
    if (filters.maxPrice < 10000) {
      filtered = filtered.filter(property => 
        property.pricePerMonth <= filters.maxPrice
      );
    }
    
    if (filters.bedrooms) {
      filtered = filtered.filter(property => 
        property.bedrooms === parseInt(filters.bedrooms as string)
      );
    }
    
    if (filters.bathrooms) {
      filtered = filtered.filter(property => 
        property.bathrooms === parseFloat(filters.bathrooms as string)
      );
    }
    
    if (filters.propertyType) {
      filtered = filtered.filter(property => 
        property.propertyType === filters.propertyType
      );
    }
    
    setFilteredProperties(filtered);
  }, [properties, filters]);
  
  // Calculate match scores when tenant profile and filtered properties change
  useEffect(() => {
    if (tenantProfile && filteredProperties.length > 0) {
      const scores: Record<number, number> = {};
      
      filteredProperties.forEach(property => {
        scores[property.id] = calculatePropertyMatchScore(tenantProfile, property);
      });
      
      setMatchScores(scores);
    }
  }, [tenantProfile, filteredProperties]);
  
  // Calculate price range from available properties
  useEffect(() => {
    if (properties && properties.length > 0) {
      const prices = properties.map(p => p.pricePerMonth);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      
      setPriceRange([minPrice, maxPrice]);
      setFilters(prev => ({
        ...prev,
        minPrice,
        maxPrice
      }));
    }
  }, [properties]);
  
  const isLoading = isPropertiesLoading || isProfileLoading;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1929]">Find Your Perfect Home</h1>
          <p className="text-gray-600">Browse properties that match your criteria</p>
        </div>
        
        {tenantProfile && (
          <div className="bg-[#0D1929] p-3 rounded-lg text-white flex items-center">
            <span className="mr-2">Your Credential Score:</span>
            <div className="bg-white text-[#0D1929] rounded-full px-3 py-1 font-bold font-mono">
              {tenantProfile.overallScore}
            </div>
          </div>
        )}
      </div>
      
      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
              <Input 
                placeholder="City (e.g. New York)" 
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">State</label>
              <Select
                value={filters.state}
                onValueChange={(value) => handleFilterChange('state', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Bedrooms</label>
              <Select
                value={filters.bedrooms}
                onValueChange={(value) => handleFilterChange('bedrooms', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Bathrooms</label>
              <Select
                value={filters.bathrooms}
                onValueChange={(value) => handleFilterChange('bathrooms', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="1.5">1.5</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="2.5">2.5</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Property Type</label>
              <Select
                value={filters.propertyType}
                onValueChange={(value) => handleFilterChange('propertyType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Button 
                className="w-full bg-[#2563EB] mt-6"
                onClick={() => {
                  setFilters({
                    city: "",
                    state: "",
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    bedrooms: "",
                    bathrooms: "",
                    propertyType: ""
                  });
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
            </div>
            <Slider
              defaultValue={[0, 10000]}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              min={0}
              max={10000}
              step={100}
              className="my-4"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Property Listings */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#0D1929]">
          {isLoading ? 'Loading properties...' : 
            filteredProperties.length === 0 ? 'No properties found' : 
            `${filteredProperties.length} Properties Found`}
        </h2>
        
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Sort by:</span>
          <Select defaultValue="match">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Best Match</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : propertiesError ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-red-500 mb-3">
            <i className="fas fa-exclamation-circle text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Error Loading Properties</h3>
          <p className="text-gray-500 mb-4">There was an error loading the property listings. Please try again.</p>
          <Button 
            variant="default" 
            className="bg-[#2563EB]"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-3">
            <i className="fas fa-home text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Properties Found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters to see more results.</p>
          <Button 
            variant="default" 
            className="bg-[#2563EB]"
            onClick={() => {
              setFilters({
                city: "",
                state: "",
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                bedrooms: "",
                bathrooms: "",
                propertyType: ""
              });
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              matchScore={matchScores[property.id]}
            />
          ))}
        </div>
      )}
      
      {filteredProperties.length > 0 && filteredProperties.length < (properties?.length || 0) && (
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-2">
            Showing {filteredProperties.length} of {properties?.length} properties
          </p>
          <Button 
            variant="outline" 
            className="border-[#2563EB] text-[#2563EB]"
            onClick={() => {
              setFilters({
                city: "",
                state: "",
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                bedrooms: "",
                bathrooms: "",
                propertyType: ""
              });
              
              toast({
                title: "Filters Reset",
                description: "Showing all available properties",
              });
            }}
          >
            View All Properties
          </Button>
        </div>
      )}
    </div>
  );
}
