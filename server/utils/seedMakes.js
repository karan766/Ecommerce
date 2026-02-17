import Make from "../models/MakeModel.js";

const defaultMakes = [
  { label: "Standard", value: "standard" },
  { label: "Premium", value: "premium" },
  { label: "Deluxe", value: "deluxe" },
  { label: "Professional", value: "professional" },
  { label: "Basic", value: "basic" },
  { label: "Advanced", value: "advanced" },
  { label: "Custom", value: "custom" },
];

export const seedMakes = async () => {
  try {
    const existingMakes = await Make.find({});
    
    if (existingMakes.length === 0) {
      await Make.insertMany(defaultMakes);
      console.log("Default makes seeded successfully");
    } else {
      console.log("Makes already exist, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding makes:", error);
  }
};