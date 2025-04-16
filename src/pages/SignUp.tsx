import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import EstateEmpireLogo from "@/components/ui/icons/EstateEmpireLogo";

const signupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  userType: z.string({
    required_error: "Please select an account type"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignUp() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Initialize form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      confirmPassword: "",
      userType: "tenant"
    }
  });
  
  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      // Register user
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
          fullName: data.fullName,
          userType: data.userType,
          phone: data.phone
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      toast({
        title: "Account Created",
        description: "Your Estate Empire account has been created successfully!",
      });
      
      // Create tenant profile if user type is tenant
      if (data.userType === "tenant") {
        // In a real app, this would create an empty tenant profile
        // that would later be populated with credential data
      }
      
      // Redirect based on user type
      if (data.userType === 'tenant') {
        navigate('/tenant-dashboard');
      } else {
        navigate('/landlord-dashboard');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const nextStep = () => {
    const fields = ['fullName', 'email', 'phone', 'userType'];
    const isValid = fields.every(field => form.getFieldState(field as keyof SignupFormValues).isDirty);
    
    if (isValid) {
      setStep(2);
    } else {
      form.trigger(['fullName', 'email', 'phone', 'userType']);
    }
  };
  
  const prevStep = () => {
    setStep(1);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Column - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 relative">
                <EstateEmpireLogo />
              </div>
            </div>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>Join Estate Empire and start your real estate journey</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tenant">Tenant / Renter</SelectItem>
                              <SelectItem value="landlord">Landlord / Property Owner</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="button" 
                      className="w-full bg-[#2563EB]"
                      onClick={nextStep}
                    >
                      Continue
                    </Button>
                  </>
                )}
                
                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-5 h-5 bg-[#2563EB] bg-opacity-10 rounded-full flex items-center justify-center text-[#2563EB]">
                        <i className="fas fa-info-circle"></i>
                      </div>
                      <p className="text-gray-500">
                        Password must be at least 8 characters with uppercase letters and numbers.
                      </p>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="flex-1"
                        onClick={prevStep}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-[#2563EB]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Creating...
                          </>
                        ) : "Create Account"}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <i className="fab fa-google mr-2"></i>
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <i className="fab fa-apple mr-2"></i>
                  Apple
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login">
                <a className="text-[#2563EB] font-medium hover:underline">
                  Log in
                </a>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right Column - Features & Benefits */}
      <div className="hidden lg:block lg:w-1/2 bg-[#0D1929] relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Benefits of Joining Estate Empire
          </h2>
          
          <div className="space-y-6 max-w-md">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center mr-4 mt-1">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Faster Leasing Process</h3>
                <p className="text-gray-300">Cut down apartment viewing delays and accelerate the speed-to-lease for both renters and landlords.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center mr-4 mt-1">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure Document Handling</h3>
                <p className="text-gray-300">Submit documents once and securely. No more sending sensitive information repeatedly for each inquiry.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center mr-4 mt-1">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
                <p className="text-gray-300">Our smart algorithms match tenants with properties based on qualification criteria, saving time for everyone.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center mr-4 mt-1">
                <i className="fas fa-check-circle"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Verified Tenant Badge</h3>
                <p className="text-gray-300">Stand out with our verification system that gives landlords confidence in your application.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
