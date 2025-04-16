import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { Document, User } from "@shared/schema";

// Document type options
const documentTypes = [
  { value: "income_proof", label: "Proof of Income" },
  { value: "credit_report", label: "Credit Report" },
  { value: "rental_history", label: "Rental History" },
  { value: "employment_proof", label: "Employment Verification" },
  { value: "id_verification", label: "ID Verification" },
  { value: "bank_statements", label: "Bank Statements" },
  { value: "references", label: "References" }
];

export default function DocumentUpload() {
  const { toast } = useToast();
  
  // Form state
  const [uploadForm, setUploadForm] = useState({
    documentType: "",
    fileName: "",
    fileUrl: ""
  });
  
  // File selection state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Upload progress (simulated)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Get user data (in a real app, this would be from auth)
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
  
  // Get user documents
  const { 
    data: documents, 
    isLoading: isDocumentsLoading,
    refetch: refetchDocuments 
  } = useQuery({
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
  
  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async (documentData: typeof uploadForm & { userId: number }) => {
      return await apiRequest('POST', '/api/documents', documentData);
    },
    onSuccess: () => {
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully and is pending verification.",
      });
      
      // Reset form
      setUploadForm({
        documentType: "",
        fileName: "",
        fileUrl: ""
      });
      setSelectedFile(null);
      
      // Refetch documents
      refetchDocuments();
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: `There was an error uploading your document: ${error}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle form changes
  const handleFormChange = (name: string, value: string) => {
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      handleFormChange("fileName", file.name);
    }
  };
  
  // Handle document upload
  const handleUpload = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload documents.",
        variant: "destructive",
      });
      return;
    }
    
    if (!uploadForm.documentType) {
      toast({
        title: "Missing Information",
        description: "Please select a document type.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedFile) {
      toast({
        title: "Missing File",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate file upload with progress
    setIsUploading(true);
    setUploadProgress(0);
    
    // In a real app, this would be an actual file upload to a storage service
    // For this demo, we'll simulate the upload
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Complete upload
          const fileUrl = `https://estatempire.com/documents/${Date.now()}_${uploadForm.fileName}`;
          
          // Create document in database
          uploadMutation.mutate({
            ...uploadForm,
            fileUrl,
            userId: user.id
          });
        }
      }, 300);
    };
    
    simulateUpload();
  };
  
  // Get document type label
  const getDocumentTypeLabel = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : type;
  };
  
  const isLoading = isUserLoading || isDocumentsLoading;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1929]">Document Upload</h1>
          <p className="text-gray-600">Upload verification documents to improve your tenant credentials</p>
        </div>
        
        <Link href="/tenant-dashboard">
          <Button variant="outline" className="border-[#2563EB] text-[#2563EB]">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Document</CardTitle>
              <CardDescription>
                Upload documents to verify your tenant credentials and improve your matching score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select
                    value={uploadForm.documentType}
                    onValueChange={(value) => handleFormChange("documentType", value)}
                  >
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Select Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fileUpload">Document File</Label>
                  <div className="mt-1">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, JPG, PNG, or DOCX (MAX. 10MB)
                          </p>
                        </div>
                        <input 
                          id="fileUpload" 
                          type="file" 
                          className="hidden" 
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <i className="fas fa-file-alt text-[#2563EB] text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-[#0D1929]">{selectedFile.name}</h4>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedFile(null);
                          handleFormChange("fileName", "");
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-[#2563EB] h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#2563EB]"
                onClick={handleUpload}
                disabled={isUploading || !selectedFile || !uploadForm.documentType}
              >
                {isUploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt mr-2"></i>
                    Upload Document
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Uploaded Documents</CardTitle>
              <CardDescription>
                View and manage your verification documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB] mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading documents...</p>
                  </div>
                </div>
              ) : documents && documents.length > 0 ? (
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
                            {getDocumentTypeLabel(doc.documentType)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {doc.verified ? (
                          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center mr-3">
                            <i className="fas fa-check-circle mr-1"></i>
                            <span>Verified</span>
                          </div>
                        ) : (
                          <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center mr-3">
                            <i className="fas fa-clock mr-1"></i>
                            <span>Pending</span>
                          </div>
                        )}
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#2563EB] hover:text-blue-700 mr-2"
                        >
                          <i className="fas fa-eye"></i>
                        </a>
                        <button className="text-gray-400 hover:text-red-500">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-gray-400 mb-3">
                    <i className="fas fa-file-upload text-4xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Documents Uploaded</h3>
                  <p className="text-gray-500 mb-4">
                    Upload your first document to start the verification process
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>
                Documents needed for tenant verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#2563EB] bg-opacity-10 rounded-full flex items-center justify-center text-[#2563EB] mr-3 mt-1">
                    <i className="fas fa-file-invoice-dollar"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0D1929] mb-1">Proof of Income</h4>
                    <p className="text-sm text-gray-500">Pay stubs, W-2 forms, or tax returns showing income verification.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#2563EB] bg-opacity-10 rounded-full flex items-center justify-center text-[#2563EB] mr-3 mt-1">
                    <i className="fas fa-id-card"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0D1929] mb-1">ID Verification</h4>
                    <p className="text-sm text-gray-500">Driver's license, passport, or other government-issued photo ID.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#2563EB] bg-opacity-10 rounded-full flex items-center justify-center text-[#2563EB] mr-3 mt-1">
                    <i className="fas fa-credit-score"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0D1929] mb-1">Credit Report Authorization</h4>
                    <p className="text-sm text-gray-500">Permission form for credit score verification and history check.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#2563EB] bg-opacity-10 rounded-full flex items-center justify-center text-[#2563EB] mr-3 mt-1">
                    <i className="fas fa-history"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0D1929] mb-1">Rental History</h4>
                    <p className="text-sm text-gray-500">Previous lease agreements or landlord references to verify rental history.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-[#0D1929] bg-opacity-5 rounded-lg">
                <h4 className="font-medium text-[#0D1929] mb-2">Verification Process</h4>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Upload all required documents through this portal</li>
                  <li>Our verification team will review your documents (typically 1-2 business days)</li>
                  <li>Once verified, you'll receive the Estate Empire Verification Badge</li>
                  <li>Your credential score will be updated based on the verified information</li>
                </ol>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Document Security</CardTitle>
              <CardDescription>
                How we protect your information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#2563EB] bg-opacity-10 rounded-full flex items-center justify-center text-[#2563EB] mr-3 mt-1">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0D1929] mb-1">Encrypted Storage</h4>
                    <p className="text-sm text-gray-500">All documents are stored using bank-level encryption to protect your data.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#2563EB] bg-opacity-10 rounded-full flex items-center justify-center text-[#2563EB] mr-3 mt-1">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0D1929] mb-1">Limited Access</h4>
                    <p className="text-sm text-gray-500">Only verified landlords with whom you apply can access your documents.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#2563EB] bg-opacity-10 rounded-full flex items-center justify-center text-[#2563EB] mr-3 mt-1">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0D1929] mb-1">Data Retention</h4>
                    <p className="text-sm text-gray-500">You control how long your documents are stored in our system.</p>
                  </div>
                </div>
              </div>
              
              <a href="/privacy-policy" className="text-[#2563EB] text-sm flex items-center mt-4">
                <span>Read our full privacy policy</span>
                <i className="fas fa-arrow-right ml-1"></i>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
