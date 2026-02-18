import dotenv from "dotenv";
import connectDB from "../utils/connectDB.js";
import Product from "../models/ProductModel.js";
import Brand from "../models/BrandModel.js";
import Category from "../models/CategoryModel.js";
import Make from "../models/MakeModel.js";

// Load environment variables
dotenv.config();

const checkDatabase = async () => {
  try {
    console.log("🔍 Checking database contents...");
    
    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");
    
    // Check makes
    const makes = await Make.find({});
    console.log(`📋 Makes found: ${makes.length}`);
    makes.forEach(make => console.log(`  - ${make.label} (${make.value})`));
    
    // Check brands
    const brands = await Brand.find({});
    console.log(`🏷️ Brands found: ${brands.length}`);
    brands.forEach(brand => console.log(`  - ${brand.label} (${brand.value})`));
    
    // Check categories
    const categories = await Category.find({});
    console.log(`📂 Categories found: ${categories.length}`);
    categories.forEach(category => console.log(`  - ${category.label} (${category.value})`));
    
    // Check products
    const products = await Product.find({});
    console.log(`📦 Products found: ${products.length}`);
    products.forEach(product => console.log(`  - ${product.title} ($${product.price})`));
    
    if (products.length === 0) {
      console.log("❌ No products found in database");
    } else {
      console.log("✅ Products are in the database");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking database:", error);
    process.exit(1);
  }
};

checkDatabase();