import Cart from "../models/CartModel.js";

export const fetchCartByUser = async (req, res) => {
    const {id} = req.user;
    try {
      const cartItems= await Cart.find({user:id}).populate('user').populate('product');
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const addToCart = async (req, res) => {
      try {
        const{id} = req.user;
        
          const cart= await Cart.create({...req.body,user:id});
        const doc =await cart.save();
       const result = await doc.populate('product');
        res.status(201).json(result);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
  }
  
  export const deleteFromCart = async (req, res) => {
    try {
      const cart = await Cart.findByIdAndDelete(req.params.id);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const updateCart= async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
   
    const result = await cart.populate('product');
   
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
