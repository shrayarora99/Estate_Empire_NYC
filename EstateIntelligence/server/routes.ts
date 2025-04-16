import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertTenantProfileSchema, insertPropertySchema, insertDocumentSchema, insertPropertyViewSchema } from "@shared/schema";
import { calculatePropertyMatch } from "./ai/matching";
import { fetchRealPropertyData } from "./api/realty";
import { searchMlsListings } from "./api/mls";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for users
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // API routes for authentication (simplified for demo)
  app.post("/api/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // In a real implementation, you would use JWT or sessions
    // For demo purposes, we'll just return the user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // API routes for tenant profiles
  app.get("/api/tenant-profiles/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const profile = await storage.getTenantProfile(userId);
    if (!profile) {
      return res.status(404).json({ message: "Tenant profile not found" });
    }
    
    res.json(profile);
  });
  
  app.post("/api/tenant-profiles", async (req: Request, res: Response) => {
    try {
      const profileData = insertTenantProfileSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(profileData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if profile already exists
      const existingProfile = await storage.getTenantProfile(profileData.userId);
      if (existingProfile) {
        return res.status(400).json({ message: "Tenant profile already exists for this user" });
      }
      
      const newProfile = await storage.createTenantProfile(profileData);
      res.status(201).json(newProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tenant profile" });
    }
  });
  
  app.patch("/api/tenant-profiles/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const updatedProfile = await storage.updateTenantProfile(userId, req.body);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Tenant profile not found" });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update tenant profile" });
    }
  });
  
  // API routes for properties
  app.get("/api/properties", async (_req: Request, res: Response) => {
    const properties = await storage.getAllProperties();
    res.json(properties);
  });
  
  app.get("/api/properties/featured", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const featuredProperties = await storage.getFeaturedProperties(limit);
    res.json(featuredProperties);
  });
  
  app.get("/api/properties/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }
    
    const property = await storage.getProperty(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    res.json(property);
  });
  
  app.get("/api/properties/landlord/:landlordId", async (req: Request, res: Response) => {
    const landlordId = parseInt(req.params.landlordId);
    if (isNaN(landlordId)) {
      return res.status(400).json({ message: "Invalid landlord ID" });
    }
    
    const properties = await storage.getPropertiesByLandlord(landlordId);
    res.json(properties);
  });
  
  app.post("/api/properties", async (req: Request, res: Response) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      
      // Check if landlord exists
      const landlord = await storage.getUser(propertyData.landlordId);
      if (!landlord) {
        return res.status(404).json({ message: "Landlord not found" });
      }
      
      const newProperty = await storage.createProperty(propertyData);
      res.status(201).json(newProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create property" });
    }
  });
  
  app.patch("/api/properties/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }
    
    try {
      const updatedProperty = await storage.updateProperty(id, req.body);
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property" });
    }
  });
  
  app.delete("/api/properties/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }
    
    const success = await storage.deleteProperty(id);
    if (!success) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    res.status(204).send();
  });
  
  // API routes for documents
  app.get("/api/documents/user/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const documents = await storage.getDocumentsByUser(userId);
    res.json(documents);
  });
  
  app.post("/api/documents", async (req: Request, res: Response) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(documentData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const newDocument = await storage.createDocument(documentData);
      res.status(201).json(newDocument);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create document" });
    }
  });
  
  app.patch("/api/documents/:id/verify", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    
    try {
      const verifiedDocument = await storage.verifyDocument(id);
      if (!verifiedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(verifiedDocument);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify document" });
    }
  });
  
  // API routes for property views/applications
  app.get("/api/property-views/tenant/:tenantId", async (req: Request, res: Response) => {
    const tenantId = parseInt(req.params.tenantId);
    if (isNaN(tenantId)) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }
    
    const views = await storage.getPropertyViewsByTenant(tenantId);
    res.json(views);
  });
  
  app.get("/api/property-views/property/:propertyId", async (req: Request, res: Response) => {
    const propertyId = parseInt(req.params.propertyId);
    if (isNaN(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }
    
    const views = await storage.getPropertyViewsByProperty(propertyId);
    res.json(views);
  });
  
  app.post("/api/property-views", async (req: Request, res: Response) => {
    try {
      const viewData = insertPropertyViewSchema.parse(req.body);
      
      // Check if property exists
      const property = await storage.getProperty(viewData.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Check if tenant exists
      const tenant = await storage.getUser(viewData.tenantId);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      
      // If no match score provided, calculate it
      if (!viewData.matchScore) {
        const tenantProfile = await storage.getTenantProfile(viewData.tenantId);
        if (tenantProfile) {
          viewData.matchScore = await calculatePropertyMatch(tenantProfile, property);
        } else {
          viewData.matchScore = 0; // Default value if no profile exists
        }
      }
      
      const newView = await storage.createPropertyView(viewData);
      res.status(201).json(newView);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property view data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create property view" });
    }
  });
  
  app.patch("/api/property-views/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property view ID" });
    }
    
    try {
      const updatedView = await storage.updatePropertyView(id, req.body);
      if (!updatedView) {
        return res.status(404).json({ message: "Property view not found" });
      }
      
      res.json(updatedView);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property view" });
    }
  });

  // External API integration routes
  app.get("/api/realty/:city/:state", async (req: Request, res: Response) => {
    try {
      const { city, state } = req.params;
      const realtyData = await fetchRealPropertyData(city, state);
      res.json(realtyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property data from REALTYnyAPI" });
    }
  });
  
  app.get("/api/mls/search", async (req: Request, res: Response) => {
    try {
      const { city, state, minPrice, maxPrice, beds, baths } = req.query;
      const mlsData = await searchMlsListings({
        city: city as string,
        state: state as string,
        minPrice: minPrice ? parseInt(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
        beds: beds ? parseInt(beds as string) : undefined,
        baths: baths ? parseFloat(baths as string) : undefined
      });
      res.json(mlsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to search MLS listings" });
    }
  });
  
  // AI matching endpoint
  app.post("/api/match/tenant-properties", async (req: Request, res: Response) => {
    const { tenantId } = req.body;
    
    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }
    
    try {
      const tenantProfile = await storage.getTenantProfile(tenantId);
      if (!tenantProfile) {
        return res.status(404).json({ message: "Tenant profile not found" });
      }
      
      const allProperties = await storage.getAllProperties();
      
      // Calculate match score for each property
      const matches = await Promise.all(
        allProperties.map(async (property) => {
          const matchScore = await calculatePropertyMatch(tenantProfile, property);
          return {
            property,
            matchScore
          };
        })
      );
      
      // Sort by match score (highest first)
      matches.sort((a, b) => b.matchScore - a.matchScore);
      
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate property matches" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
