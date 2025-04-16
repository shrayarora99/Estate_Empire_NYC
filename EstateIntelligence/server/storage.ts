import { users, tenantProfiles, properties, documents, propertyViews, type User, type InsertUser, type TenantProfile, type InsertTenantProfile, type Property, type InsertProperty, type Document, type InsertDocument, type PropertyView, type InsertPropertyView } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tenant profile operations
  getTenantProfile(userId: number): Promise<TenantProfile | undefined>;
  createTenantProfile(profile: InsertTenantProfile): Promise<TenantProfile>;
  updateTenantProfile(userId: number, updates: Partial<TenantProfile>): Promise<TenantProfile | undefined>;
  
  // Property operations
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByLandlord(landlordId: number): Promise<Property[]>;
  getAllProperties(): Promise<Property[]>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  searchProperties(criteria: Partial<Property>): Promise<Property[]>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByUser(userId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  verifyDocument(id: number): Promise<Document | undefined>;
  
  // Property views/applications operations
  getPropertyView(id: number): Promise<PropertyView | undefined>;
  getPropertyViewsByTenant(tenantId: number): Promise<PropertyView[]>;
  getPropertyViewsByProperty(propertyId: number): Promise<PropertyView[]>;
  createPropertyView(propertyView: InsertPropertyView): Promise<PropertyView>;
  updatePropertyView(id: number, updates: Partial<PropertyView>): Promise<PropertyView | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tenantProfiles: Map<number, TenantProfile>;
  private properties: Map<number, Property>;
  private documents: Map<number, Document>;
  private propertyViews: Map<number, PropertyView>;
  
  private currentUserId: number;
  private currentTenantProfileId: number;
  private currentPropertyId: number;
  private currentDocumentId: number;
  private currentPropertyViewId: number;

  constructor() {
    this.users = new Map();
    this.tenantProfiles = new Map();
    this.properties = new Map();
    this.documents = new Map();
    this.propertyViews = new Map();
    
    this.currentUserId = 1;
    this.currentTenantProfileId = 1;
    this.currentPropertyId = 1;
    this.currentDocumentId = 1;
    this.currentPropertyViewId = 1;
    
    // Add some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const sampleUsers: InsertUser[] = [
      {
        username: "tenant1",
        password: "password123",
        email: "tenant1@example.com",
        fullName: "Michael Johnson",
        userType: "tenant",
        phone: "555-123-4567",
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      },
      {
        username: "landlord1",
        password: "password123",
        email: "landlord1@example.com",
        fullName: "Robert Williams",
        userType: "landlord",
        phone: "555-987-6543",
        profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
      }
    ];
    
    sampleUsers.forEach(user => this.createUser(user));
    
    // Create tenant profile for the tenant user
    this.createTenantProfile({
      userId: 1,
      incomeVerified: true,
      creditScoreVerified: true,
      rentalHistoryVerified: true,
      employmentVerified: true,
      incomeScore: 85,
      creditScore: 72,
      rentalHistoryScore: 91,
      employmentScore: 88,
      overallScore: 92,
      verificationBadge: true,
      verifiedAt: new Date()
    });
    
    // Create properties for the landlord user
    const sampleProperties: InsertProperty[] = [
      {
        landlordId: 2,
        title: "Luxury Apartment in Manhattan",
        description: "Beautiful apartment in the heart of Manhattan with modern amenities.",
        address: "123 E 72nd St",
        city: "New York",
        state: "NY",
        zipCode: "10021",
        pricePerMonth: 3200,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        propertyType: "apartment",
        availableFrom: new Date(),
        featured: true,
        images: ["https://images.unsplash.com/photo-1551361415-69c87624334f"],
        minimumIncome: 96000,
        minimumCreditScore: 700,
        requiredRentalHistory: 24,
        requiredEmploymentStability: 12
      },
      {
        landlordId: 2,
        title: "Brooklyn Heights Brownstone",
        description: "Classic brownstone with modern updates in prime Brooklyn Heights.",
        address: "45 Pierrepont St",
        city: "Brooklyn",
        state: "NY",
        zipCode: "11201",
        pricePerMonth: 4500,
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 1850,
        propertyType: "townhouse",
        availableFrom: new Date(),
        featured: true,
        images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858"],
        minimumIncome: 135000,
        minimumCreditScore: 720,
        requiredRentalHistory: 36,
        requiredEmploymentStability: 24
      },
      {
        landlordId: 2,
        title: "Tribeca Loft",
        description: "Spacious loft in the trendy Tribeca neighborhood.",
        address: "78 Franklin St",
        city: "New York",
        state: "NY",
        zipCode: "10013",
        pricePerMonth: 5800,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1750,
        propertyType: "loft",
        availableFrom: new Date(),
        featured: true,
        images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb"],
        minimumIncome: 174000,
        minimumCreditScore: 740,
        requiredRentalHistory: 24,
        requiredEmploymentStability: 24
      }
    ];
    
    sampleProperties.forEach(property => this.createProperty(property));
    
    // Create property views/applications
    this.createPropertyView({
      propertyId: 1,
      tenantId: 1,
      matchScore: 95,
      applicationStatus: "pending",
      viewingDate: new Date(),
      notes: "Very interested in this property"
    });
    
    this.createPropertyView({
      propertyId: 2,
      tenantId: 1,
      matchScore: 78,
      applicationStatus: "pending",
      viewingDate: new Date(),
      notes: "Good location but slightly above budget"
    });
    
    this.createPropertyView({
      propertyId: 3,
      tenantId: 1,
      matchScore: 88,
      applicationStatus: "pending",
      viewingDate: new Date(),
      notes: "Love the spacious layout"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Tenant profile operations
  async getTenantProfile(userId: number): Promise<TenantProfile | undefined> {
    return Array.from(this.tenantProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }
  
  async createTenantProfile(insertProfile: InsertTenantProfile): Promise<TenantProfile> {
    const id = this.currentTenantProfileId++;
    const now = new Date();
    const profile: TenantProfile = { ...insertProfile, id, updatedAt: now };
    this.tenantProfiles.set(id, profile);
    return profile;
  }
  
  async updateTenantProfile(userId: number, updates: Partial<TenantProfile>): Promise<TenantProfile | undefined> {
    const profile = await this.getTenantProfile(userId);
    if (!profile) return undefined;
    
    const updatedProfile: TenantProfile = { 
      ...profile, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    this.tenantProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }
  
  // Property operations
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }
  
  async getPropertiesByLandlord(landlordId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.landlordId === landlordId
    );
  }
  
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }
  
  async getFeaturedProperties(limit?: number): Promise<Property[]> {
    const featured = Array.from(this.properties.values()).filter(
      (property) => property.featured
    );
    
    if (limit && limit > 0) {
      return featured.slice(0, limit);
    }
    
    return featured;
  }
  
  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const now = new Date();
    const property: Property = { 
      ...insertProperty, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    
    this.properties.set(id, property);
    return property;
  }
  
  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    const property = await this.getProperty(id);
    if (!property) return undefined;
    
    const updatedProperty: Property = { 
      ...property, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }
  
  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }
  
  async searchProperties(criteria: Partial<Property>): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(property => {
      for (const [key, value] of Object.entries(criteria)) {
        if (property[key as keyof Property] !== value) {
          return false;
        }
      }
      return true;
    });
  }
  
  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async getDocumentsByUser(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.userId === userId
    );
  }
  
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const now = new Date();
    const document: Document = { 
      ...insertDocument, 
      id, 
      verified: false, 
      uploadedAt: now 
    };
    
    this.documents.set(id, document);
    return document;
  }
  
  async verifyDocument(id: number): Promise<Document | undefined> {
    const document = await this.getDocument(id);
    if (!document) return undefined;
    
    const verifiedDocument: Document = { 
      ...document, 
      verified: true, 
      verifiedAt: new Date() 
    };
    
    this.documents.set(id, verifiedDocument);
    return verifiedDocument;
  }
  
  // Property views/applications operations
  async getPropertyView(id: number): Promise<PropertyView | undefined> {
    return this.propertyViews.get(id);
  }
  
  async getPropertyViewsByTenant(tenantId: number): Promise<PropertyView[]> {
    return Array.from(this.propertyViews.values()).filter(
      (view) => view.tenantId === tenantId
    );
  }
  
  async getPropertyViewsByProperty(propertyId: number): Promise<PropertyView[]> {
    return Array.from(this.propertyViews.values()).filter(
      (view) => view.propertyId === propertyId
    );
  }
  
  async createPropertyView(insertPropertyView: InsertPropertyView): Promise<PropertyView> {
    const id = this.currentPropertyViewId++;
    const now = new Date();
    const propertyView: PropertyView = { 
      ...insertPropertyView, 
      id, 
      createdAt: now 
    };
    
    this.propertyViews.set(id, propertyView);
    return propertyView;
  }
  
  async updatePropertyView(id: number, updates: Partial<PropertyView>): Promise<PropertyView | undefined> {
    const propertyView = await this.getPropertyView(id);
    if (!propertyView) return undefined;
    
    const updatedPropertyView: PropertyView = { 
      ...propertyView, 
      ...updates 
    };
    
    this.propertyViews.set(id, updatedPropertyView);
    return updatedPropertyView;
  }
}

export const storage = new MemStorage();
