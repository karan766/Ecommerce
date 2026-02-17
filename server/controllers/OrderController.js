import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";
import { invoiceTemplate, sendEMail } from "./MailController.js";
import User from "../models/UserModel.js";

export const fetchOrderByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = (await Order.find({ user: userId })).reverse();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createOrder = async (req, res) => {
  try {
    for (let product = 0; product < req.body.items.length; product++) {
      await Product.findByIdAndUpdate(
        req.body.items[product].product.id,
        {
          $inc: { stock: -req.body.items[product].quantity },
        },
        {
          new: true,
        }
      );
    }
    const order = await Order.create(req.body);
    const doc = await Order.findById(order._id).populate();
    const user = await User.findById(order.user)
       // we can use await for this also 
       sendEMail({to:user.email,html:invoiceTemplate(order),subject:'Order Received' })
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
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

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchAllOrders = async (req, res) => {
  const queryString = req.params;
  const parts = queryString.id.split("&");
  let filter = [];
  try {
    for (let part of parts) {
      const [key, value] = part.split("=");
      filter.push({ [key]: value });
    }

    if (filter[0]["_sort"] === "id") {
      filter[0]["_sort"] = "_id";
    }

    const pageSize = parseInt(filter[3]["_per_page"]) || 12;
    const page = parseInt(filter[2]["_page"]) || 1;

    if (filter[1]["_order"] === "asc") {
      filter[1]["_order"] = 1;
    } else {
      filter[1]["_order"] = -1;
    }

    let totalOrderQuery = Order.find().sort({
      [filter[0]["_sort"]]: filter[1]["_order"],
    });

    const totalOrders = await Order.countDocuments(totalOrderQuery.getQuery());

    totalOrderQuery = totalOrderQuery
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const products = await totalOrderQuery.exec();

    const totalPages = Math.ceil(totalOrders / pageSize);

    res.set("X-Total-Count", totalOrders);
    res.status(200).json({
      products,
      totalOrders,
      totalPages,
      currentPage: page,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Internal server error, could not retrieve products",
      error: error.message,
    });
  }
};
