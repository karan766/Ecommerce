import Make from "../models/MakeModel.js";

export const fetchMakes = async (req, res) => {
  try {
    const makes = await Make.find({}).exec();
    res.status(200).json(makes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createMake = async (req, res) => {
  try {
    const make = new Make(req.body);
    const savedMake = await make.save();
    res.status(201).json(savedMake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};