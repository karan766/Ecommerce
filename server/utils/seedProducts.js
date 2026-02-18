import Product from "../models/ProductModel.js";
import Brand from "../models/BrandModel.js";
import Category from "../models/CategoryModel.js";
import Make from "../models/MakeModel.js";

const defaultBrands = [
  { label: "Apple", value: "apple" },
  { label: "Samsung", value: "samsung" },
  { label: "Sony", value: "sony" },
  { label: "Nike", value: "nike" },
  { label: "Adidas", value: "adidas" },
];

const defaultCategories = [
  { label: "Electronics", value: "electronics" },
  { label: "Smartphones", value: "smartphones" },
  { label: "Laptops", value: "laptops" },
  { label: "Clothing", value: "clothing" },
  { label: "Shoes", value: "shoes" },
];

const testProducts = [
  {
    title: "iPhone 15 Pro",
    description: "The latest iPhone with advanced camera system, A17 Pro chip, and titanium design. Features a 6.1-inch Super Retina XDR display with ProMotion technology.",
    price: 999,
    discountPercentage: 5,
    rating: 4.8,
    stock: 50,
    brand: "apple",
    category: "smartphones",
    make: "premium",
    highlights: [
      "A17 Pro chip with 6-core GPU",
      "Pro camera system with 48MP main camera",
      "Titanium design with textured matte glass back",
      "USB-C connector",
      "Up to 23 hours video playback"
    ],
    thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=800&fit=crop"
    ],
    colors: [
      { name: "Natural Titanium", value: "#8D7B68" },
      { name: "Blue Titanium", value: "#5F8A8B" },
      { name: "White Titanium", value: "#F5F5DC" },
      { name: "Black Titanium", value: "#36454F" }
    ],
    sizes: [
      { name: "128GB", value: "128gb" },
      { name: "256GB", value: "256gb" },
      { name: "512GB", value: "512gb" },
      { name: "1TB", value: "1tb" }
    ]
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen, advanced AI features, and professional-grade camera system. Features a 6.8-inch Dynamic AMOLED 2X display.",
    price: 1199,
    discountPercentage: 10,
    rating: 4.7,
    stock: 35,
    brand: "samsung",
    category: "smartphones",
    make: "premium",
    highlights: [
      "Snapdragon 8 Gen 3 processor",
      "200MP main camera with AI zoom",
      "Built-in S Pen with Air Actions",
      "6.8-inch Dynamic AMOLED 2X display",
      "5000mAh battery with fast charging"
    ],
    thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&h=800&fit=crop"
    ],
    colors: [
      { name: "Titanium Gray", value: "#708090" },
      { name: "Titanium Black", value: "#2F2F2F" },
      { name: "Titanium Violet", value: "#8A2BE2" },
      { name: "Titanium Yellow", value: "#FFD700" }
    ],
    sizes: [
      { name: "256GB", value: "256gb" },
      { name: "512GB", value: "512gb" },
      { name: "1TB", value: "1tb" }
    ]
  },
  {
    title: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones with exceptional sound quality, 30-hour battery life, and premium comfort for all-day listening.",
    price: 399,
    discountPercentage: 15,
    rating: 4.6,
    stock: 75,
    brand: "sony",
    category: "electronics",
    make: "professional",
    highlights: [
      "Industry-leading noise canceling",
      "30-hour battery life",
      "Premium sound quality with LDAC",
      "Lightweight and comfortable design",
      "Quick charge: 3 min = 3 hours playback"
    ],
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop"
    ],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Silver", value: "#C0C0C0" }
    ],
    sizes: [
      { name: "Standard", value: "standard" }
    ]
  },
  {
    title: "Nike Air Max 270",
    description: "Lifestyle sneakers featuring Nike's largest heel Air unit for maximum comfort and style. Perfect for everyday wear with breathable mesh upper.",
    price: 150,
    discountPercentage: 20,
    rating: 4.4,
    stock: 120,
    brand: "nike",
    category: "shoes",
    make: "standard",
    highlights: [
      "Largest heel Air unit for maximum comfort",
      "Breathable mesh upper",
      "Rubber outsole with waffle pattern",
      "Lightweight and durable",
      "Available in multiple colorways"
    ],
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop"
    ],
    colors: [
      { name: "White/Black", value: "#FFFFFF" },
      { name: "Black/Red", value: "#000000" },
      { name: "Blue/White", value: "#0066CC" },
      { name: "Gray/Orange", value: "#808080" }
    ],
    sizes: [
      { name: "US 7", value: "us7" },
      { name: "US 8", value: "us8" },
      { name: "US 9", value: "us9" },
      { name: "US 10", value: "us10" },
      { name: "US 11", value: "us11" },
      { name: "US 12", value: "us12" }
    ]
  },
  {
    title: "MacBook Pro 14-inch M3",
    description: "Powerful laptop with M3 chip, Liquid Retina XDR display, and all-day battery life. Perfect for professionals and creative work with advanced performance.",
    price: 1599,
    discountPercentage: 8,
    rating: 4.9,
    stock: 25,
    brand: "apple",
    category: "laptops",
    make: "professional",
    highlights: [
      "M3 chip with 8-core CPU and 10-core GPU",
      "14.2-inch Liquid Retina XDR display",
      "Up to 22 hours battery life",
      "16GB unified memory",
      "Three Thunderbolt 4 ports"
    ],
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop"
    ],
    colors: [
      { name: "Space Gray", value: "#5C5C5C" },
      { name: "Silver", value: "#E8E8E8" }
    ],
    sizes: [
      { name: "512GB SSD", value: "512gb" },
      { name: "1TB SSD", value: "1tb" },
      { name: "2TB SSD", value: "2tb" }
    ]
  }
];

export const seedProducts = async () => {
  try {
    // Seed brands first
    const existingBrands = await Brand.find({});
    if (existingBrands.length === 0) {
      await Brand.insertMany(defaultBrands);
      console.log("Default brands seeded successfully");
    }

    // Seed categories
    const existingCategories = await Category.find({});
    if (existingCategories.length === 0) {
      await Category.insertMany(defaultCategories);
      console.log("Default categories seeded successfully");
    }

    // Seed products
    const existingProducts = await Product.find({});
    if (existingProducts.length === 0) {
      await Product.insertMany(testProducts);
      console.log("Test products seeded successfully");
      console.log(`Added ${testProducts.length} products to the database`);
    } else {
      console.log("Products already exist, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};