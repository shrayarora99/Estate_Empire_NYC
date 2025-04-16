import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Property, PropertyView, User } from "@shared/schema";
import ScoreRing from "@/components/ui/ScoreRing";

export default function LandlordDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch user data (in a real app, this would come from authentication)
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/users/2'],
    queryFn: async () => {
      const response = await fetch('/api/users/2');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json() as Promise<User>;
    }
  });

  // Fetch properties
  const { data: properties, isLoading: isPropertiesLoading } = useQuery({
    queryKey: ['/api/properties/landlord/2'],
    queryFn: async () => {
      const response = await fetch('/api/properties/landlord/2');
      if (!response.ok) {
        throw new Error('Failed to fetch landlord properties');
      }
      return response.json() as Promise<Property[]>;
    },
    enabled: !!user
  });

  // In a real app, this would be fetched from the API
  // Here we're generating a dashboard summary for the sample data
  const generateDashboardSummary = () => {
    if (!properties) return {
      totalProperties: 0,
      totalViews: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      occupancyRate: 0,
      averageRent: 0
    };

    const totalProperties = properties.length;
    const totalViews = Math.floor(Math.random() * 50) + 20; // Random for demo
    const pendingApplications = Math.floor(Math.random() * 10) + 5; // Random for demo
    const approvedApplications = Math.floor(Math.random() * 5); // Random for demo
    const occupancyRate = Math.floor(Math.random() * 30) + 70; // Random for demo
    const rents = properties.map(p => p.pricePerMonth);
    const averageRent = rents.reduce((sum, rent) => sum + rent, 0) / rents.length;

    return {
      totalProperties,
      totalViews,
      pendingApplications,
      approvedApplications,
      occupancyRate,
      averageRent
    };
  };

  const dashboardSummary = generateDashboardSummary();

  // Generate chart data for demo purposes
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      views: Math.floor(Math.random() * 30) + 10,
      applications: Math.floor(Math.random() * 15) + 5
    }));
  };

  const chartData = generateChartData();

  // Generate sample tenant applicants for demo
  const generateApplicants = () => {
    if (!properties || properties.length === 0) return [];

    const applicants = [];
    const names = ["Sarah Johnson", "Michael Williams", "Emma Davis", "Robert Miller", "Olivia Wilson"];
    
    for (let i = 0; i < 5; i++) {
      const property = properties[Math.floor(Math.random() * properties.length)];
      const matchScore = Math.floor(Math.random() * 30) + 70; // 70-99
      
      applicants.push({
        id: i + 1,
        name: names[i],
        propertyId: property.id,
        propertyTitle: property.title,
        matchScore,
        status: i < 3 ? "pending" : i === 3 ? "approved" : "rejected",
        appliedDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
      });
    }
    
    return applicants;
  };

  const applicants = generateApplicants();

  const isLoading = isUserLoading || isPropertiesLoading;

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
          <h1 className="text-3xl font-bold text-[#0D1929]">Landlord Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.fullName}</p>
        </div>
        
        <div className="flex space-x-4">
          <Link href="/properties/new">
            <Button className="bg-[#2563EB]">
              <i className="fas fa-plus mr-2"></i>
              Add New Property
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">My Properties</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="mr-4 w-12 h-12 bg-[#2563EB] bg-opacity-20 rounded-full flex items-center justify-center text-[#2563EB]">
                    <i className="fas fa-building text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0D1929]">{dashboardSummary.totalProperties}</h3>
                    <p className="text-gray-500 text-sm">Total Properties</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="mr-4 w-12 h-12 bg-[#F59E0B] bg-opacity-20 rounded-full flex items-center justify-center text-[#F59E0B]">
                    <i className="fas fa-eye text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0D1929]">{dashboardSummary.totalViews}</h3>
                    <p className="text-gray-500 text-sm">Total Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="mr-4 w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center text-green-500">
                    <i className="fas fa-file-alt text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0D1929]">{dashboardSummary.pendingApplications}</h3>
                    <p className="text-gray-500 text-sm">Pending Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="mr-4 w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center text-purple-500">
                    <i className="fas fa-percentage text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0D1929]">{dashboardSummary.occupancyRate}%</h3>
                    <p className="text-gray-500 text-sm">Occupancy Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Property views and applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" name="Views" fill="#3B82F6" />
                      <Bar dataKey="applications" name="Applications" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Applicants</CardTitle>
                <CardDescription>Latest tenant applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicants.slice(0, 3).map(applicant => (
                    <div key={applicant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                        <div>
                          <h4 className="font-medium text-[#0D1929]">{applicant.name}</h4>
                          <p className="text-sm text-gray-500">{applicant.propertyTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <ScoreRing score={applicant.matchScore} size="sm" className="w-8 h-8 mr-2" />
                        <div className={`
                          text-xs font-medium px-2.5 py-0.5 rounded-full
                          ${applicant.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            applicant.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}
                        `}>
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Link href="/applications">
                    <Button variant="outline" className="w-full text-[#2563EB] border-[#2563EB]">
                      View All Applications
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-xl font-bold text-[#0D1929] mb-4">My Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties && properties.length > 0 ? (
              properties.slice(0, 3).map(property => (
                <Card key={property.id}>
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
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-[#0D1929] mb-1">{property.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      <span>{property.address}, {property.city}</span>
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
                    
                    <Link href={`/property/${property.id}`}>
                      <Button variant="default" className="w-full bg-[#2563EB]">
                        Manage Property
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-3">
                  <i className="fas fa-building text-4xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No properties listed yet</h3>
                <p className="text-gray-500 mb-4">Add your first property to get started</p>
                <Link href="/properties/new">
                  <Button variant="default" className="bg-[#2563EB]">
                    Add Property
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="properties">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#0D1929]">My Properties</h2>
            <Link href="/properties/new">
              <Button variant="default" className="bg-[#2563EB]">
                <i className="fas fa-plus mr-2"></i>
                Add New Property
              </Button>
            </Link>
          </div>
          
          {properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <Card key={property.id}>
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
                    {property.featured && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-[#F59E0B] bg-opacity-90 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-[#0D1929] mb-1">{property.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      <span>{property.address}, {property.city}</span>
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
                    
                    <div className="flex space-x-3">
                      <Link href={`/property/${property.id}`} className="flex-1">
                        <Button variant="default" className="w-full bg-[#2563EB]">
                          Manage
                        </Button>
                      </Link>
                      <Link href={`/property/${property.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-3">
                <i className="fas fa-building text-4xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No properties listed yet</h3>
              <p className="text-gray-500 mb-4">Add your first property to get started</p>
              <Link href="/properties/new">
                <Button variant="default" className="bg-[#2563EB]">
                  Add Property
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Applications</CardTitle>
              <CardDescription>Review and manage tenant applications for your properties</CardDescription>
            </CardHeader>
            <CardContent>
              {applicants && applicants.length > 0 ? (
                <div className="space-y-4">
                  {applicants.map(applicant => {
                    const property = properties?.find(p => p.id === applicant.propertyId);
                    if (!property) return null;
                    
                    return (
                      <div key={applicant.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                          <div>
                            <h4 className="font-medium text-[#0D1929]">{applicant.name}</h4>
                            <p className="text-sm text-gray-500">
                              Applied for: {property.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {applicant.appliedDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                          <div className="flex items-center mr-4">
                            <ScoreRing 
                              score={applicant.matchScore} 
                              size="sm" 
                              className="w-8 h-8 mr-2"
                            />
                            <span className="text-sm font-medium">
                              {applicant.matchScore}% Match
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            {applicant.status === 'pending' ? (
                              <>
                                <Button 
                                  variant="default" 
                                  className="bg-green-600 hover:bg-green-700 text-xs h-8 px-3"
                                  onClick={() => toast({
                                    title: "Application Approved",
                                    description: `You've approved ${applicant.name}'s application for ${property.title}`,
                                  })}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  variant="default" 
                                  className="bg-red-600 hover:bg-red-700 text-xs h-8 px-3"
                                  onClick={() => toast({
                                    title: "Application Rejected",
                                    description: `You've rejected ${applicant.name}'s application for ${property.title}`,
                                    variant: "destructive"
                                  })}
                                >
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <div className={`
                                text-xs font-medium px-2.5 py-1 rounded-full
                                ${applicant.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                  'bg-red-100 text-red-800'}
                              `}>
                                {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-3">
                    <i className="fas fa-user-friends text-4xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No applications yet</h3>
                  <p className="text-gray-500 mb-4">Your application requests will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Views</CardTitle>
                <CardDescription>View trends over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" name="Views" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>Application trends over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="applications" name="Applications" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Property Performance</CardTitle>
                <CardDescription>View and application metrics by property</CardDescription>
              </CardHeader>
              <CardContent>
                {properties && properties.length > 0 ? (
                  <div className="space-y-6">
                    {properties.map(property => {
                      // Generate random metrics for demo
                      const views = Math.floor(Math.random() * 50) + 10;
                      const applications = Math.floor(Math.random() * 10) + 1;
                      const conversionRate = Math.round((applications / views) * 100);
                      
                      return (
                        <div key={property.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-[#0D1929]">{property.title}</h4>
                            <span className="text-sm text-gray-500">${property.pricePerMonth}/mo</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Views</div>
                              <div className="text-lg font-semibold text-[#0D1929]">{views}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Applications</div>
                              <div className="text-lg font-semibold text-[#0D1929]">{applications}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Conversion Rate</div>
                              <div className="text-lg font-semibold text-[#0D1929]">{conversionRate}%</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No property data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
