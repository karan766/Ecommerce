import Order from "../models/Order.Model.js";

export const fetchOrderByUser = async (req, res) => {
    const {userId} = req.params;
    try {
      const orders= await Order.find({user:userId});
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const createOrder = async (req, res) => {
    
      try {
        const order = await Order.create(req.body);
        const doc =await Order.findById(order._id).populate();
        res.status(201).json(doc);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
  }
  
  export const deleteOrder= async (req, res) => {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ message: "Orderdeleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const updateOrder= async (req, res) => {
  const { id } = req.params;
  try {
    const order= await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchAllOrders = async (req, res) => {
  
  try {
    const pageSize = parseInt(req.query._limit) || 12;
    const page = parseInt(req.query._page) || 1;
    let ordersQuery = Order.find();

    if (req.query._sort && req.query._order) {
      ordersQuery = ordersQuery.sort({
        [req.query._sort]: req.query._order,
      });
    }

    const totalDocs = await Order.countDocuments(
      ordersQuery.getQuery()
    );

    ordersQuery =   ordersQuery.skip(pageSize * (page - 1)).limit(pageSize);

    const products = await ordersQuery.exec();

    const totalPages = Math.ceil(totalDocs / pageSize);

    res.set("X-Total-Count", totalDocs);
    res.status(200).json({
      products,
      totalDocs,
      totalPages,
      currentPage: page,
      pageSize,
    }); 
  } catch (error) {
    console.error("Error fetching orderss:", error);
    res.status(500).json({
      message: "Internal server error, could not retrieve products",
      error: error.message,
    });
  }
};

