import Product from "../models/ProductModel.js";

export const createProduct = async (req, res) => {
  try {

    const product = await Product.create(req.body);
   
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ message: error.message });

  }
};

export const fetchAllProducts = async (req, res) => {
  try {
    const pageSize = parseInt(req.query._limit) || 12;
    const page = parseInt(req.query._page) || 1;
    let condition ={}
    if (!req.query.admin) {
       condition.deleted={$ne:true}
    }
    let productsQuery = Product.find(condition);

    if (req.query.category) {
      // If the category query parameter is passed, handle multiple categories
      const categories = req.query.category.split(','); // Assuming categories are passed as a comma-separated list
      productsQuery = productsQuery.where("category").in(categories);
  }
  
    if (req.query.brand) {
      // If the brand query parameter is passed, handle multiple brands
      const brands = req.query.brand.split(','); // Assuming brands are passed as a comma-separated list
      productsQuery = productsQuery.where("brand").in(brands);
  }
  
    if (req.query.make) {
      // If the make query parameter is passed, handle multiple makes
      const makes = req.query.make.split(','); // Assuming makes are passed as a comma-separated list
      productsQuery = productsQuery.where("make").in(makes);
  }
  

    if (req.query._sort && req.query._order) {
      productsQuery = productsQuery.sort({
        [req.query._sort]: req.query._order,
      });
    }

    const totalProducts = await Product.countDocuments(
      productsQuery.getQuery()
    );

    productsQuery = productsQuery.skip(pageSize * (page - 1)).limit(pageSize);

    const products = await productsQuery.exec();

    const totalPages = Math.ceil(totalProducts / pageSize);

    res.set("X-Total-Count", totalProducts);
    res.status(200).json({
      products,
      totalProducts,
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

export const fetchProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
