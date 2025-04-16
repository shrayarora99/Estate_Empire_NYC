import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ScoreRing from "@/components/ui/ScoreRing";
import { Property, TenantProfile, User } from "@shared/schema";
import { generatePropertyMatchReport } from "@/lib/propertyMatch";

export default function PropertyDetails() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/property/:id");
  const propertyId = match ? parseInt(params.id) : 0;
  
  const [activeTab, setActiveTab] = useState("overview");
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  
  // Fetch property data
  const { data: property, isLoading: isPropertyLoading, error: propertyError } = useQuery({
    queryKey: [`/api/properties/${propertyId}`],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property data');
      }
      return response.json() as Promise<Property>;
    },
    enabled: !!propertyId
  });
  
  // Fetch landlord data
  const { data: landlord, isLoading: isLandlordLoading } = useQuery({
    queryKey: [`/api/users/${property?.landlordId}`],
    queryFn: async () => {
      const response = await fetch(`/api/users/${property?.landlordId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch landlord data');
      }
      return response.json() as Promise<User>;
    },
    enabled: !!property
  });
  
  // In a real app, this would be fetched based on the authenticated user
  // For demo purposes, we'll use the sample tenant profile
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
  
  // Calculate match score
  const [matchReport, setMatchReport] = useState<any>(null);
  
  useEffect(() => {
    if (property && tenantProfile) {
      setMatchReport(generatePropertyMatchReport(tenantProfile, property));
    }
  }, [property, tenantProfile]);
  
  // Handle application submission
  const handleApply = async () => {
    try {
      // In a real app, this would be the authenticated user's ID
      const tenantId = 1;
      
      const response = await fetch('/api/property-views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          tenantId,
          matchScore: matchReport?.matchScore || 0,
          applicationStatus: 'pending',
          viewingDate: new Date().toISOString(),
          notes: "Interested in this property"
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      
      setApplicationSubmitted(true);
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const isLoading = isPropertyLoading || isLandlordLoading || isProfileLoading;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (propertyError || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-red-500 mb-3">
            <i className="fas fa-exclamation-circle text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Property Not Found</h3>
          <p className="text-gray-500 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <Link href="/properties">
            <Button variant="default" className="bg-[#2563EB]">
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Link href="/properties">
            <a className="text-[#2563EB] mb-2 inline-block">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Properties
            </a>
          </Link>
          <h1 className="text-3xl font-bold text-[#0D1929]">{property.title}</h1>
          <p className="text-gray-600">
            <i className="fas fa-map-marker-alt mr-1"></i>
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" className="border-[#2563EB] text-[#2563EB]">
            <i className="fas fa-heart mr-2"></i>
            Save
          </Button>
          <Button variant="outline" className="border-[#2563EB] text-[#2563EB]">
            <i className="fas fa-share-alt mr-2"></i>
            Share
          </Button>
          <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#2563EB]">
                <i className="fas fa-clipboard-check mr-2"></i>
                Apply Now
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for this Property</DialogTitle>
                <DialogDescription>
                  Submit your application for {property.title}
                </DialogDescription>
              </DialogHeader>
              
              {applicationSubmitted ? (
                <div className="text-center py-6">
                  <div className="text-green-500 mb-3">
                    <i className="fas fa-check-circle text-4xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-[#0D1929] mb-2">Application Submitted!</h3>
                  <p className="text-gray-600 mb-4">
                    Your application has been successfully submitted. The landlord will review it and get back to you soon.
                  </p>
                  <Button 
                    variant="default" 
                    className="bg-[#2563EB]"
                    onClick={() => {
                      setShowApplyDialog(false);
                      navigate("/tenant-dashboard");
                    }}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="py-4">
                  <div className="mb-6">
                    <h4 className="font-medium text-[#0D1929] mb-2">Your Match Score</h4>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <ScoreRing 
                        score={matchReport?.matchScore || 0} 
                        size="md" 
                        className="mr-4" 
                      />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Based on your tenant credentials, you have a
                        </p>
                        <p className="font-semibold text-lg text-[#0D1929]">
                          {matchReport?.matchScore || 0}% match
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-[#0D1929] mb-2">Property Requirements</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <i className="fas fa-dollar-sign text-[#F59E0B] mr-2"></i>
                          <span className="text-[#0D1929]">Minimum Income</span>
                        </div>
                        <span className="font-medium">
                          ${property.minimumIncome?.toLocaleString() || 'Not specified'}/year
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <i className="fas fa-credit-card text-[#F59E0B] mr-2"></i>
                          <span className="text-[#0D1929]">Credit Score</span>
                        </div>
                        <span className="font-medium">
                          {property.minimumCreditScore || 'Not specified'}+
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <i className="fas fa-history text-[#F59E0B] mr-2"></i>
                          <span className="text-[#0D1929]">Rental History</span>
                        </div>
                        <span className="font-medium">
                          {property.requiredRentalHistory 
                            ? `${Math.round(property.requiredRentalHistory / 12)} years` 
                            : 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowApplyDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="default" 
                      className="bg-[#2563EB]"
                      onClick={handleApply}
                    >
                      Submit Application
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="bg-gray-200 rounded-xl overflow-hidden h-96 mb-4">
            <img 
              src={property.images[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 rounded-md overflow-hidden h-24">
                <img 
                  src={property.images[i] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} 
                  alt={`${property.title} - view ${i}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-[#0D1929]">${property.pricePerMonth}</div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-bed text-[#2563EB] mr-2"></i>
                    <span className="text-gray-600">Bedrooms</span>
                  </div>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-bath text-[#2563EB] mr-2"></i>
                    <span className="text-gray-600">Bathrooms</span>
                  </div>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-ruler-combined text-[#2563EB] mr-2"></i>
                    <span className="text-gray-600">Square Feet</span>
                  </div>
                  <span className="font-medium">{property.squareFeet}</span>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-building text-[#2563EB] mr-2"></i>
                    <span className="text-gray-600">Property Type</span>
                  </div>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt text-[#2563EB] mr-2"></i>
                    <span className="text-gray-600">Available From</span>
                  </div>
                  <span className="font-medium">
                    {new Date(property.availableFrom).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {matchReport && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-[#0D1929]">Match Score</h3>
                    <ScoreRing score={matchReport.matchScore} size="sm" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Your tenant profile is a {matchReport.matchScore}% match for this property.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        matchReport.matchScore >= 85 ? 'bg-green-500' : 
                        matchReport.matchScore >= 70 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${matchReport.matchScore}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Button className="w-full bg-[#2563EB]" onClick={() => setShowApplyDialog(true)}>
                  Apply Now
                </Button>
                <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                  Schedule Viewing
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {landlord && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#0D1929] mb-4">Listed By</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                    {landlord.profilePicture && (
                      <img 
                        src={landlord.profilePicture} 
                        alt={landlord.fullName} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-[#0D1929]">{landlord.fullName}</div>
                    <div className="text-sm text-gray-500">{landlord.email}</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 border-[#2563EB] text-[#2563EB]">
                  Contact Landlord
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>About this property</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p>{property.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Property Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      <span>{property.bedrooms} bedrooms, {property.bathrooms} bathrooms</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      <span>{property.squareFeet} square feet</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      <span>Available from {new Date(property.availableFrom).toLocaleDateString()}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      <span>{property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</span>
                    </li>
                    {property.featured && (
                      <li className="flex items-center">
                        <i className="fas fa-star text-yellow-500 mr-2"></i>
                        <span>Featured Property</span>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-3">Basic Information</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium">{property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Bedrooms</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Bathrooms</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Square Feet</span>
                      <span className="font-medium">{property.squareFeet}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Available From</span>
                      <span className="font-medium">{new Date(property.availableFrom).toLocaleDateString()}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-3">Financial Information</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Monthly Rent</span>
                      <span className="font-medium">${property.pricePerMonth}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-medium">${property.pricePerMonth}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Lease Term</span>
                      <span className="font-medium">12 months</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Utilities Included</span>
                      <span className="font-medium">No</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Pet Policy</span>
                      <span className="font-medium">Pets Allowed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Requirements</CardTitle>
              <CardDescription>
                Qualification criteria for this property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-3">Financial Requirements</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <i className="fas fa-dollar-sign text-[#F59E0B] mr-2"></i>
                        <h4 className="font-medium text-[#0D1929]">Minimum Income</h4>
                      </div>
                      <p className="text-gray-600">
                        ${property.minimumIncome?.toLocaleString() || 'Not specified'} per year
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        This is typically 3x the monthly rent
                      </p>
                      
                      {matchReport && (
                        <div className="mt-3 flex items-center">
                          <ScoreRing 
                            score={matchReport.matchAreas.income.score} 
                            size="sm" 
                            className="w-6 h-6 mr-2"
                          />
                          <span className={`text-sm font-medium ${
                            matchReport.matchAreas.income.score >= 85 ? 'text-green-600' : 
                            matchReport.matchAreas.income.score >= 70 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {matchReport.matchAreas.income.rating} match
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <i className="fas fa-credit-card text-[#F59E0B] mr-2"></i>
                        <h4 className="font-medium text-[#0D1929]">Credit Score</h4>
                      </div>
                      <p className="text-gray-600">
                        {property.minimumCreditScore || 'Not specified'}+ credit score required
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Higher credit scores may qualify for reduced security deposit
                      </p>
                      
                      {matchReport && (
                        <div className="mt-3 flex items-center">
                          <ScoreRing 
                            score={matchReport.matchAreas.creditScore.score} 
                            size="sm" 
                            className="w-6 h-6 mr-2"
                          />
                          <span className={`text-sm font-medium ${
                            matchReport.matchAreas.creditScore.score >= 85 ? 'text-green-600' : 
                            matchReport.matchAreas.creditScore.score >= 70 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {matchReport.matchAreas.creditScore.rating} match
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-3">History Requirements</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <i className="fas fa-history text-[#F59E0B] mr-2"></i>
                        <h4 className="font-medium text-[#0D1929]">Rental History</h4>
                      </div>
                      <p className="text-gray-600">
                        {property.requiredRentalHistory 
                          ? `${Math.round(property.requiredRentalHistory / 12)} years of rental history required` 
                          : 'No specific rental history requirement'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Clean rental record with no evictions
                      </p>
                      
                      {matchReport && (
                        <div className="mt-3 flex items-center">
                          <ScoreRing 
                            score={matchReport.matchAreas.rentalHistory.score} 
                            size="sm" 
                            className="w-6 h-6 mr-2"
                          />
                          <span className={`text-sm font-medium ${
                            matchReport.matchAreas.rentalHistory.score >= 85 ? 'text-green-600' : 
                            matchReport.matchAreas.rentalHistory.score >= 70 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {matchReport.matchAreas.rentalHistory.rating} match
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <i className="fas fa-briefcase text-[#F59E0B] mr-2"></i>
                        <h4 className="font-medium text-[#0D1929]">Employment</h4>
                      </div>
                      <p className="text-gray-600">
                        {property.requiredEmploymentStability 
                          ? `${Math.round(property.requiredEmploymentStability / 12)} years of stable employment` 
                          : 'No specific employment requirement'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Verifiable employment or income source
                      </p>
                      
                      {matchReport && (
                        <div className="mt-3 flex items-center">
                          <ScoreRing 
                            score={matchReport.matchAreas.employment.score} 
                            size="sm" 
                            className="w-6 h-6 mr-2"
                          />
                          <span className={`text-sm font-medium ${
                            matchReport.matchAreas.employment.score >= 85 ? 'text-green-600' : 
                            matchReport.matchAreas.employment.score >= 70 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {matchReport.matchAreas.employment.rating} match
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="bg-[#0D1929] bg-opacity-5 p-6 rounded-lg">
                  <h3 className="font-semibold text-[#0D1929] mb-3">Required Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      <span>Photo ID (driver's license or passport)</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      <span>Proof of income (pay stubs, tax returns)</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      <span>Employment verification letter</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      <span>Previous landlord references</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      <span>Bank statements (last 3 months)</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      <span>Credit report authorization</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="default" className="bg-[#2563EB]" onClick={() => setShowApplyDialog(true)}>
                      Apply with Estate Empire
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Submit just once and get pre-screened for all properties!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Location & Neighborhood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-map-marker-alt text-4xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">Map view of {property.address}, {property.city}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-3">Transportation</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-subway text-[#2563EB] mr-2 mt-1"></i>
                      <span>2 blocks to subway station</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-bus text-[#2563EB] mr-2 mt-1"></i>
                      <span>Bus stop on the corner</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-car text-[#2563EB] mr-2 mt-1"></i>
                      <span>Easy access to highways</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-3">Amenities</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-utensils text-[#2563EB] mr-2 mt-1"></i>
                      <span>Restaurants within walking distance</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-shopping-cart text-[#2563EB] mr-2 mt-1"></i>
                      <span>Supermarket nearby</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-tree text-[#2563EB] mr-2 mt-1"></i>
                      <span>Park within 5 minutes</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-3">Schools</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-school text-[#2563EB] mr-2 mt-1"></i>
                      <span>Elementary school: 0.5 miles</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-school text-[#2563EB] mr-2 mt-1"></i>
                      <span>Middle school: 1.2 miles</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-graduation-cap text-[#2563EB] mr-2 mt-1"></i>
                      <span>High school: 1.8 miles</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
