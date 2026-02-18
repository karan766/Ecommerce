import dotenv from "dotenv";
import connectDB from "../utils/connectDB.js";
import { seedMakes } from "../utils/seedMakes.js";
import { seedProducts } from "../utils/seedProducts.js";

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");
    
    // Seed makes
    await seedMakes();
    
    // Seed products (includes brands and categories)
    await seedProducts();
    
    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();