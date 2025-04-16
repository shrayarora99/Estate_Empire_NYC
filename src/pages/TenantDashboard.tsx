import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ScoreRing from "@/components/ui/ScoreRing";
import CredentialReport from "@/components/ui/CredentialReport";
import PropertyCard from "@/components/ui/PropertyCard";
import { TenantProfile, Document, PropertyView, Property, User } from "@shared/schema";
import { calculatePropertyMatchScore } from "@/lib/propertyMatch";

export default function TenantDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch user data (in a real app, this would come from authentication)
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/users/1'],
    queryFn: async () => {
      const response = await fetch('/api/users/1');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json() as Promise<User>;
    }
  });

  // Fetch tenant profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['/api/tenant-profiles/1'],
    queryFn: async () => {
      const response = await fetch('/api/tenant-profiles/1');
      if (!response.ok) {
        throw new Error('Failed to fetch tenant profile');
      }
      return response.json() as Promise<TenantProfile>;
    },
    enabled: !!user
  });

  // Fetch documents
  const { data: documents, isLoading: isDocumentsLoading } = useQuery({
    queryKey: ['/api/documents/user/1'],
    queryFn: async () => {
      const response = await fetch('/api/documents/user/1');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      return response.json() as Promise<Document[]>;
    },
    enabled: !!user
  });

  // Fetch property views/applications
  const { data: propertyViews, isLoading: isPropertyViewsLoading } = useQuery({
    queryKey: ['/api/property-views/tenant/1'],
    queryFn: async () => {
      const response = await fetch('/api/property-views/tenant/1');
      if (!response.ok) {
        throw new Error('Failed to fetch property views');
      }
      return response.json() as Promise<PropertyView[]>;
    },
    enabled: !!user
  });

  // Fetch properties for matching
  const { data: properties, isLoading: isPropertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json() as Promise<Property[]>;
    }
  });

  // Calculate property matches
  const [matchedProperties, setMatchedProperties] = useState<{ property: Property; matchScore: number; }[]>([]);

  useEffect(() => {
    if (profile && properties) {
      const matches = properties.map(property => ({
        property,
        matchScore: calculatePropertyMatchScore(profile, property)
      }));
      
      // Sort by match score (highest first)
      matches.sort((a, b) => b.matchScore - a.matchScore);
      
      // Take top 3 matches
      setMatchedProperties(matches.slice(0, 3));
    }
  }, [profile, properties]);

  // Get document status summary
  const getDocumentStatusSummary = () => {
    if (!documents) return { total: 0, verified: 0 };
    
    const total = documents.length;
    const verified = documents.filter(doc => doc.verified).length;
    
    return { total, verified };
  };

  const { total: totalDocs, verified: verifiedDocs } = getDocumentStatusSummary();

  const isLoading = isUserLoading || isProfileLoading || isDocumentsLoading || isPropertyViewsLoading || isPropertiesLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1929]">Tenant Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.fullName}</p>
        </div>
        
        <div className="flex space-x-4">
          <Link href="/documents">
            <Button variant="outline" className="border-[#2563EB] text-[#2563EB]">
              <i className="fas fa-file-upload mr-2"></i>
              Upload Documents
            </Button>
          </Link>
          <Link href="/properties">
            <Button className="bg-[#2563EB]">
              <i className="fas fa-search mr-2"></i>
              Find Properties
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credentials">My Credentials</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="matches">Property Matches</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="mr-4">
                    <ScoreRing score={profile?.overallScore || 0} size="lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0D1929]">Credential Score</h3>
                    <p className="text-gray-500 text-sm">Overall tenant rating</p>
                    {profile?.verificationBadge && (
                      <div className="mt-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center">
                        <i className="fas fa-check-circle mr-1"></i>
                        <span>Verified Tenant</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="mr-4 w-12 h-12 bg-[#F59E0B] bg-opacity-20 rounded-full flex items-center justify-center text-[#F59E0B]">
                    <i className="fas fa-file-alt text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0D1929]">Documents</h3>
                    <p className="text-gray-500 text-sm">{verifiedDocs} of {totalDocs} verified</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: `${totalDocs ? (verifiedDocs / totalDocs) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="mr-4 w-12 h-12 bg-[#2563EB] bg-opacity-20 rounded-full flex items-center justify-center text-[#2563EB]">
                    <i className="fas fa-building text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0D1929]">Property Applications</h3>
                    <p className="text-gray-500 text-sm">{propertyViews?.length || 0} active applications</p>
                    <Link href="/properties">
                      <a className="mt-1 text-[#2563EB] text-sm hover:underline">
                        Find more properties
                      </a>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-xl font-bold text-[#0D1929] mb-4">Top Property Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {matchedProperties.length > 0 ? (
              matchedProperties.map(({ property, matchScore }) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  matchScore={matchScore}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-3">
                  <i className="fas fa-home text-4xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No property matches yet</h3>
                <p className="text-gray-500 mb-4">Complete your profile to get matched with properties</p>
                <Link href="/profile">
                  <Button variant="default" className="bg-[#2563EB]">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="credentials">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Credential Breakdown</CardTitle>
                  <CardDescription>Details of your tenant credential factors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-coins text-[#F59E0B] mr-2"></i>
                          <h5 className="font-medium text-[#0D1929]">Income</h5>
                        </div>
                        <ScoreRing score={profile?.incomeScore || 0} size="sm" />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${profile?.incomeScore || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-credit-card text-[#F59E0B] mr-2"></i>
                          <h5 className="font-medium text-[#0D1929]">Credit Score</h5>
                        </div>
                        <ScoreRing score={profile?.creditScore || 0} size="sm" />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${profile?.creditScore || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-history text-[#F59E0B] mr-2"></i>
                          <h5 className="font-medium text-[#0D1929]">Rental History</h5>
                        </div>
                        <ScoreRing score={profile?.rentalHistoryScore || 0} size="sm" />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${profile?.rentalHistoryScore || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-briefcase text-[#F59E0B] mr-2"></i>
                          <h5 className="font-medium text-[#0D1929]">Employment</h5>
                        </div>
                        <ScoreRing score={profile?.employmentScore || 0} size="sm" />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${profile?.employmentScore || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link href="/profile">
                      <Button variant="default" className="w-full bg-[#2563EB]">
                        Update Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              {profile && user && (
                <CredentialReport 
                  profile={profile} 
                  user={{
                    fullName: user.fullName,
                    profilePicture: user.profilePicture
                  }}
                  detailedInfo={{
                    income: 95000,
                    creditScore: 722,
                    rentalHistory: 5,
                    rentToIncomeRatio: 22,
                    paymentHistory: "Good",
                    previousEvictions: 0
                  }}
                />
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Upload and manage your verification documents</CardDescription>
            </CardHeader>
            <CardContent>
              {documents && documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#2563EB] bg-opacity-10 rounded-full flex items-center justify-center text-[#2563EB] mr-4">
                          <i className="fas fa-file-alt"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-[#0D1929]">{doc.fileName}</h4>
                          <p className="text-sm text-gray-500">
                            {doc.documentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {doc.verified ? (
                          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                            <i className="fas fa-check-circle mr-1"></i>
                            <span>Verified</span>
                          </div>
                        ) : (
                          <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                            <i className="fas fa-clock mr-1"></i>
                            <span>Pending</span>
                          </div>
                        )}
                        <button className="ml-4 text-gray-400 hover:text-[#0D1929]">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-3">
                    <i className="fas fa-file-upload text-4xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No documents uploaded yet</h3>
                  <p className="text-gray-500 mb-4">Upload documents to complete your verification</p>
                  <Link href="/documents">
                    <Button variant="default" className="bg-[#2563EB]">
                      Upload Documents
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Track your property applications and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {propertyViews && propertyViews.length > 0 ? (
                <div className="space-y-4">
                  {propertyViews.map(view => {
                    const property = properties?.find(p => p.id === view.propertyId);
                    if (!property) return null;
                    
                    return (
                      <div key={view.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 overflow-hidden">
                            <img 
                              src={property.images[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} 
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-[#0D1929]">{property.title}</h4>
                            <p className="text-sm text-gray-500">
                              {property.address}, {property.city}, {property.state}
                            </p>
                            <div className="flex items-center mt-1">
                              <ScoreRing 
                                score={view.matchScore} 
                                size="sm" 
                                className="w-5 h-5 mr-1"
                                showLabel={false}
                              />
                              <span className="text-xs font-medium">
                                {view.matchScore}% Match
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col md:items-end">
                          <div className={`
                            text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center mb-2
                            ${view.applicationStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                              view.applicationStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}
                          `}>
                            <i className={`
                              mr-1 fas 
                              ${view.applicationStatus === 'approved' ? 'fa-check-circle' : 
                                view.applicationStatus === 'rejected' ? 'fa-times-circle' : 
                                'fa-clock'}
                            `}></i>
                            <span>
                              {view.applicationStatus.charAt(0).toUpperCase() + view.applicationStatus.slice(1)}
                            </span>
                          </div>
                          <Link href={`/property/${property.id}`}>
                            <Button variant="outline" className="text-[#2563EB] border-[#2563EB]">
                              View Property
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-3">
                    <i className="fas fa-clipboard-list text-4xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No applications yet</h3>
                  <p className="text-gray-500 mb-4">Browse properties and apply to get started</p>
                  <Link href="/properties">
                    <Button variant="default" className="bg-[#2563EB]">
                      Browse Properties
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="matches">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0D1929]">Your Property Matches</h2>
              <Link href="/properties">
                <Button variant="outline" className="border-[#2563EB] text-[#2563EB]">
                  View All Properties
                </Button>
              </Link>
            </div>
            
            {matchedProperties && matchedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedProperties.map(({ property, matchScore }) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    matchScore={matchScore}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-3">
                  <i className="fas fa-home text-4xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No property matches yet</h3>
                <p className="text-gray-500 mb-4">Complete your profile to get matched with properties</p>
                <Link href="/profile">
                  <Button variant="default" className="bg-[#2563EB]">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
