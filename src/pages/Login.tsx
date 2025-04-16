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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import EstateEmpireLogo from "@/components/ui/icons/EstateEmpireLogo";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional()
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false
    }
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password
        })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const user = await response.json();
      
      toast({
        title: "Login Successful",
        description: "Welcome back to Estate Empire!",
      });
      
      // Redirect based on user type
      if (user.userType === 'tenant') {
        navigate('/tenant-dashboard');
      } else {
        navigate('/landlord-dashboard');
      }
      
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 relative">
                <EstateEmpireLogo />
              </div>
            </div>
            <CardTitle className="text-2xl">Login to Estate Empire</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
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
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <Link href="/forgot-password">
                    <a className="text-sm text-[#2563EB] hover:underline">
                      Forgot password?
                    </a>
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#2563EB]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Logging in...
                    </>
                  ) : "Login"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
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
              Don't have an account?{" "}
              <Link href="/signup">
                <a className="text-[#2563EB] font-medium hover:underline">
                  Sign up
                </a>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right Column - Background Image */}
      <div className="hidden lg:block lg:w-1/2 bg-[#0D1929] relative">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <h2 className="text-3xl font-bold mb-4 text-center">Stop Chasing, Start Closing!</h2>
          <p className="text-lg text-center mb-8">
            Join Estate Empire and experience the future of renting. Our AI-powered platform makes finding your perfect match faster and easier than ever.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-2xl mb-2">
                <i className="fas fa-file-invoice"></i>
              </div>
              <h3 className="font-bold mb-1">Submit Once</h3>
              <p className="text-sm">Upload documents and get pre-screened for all properties</p>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-2xl mb-2">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3 className="font-bold mb-1">Get Matched</h3>
              <p className="text-sm">AI matches you with properties that fit your credentials</p>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-2xl mb-2">
                <i className="fas fa-key"></i>
              </div>
              <h3 className="font-bold mb-1">Tour & Apply</h3>
              <p className="text-sm">Schedule viewings for properties you're pre-qualified for</p>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="text-2xl mb-2">
                <i className="fas fa-home"></i>
              </div>
              <h3 className="font-bold mb-1">Move In</h3>
              <p className="text-sm">Close deals faster with our streamlined process</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
