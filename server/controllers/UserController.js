
import User from "../models/UserModel.js";

export const fetchUserById = async (req, res) => {
    const {id} = req.user
   
  try {
    const user = await User.findById(id ,"name email role addresses");
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateUser = async (req, res) => {
    try {
      const user= await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };