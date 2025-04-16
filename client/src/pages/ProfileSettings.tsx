import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScoreRing from "@/components/ui/ScoreRing";
import { Label } from "@/components/ui/label";
import { User, TenantProfile } from "@shared/schema";
import { calculateIncomeScore, calculateCreditScoreRating, calculateRentalHistoryScore, calculateEmploymentScore, calculateOverallScore } from "@/lib/scoring";

export default function ProfileSettings() {
  const { toast } = useToast();
  
  // In a real app, this would be fetched based on the authenticated user
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
  
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form states
  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    profilePicture: ""
  });
  
  const [tenantDetailsForm, setTenantDetailsForm] = useState({
    annualIncome: 0,
    creditScore: 0,
    yearsOfRentalHistory: 0,
    previousEvictions: 0,
    latePayments: 0,
    yearsAtCurrentJob: 0,
    monthsUnemployed: 0
  });
  
  // Update form values when data is loaded
  useState(() => {
    if (user) {
      setUserForm({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || "",
        profilePicture: user.profilePicture || ""
      });
    }
  });
  
  // Calculate credential scores based on tenant details
  const calculateCredentialScores = () => {
    const incomeScore = calculateIncomeScore(tenantDetailsForm.annualIncome, 3000); // Assuming $3000 as average rent
    const creditScore = calculateCreditScoreRating(tenantDetailsForm.creditScore);
    const rentalHistoryScore = calculateRentalHistoryScore(
      tenantDetailsForm.yearsOfRentalHistory, 
      tenantDetailsForm.previousEvictions, 
      tenantDetailsForm.latePayments
    );
    const employmentScore = calculateEmploymentScore(
      tenantDetailsForm.yearsAtCurrentJob, 
      tenantDetailsForm.monthsUnemployed
    );
    
    const overallScore = calculateOverallScore(
      incomeScore,
      creditScore,
      rentalHistoryScore,
      employmentScore
    );
    
    return {
      incomeScore,
      creditScore,
      rentalHistoryScore,
      employmentScore,
      overallScore
    };
  };
  
  // Handle user form changes
  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle tenant details form changes
  const handleTenantDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTenantDetailsForm(prev => ({
      ...prev,
      [name]: name === 'previousEvictions' || name === 'latePayments' || name === 'monthsUnemployed' 
        ? parseInt(value) 
        : parseFloat(value)
    }));
  };
  
  // Save user profile
  const saveUserProfile = async () => {
    try {
      // In a real app, this would be an API call to update the user profile
      toast({
        title: "Profile Updated",
        description: "Your personal information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Save tenant details and recalculate scores
  const saveTenantDetails = async () => {
    try {
      const scores = calculateCredentialScores();
      
      // In a real app, this would be an API call to update the tenant profile
      toast({
        title: "Tenant Details Updated",
        description: "Your financial information has been updated and credentials recalculated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your tenant details. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const isLoading = isUserLoading || isProfileLoading;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1929]">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and tenant credentials</p>
        </div>
        
        {profile && (
          <div className="bg-[#0D1929] p-4 rounded-lg text-white flex items-center">
            <div className="mr-4">
              <p className="text-sm">Credential Score</p>
              <ScoreRing score={profile.overallScore || 0} size="md" className="mt-1" />
            </div>
            {profile.verificationBadge && (
              <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                <i className="fas fa-badge-check mr-1"></i>
                <span>Verified Tenant</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Personal Information</TabsTrigger>
          <TabsTrigger value="credentials">Tenant Credentials</TabsTrigger>
          <TabsTrigger value="documents">Verification Documents</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        value={userForm.fullName} 
                        onChange={handleUserFormChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={userForm.email} 
                        onChange={handleUserFormChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={userForm.phone} 
                        onChange={handleUserFormChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="profilePicture">Profile Picture URL</Label>
                      <Input 
                        id="profilePicture" 
                        name="profilePicture" 
                        value={userForm.profilePicture} 
                        onChange={handleUserFormChange} 
                        placeholder="https://example.com/profile.jpg" 
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-[#2563EB] mt-4"
                      onClick={saveUserProfile}
                    >
                      Save Personal Information
                    </Button>
                  </div>
                </div>
                
                <div>
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-[#0D1929] mb-4">Preview</h3>
                    <div className="flex items-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mr-4">
                        {userForm.profilePicture ? (
                          <img 
                            src={userForm.profilePicture} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <i className="fas fa-user text-2xl"></i>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-[#0D1929]">{userForm.fullName}</h4>
                        <p className="text-gray-500">{userForm.email}</p>
                        <p className="text-gray-500">{userForm.phone}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <p>Your profile information will be visible to landlords when you apply for properties.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="credentials">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Credentials</CardTitle>
              <CardDescription>Update your financial information to improve your credential score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-4">Financial Details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="annualIncome">Annual Income ($)</Label>
                      <Input 
                        id="annualIncome" 
                        name="annualIncome" 
                        type="number" 
                        value={tenantDetailsForm.annualIncome || ''} 
                        onChange={handleTenantDetailsChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="creditScore">Credit Score</Label>
                      <Input 
                        id="creditScore" 
                        name="creditScore" 
                        type="number" 
                        min="300" 
                        max="850" 
                        value={tenantDetailsForm.creditScore || ''} 
                        onChange={handleTenantDetailsChange} 
                      />
                    </div>
                    
                    <h3 className="font-semibold text-[#0D1929] mt-6 mb-4">Rental History</h3>
                    
                    <div>
                      <Label htmlFor="yearsOfRentalHistory">Years of Rental History</Label>
                      <Input 
                        id="yearsOfRentalHistory" 
                        name="yearsOfRentalHistory" 
                        type="number" 
                        step="0.5" 
                        min="0" 
                        value={tenantDetailsForm.yearsOfRentalHistory || ''} 
                        onChange={handleTenantDetailsChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="previousEvictions">Number of Previous Evictions</Label>
                      <Input 
                        id="previousEvictions" 
                        name="previousEvictions" 
                        type="number" 
                        min="0" 
                        value={tenantDetailsForm.previousEvictions || ''} 
                        onChange={handleTenantDetailsChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="latePayments">Number of Late Payments (Last 2 Years)</Label>
                      <Input 
                        id="latePayments" 
                        name="latePayments" 
                        type="number" 
                        min="0" 
                        value={tenantDetailsForm.latePayments || ''} 
                        onChange={handleTenantDetailsChange} 
                      />
                    </div>
                    
                    <h3 className="font-semibold text-[#0D1929] mt-6 mb-4">Employment</h3>
                    
                    <div>
                      <Label htmlFor="yearsAtCurrentJob">Years at Current Job</Label>
                      <Input 
                        id="yearsAtCurrentJob" 
                        name="yearsAtCurrentJob" 
                        type="number" 
                        step="0.5" 
                        min="0" 
                        value={tenantDetailsForm.yearsAtCurrentJob || ''} 
                        onChange={handleTenantDetailsChange} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="monthsUnemployed">Months Unemployed (Last 3 Years)</Label>
                      <Input 
                        id="monthsUnemployed" 
                        name="monthsUnemployed" 
                        type="number" 
                        min="0" 
                        value={tenantDetailsForm.monthsUnemployed || ''} 
                        onChange={handleTenantDetailsChange} 
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-[#2563EB] mt-4"
                      onClick={saveTenantDetails}
                    >
                      Save & Calculate Score
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-4">Credential Score Breakdown</h3>
                  
                  {profile && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-medium text-[#0D1929]">Overall Score</h4>
                        <ScoreRing score={profile.overallScore || 0} size="lg" />
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <i className="fas fa-coins text-[#F59E0B] mr-2"></i>
                              <h5 className="font-medium text-[#0D1929]">Income</h5>
                            </div>
                            <ScoreRing score={profile.incomeScore || 0} size="sm" className="w-8 h-8" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${profile.incomeScore || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <i className="fas fa-credit-card text-[#F59E0B] mr-2"></i>
                              <h5 className="font-medium text-[#0D1929]">Credit Score</h5>
                            </div>
                            <ScoreRing score={profile.creditScore || 0} size="sm" className="w-8 h-8" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full" 
                              style={{ width: `${profile.creditScore || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <i className="fas fa-history text-[#F59E0B] mr-2"></i>
                              <h5 className="font-medium text-[#0D1929]">Rental History</h5>
                            </div>
                            <ScoreRing score={profile.rentalHistoryScore || 0} size="sm" className="w-8 h-8" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${profile.rentalHistoryScore || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <i className="fas fa-briefcase text-[#F59E0B] mr-2"></i>
                              <h5 className="font-medium text-[#0D1929]">Employment</h5>
                            </div>
                            <ScoreRing score={profile.employmentScore || 0} size="sm" className="w-8 h-8" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${profile.employmentScore || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-sm text-gray-500">
                        <p>Your tenant credential score is calculated based on your financial information and rental history. A higher score increases your chances of being approved for properties.</p>
                      </div>
                      
                      {profile.verificationBadge && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-500 mr-3">
                            <i className="fas fa-check"></i>
                          </div>
                          <div>
                            <h5 className="font-medium text-green-800">Verified Tenant</h5>
                            <p className="text-xs text-green-600">All your documents have been verified</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Verification Documents</CardTitle>
              <CardDescription>Upload and manage documents to verify your tenant credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-4">Required Documents</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-file-invoice-dollar text-[#2563EB] mr-2"></i>
                          <h5 className="font-medium text-[#0D1929]">Proof of Income</h5>
                        </div>
                        <div className="text-yellow-600 text-sm font-medium">Pending</div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Recent pay stubs, W-2, or tax returns</p>
                      <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                        <i className="fas fa-upload mr-2"></i>
                        Upload
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-id-card text-[#2563EB] mr-2"></i>
                          <h5 className="font-medium text-[#0D1929]">ID Verification</h5>
                        </div>
                        <div className="text-green-600 text-sm font-medium">Verified</div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Driver's license, passport, or state ID</p>
                      <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                        <i className="fas fa-check-circle mr-2"></i>
                        View Document
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-credit-score text-[#2563EB] mr-2"></i>
                          <h5 className="font-medium text-[#0D1929]">Credit Report Authorization</h5>
                        </div>
                        <div className="text-yellow-600 text-sm font-medium">Pending</div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Authorization form for credit check</p>
                      <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                        <i className="fas fa-upload mr-2"></i>
                        Upload
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-building text-[#2563EB] mr-2"></i>
                          <h5 className="font-medium text-[#0D1929]">Rental History</h5>
                        </div>
                        <div className="text-green-600 text-sm font-medium">Verified</div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Previous landlord references or rental agreements</p>
                      <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                        <i className="fas fa-check-circle mr-2"></i>
                        View Document
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-4">Additional Documents</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-briefcase text-[#2563EB] mr-2"></i>
                          <h5 className="font-medium text-[#0D1929]">Employment Verification</h5>
                        </div>
                        <div className="text-yellow-600 text-sm font-medium">Optional</div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Letter from employer confirming employment</p>
                      <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                        <i className="fas fa-upload mr-2"></i>
                        Upload
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-university text-[#2563EB] mr-2"></i>
                          <h5 className="font-medium text-[#0D1929]">Bank Statements</h5>
                        </div>
                        <div className="text-yellow-600 text-sm font-medium">Optional</div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Last 3 months of bank statements</p>
                      <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                        <i className="fas fa-upload mr-2"></i>
                        Upload
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <i className="fas fa-user-graduate text-[#2563EB] mr-2"></i>
                          <h5 className="font-medium text-[#0D1929]">Student Status</h5>
                        </div>
                        <div className="text-yellow-600 text-sm font-medium">Optional</div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Proof of enrollment (for students)</p>
                      <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                        <i className="fas fa-upload mr-2"></i>
                        Upload
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-[#0D1929] bg-opacity-5 rounded-lg">
                    <h4 className="font-medium text-[#0D1929] mb-2">Get Verified</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload and verify all required documents to receive the Estate Empire Verification Badge. 
                      Verified tenants get priority access to exclusive listings and expedited application processing.
                    </p>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-[#2563EB] h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500">Verification Progress: 2/4 documents verified</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-4">Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    
                    <Button 
                      className="w-full bg-[#2563EB] mt-2"
                      onClick={() => {
                        toast({
                          title: "Password Updated",
                          description: "Your password has been changed successfully.",
                        });
                      }}
                    >
                      Update Password
                    </Button>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-semibold text-[#0D1929] mb-4">Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <input 
                          type="checkbox" 
                          id="emailNotifications" 
                          className="toggle toggle-primary" 
                          defaultChecked 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <input 
                          type="checkbox" 
                          id="smsNotifications" 
                          className="toggle toggle-primary" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="marketingEmails">Marketing Emails</Label>
                        <input 
                          type="checkbox" 
                          id="marketingEmails" 
                          className="toggle toggle-primary" 
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-[#2563EB] mt-4"
                      onClick={() => {
                        toast({
                          title: "Notification Preferences Updated",
                          description: "Your notification settings have been saved.",
                        });
                      }}
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#0D1929] mb-4">Account Management</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-[#0D1929] mb-2">Account Type</h4>
                      <p className="text-gray-600 mb-3">
                        {user?.userType === 'tenant' ? 'Tenant Account' : 'Landlord Account'}
                      </p>
                      <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                        Switch Account Type
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-[#0D1929] mb-2">Data Privacy</h4>
                      <p className="text-gray-600 mb-3">
                        Manage how your data is used and shared on Estate Empire
                      </p>
                      <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                        Privacy Settings
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-[#0D1929] mb-2">Download Your Data</h4>
                      <p className="text-gray-600 mb-3">
                        Get a copy of all your personal data stored in our system
                      </p>
                      <Button variant="outline" className="w-full border-[#2563EB] text-[#2563EB]">
                        Request Data Export
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
                      <p className="text-red-600 mb-3 text-sm">
                        Permanently delete your account and all associated data
                      </p>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
