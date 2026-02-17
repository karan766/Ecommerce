import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedProduct,
  createProductAsync,
  fetchProductByIdAsync,
  selectBrands,
  selectCategories,
  selectMakes,
  selectProductById,
  updateProductAsync,
  fetchMakesAsync,
  fetchBrandsAsync,
  fetchCategoriesAsync,
  createMakeAsync,
  createBrandAsync,
  createCategoryAsync,
} from "../../product/productSlice";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../common/Modal";
import { ToastContainer, toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/outline";

<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
/>;

function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const makes = useSelector(selectMakes);
  const dispatch = useDispatch();
  const params = useParams();
  const selectedProduct = useSelector(selectProductById);
  const [openModal, setOpenModal] = useState(null);

  const [newColor, setNewColor] = useState("#000000");
  const [colors, setColors] = useState([]);
  const [newMake, setNewMake] = useState("");
  const [showMakeInput, setShowMakeInput] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [showBrandInput, setShowBrandInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const sizes = [
    { name: "XXS", inStock: true, id: "xxs" },
    { name: "XS", inStock: true, id: "xs" },
    { name: "S", inStock: true, id: "s" },
    { name: "M", inStock: true, id: "m" },
    { name: "L", inStock: true, id: "l" },
    { name: "XL", inStock: true, id: "xl" },
    { name: "2XL", inStock: true, id: "2xl" },
    { name: "3XL", inStock: true, id: "3xl" },
  ];

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
    // Fetch all data when component mounts
    dispatch(fetchMakesAsync());
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoriesAsync());
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue("title", selectedProduct.title);
      setValue("description", selectedProduct.description);
      setValue("price", selectedProduct.price);
      setValue("discountPercentage", selectedProduct.discountPercentage);
      setValue("thumbnail", selectedProduct.thumbnail);
      setValue("stock", selectedProduct.stock);
      setValue("image1", selectedProduct.images[0]);
      setValue("image2", selectedProduct.images[1]);
      setValue("image3", selectedProduct.images[2]);
      setValue("brand", selectedProduct.brand);
      setValue("category", selectedProduct.category);
      setSelectedBrand(selectedProduct.brand);
      setSelectedCategory(selectedProduct.category);
      setValue("make", selectedProduct.make);
      setValue("highlight1", selectedProduct.highlights[0]);
      setValue("highlight2", selectedProduct.highlights[1]);
      setValue("highlight3", selectedProduct.highlights[2]);
      setValue("highlight4", selectedProduct.highlights[3]);
      setValue(
        "sizes",
        selectedProduct.sizes.map((size) => size.id)
      );

      setColors([...selectedProduct.colors]);
    }
  }, [selectedProduct, params.id, setValue]);

  const handleColor = () => {
    if (!colors.includes(newColor)) {
      setColors((prevColors) => [...prevColors, newColor]);
    } else {
      toast.error("Color already added");
    }
  };

  const handleRemoveColor = (color) => {
    setColors((prevColors) => prevColors.filter((c) => c !== color));
    toast.success("Color removed");
  };

  const handleAddMake = async () => {
    if (
      newMake.trim() &&
      !makes.find((make) => make.value === newMake.trim())
    ) {
      try {
        const makeData = {
          label: newMake.trim(),
          value: newMake.trim().toLowerCase().replace(/\s+/g, "-"),
        };
        dispatch(createMakeAsync(makeData));
        setValue("make", makeData.value);
        setNewMake("");
        setShowMakeInput(false);
        toast.success("Make added successfully");
      } catch (error) {
        toast.error("Failed to add make");
      }
    } else if (makes.find((make) => make.value === newMake.trim())) {
      toast.error("Make already exists");
    }
  };

  const handleAddBrand = async () => {
    if (
      newBrand.trim() &&
      !brands.find((brand) => brand.value === newBrand.trim())
    ) {
      try {
        const brandData = {
          label: newBrand.trim(),
          value: newBrand.trim().toLowerCase().replace(/\s+/g, "-"),
        };
        dispatch(createBrandAsync(brandData));
        setValue("brand", brandData.value);
        setSelectedBrand(brandData.value);
        setNewBrand("");
        setShowBrandInput(false);
        toast.success("Brand added successfully");
      } catch (error) {
        toast.error("Failed to add brand");
      }
    } else if (brands.find((brand) => brand.value === newBrand.trim())) {
      toast.error("Brand already exists");
    }
  };

  const handleAddCategory = async () => {
    if (
      newCategory.trim() &&
      !categories.find((category) => category.value === newCategory.trim())
    ) {
      try {
        const categoryData = {
          label: newCategory.trim(),
          value: newCategory.trim().toLowerCase().replace(/\s+/g, "-"),
        };
        dispatch(createCategoryAsync(categoryData));
        setValue("category", categoryData.value);
        setSelectedCategory(categoryData.value);
        setNewCategory("");
        setShowCategoryInput(false);
        toast.success("Category added successfully");
      } catch (error) {
        toast.error("Failed to add category");
      }
    } else if (
      categories.find((category) => category.value === newCategory.trim())
    ) {
      toast.error("Category already exists");
    }
  };

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setValue("brand", brand);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setValue("category", category);
  };

  const handleDelete = () => {
    const product = { ...selectedProduct };
    product.deleted = true;
    dispatch(updateProductAsync(product));
    toast.success("Product deleted");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50">
      <form
        noValidate
        onSubmit={handleSubmit((data) => {
          const product = { ...data };
          product.images = [
            product.image1,
            product.image2,
            product.image3,
            product.thumbnail,
          ];
          product.colors = colors;
          product.highlights = [
            product.highlight1,
            product.highlight2,
            product.highlight3,
            product.highlight4,
          ];
          product.rating = 0;

          if (product.sizes) {
            product.sizes = product.sizes.map(
              (size) => sizes.find((sz) => sz.id === size) || size
            );
          }

          delete product["image1"];
          delete product["image2"];
          delete product["image3"];
          product.price = +product.price;
          product.stock = +product.stock;
          product.discountPercentage = +product.discountPercentage;

          if (params.id) {
            product.id = params.id;
            product.rating = selectedProduct.rating || 0;
            dispatch(updateProductAsync(product));
            reset();
          } else {
            dispatch(createProductAsync(product));
            reset();
          }
        })}
      >
        <div className="space-y-12 bg-white p-12 min-h-screen overflow-y-auto">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Add Product
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 max-w-full">
              <div className="sm:col-span-6">
                {selectedProduct?.deleted && (
                  <h2 className="text-red-500 sm:col-span-6">
                    This product is deleted
                  </h2>
                )}
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="text"
                      {...register("title", {
                        required: "name is required",
                      })}
                      id="title"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "description is required",
                    })}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a few sentences about product.
                </p>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Brand
                </label>
                <div className="mt-2">
                  <select
                    {...register("brand", {
                      required: "brand is required",
                    })}
                    onChange={handleBrandChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">--choose brand--</option>
                    {brands.map((brand) => (
                      <option value={brand.value} key={brand.id}>
                        {brand.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                

                <div className="mt-4 w-full">
                  {!showBrandInput ? (
                    <button
                      type="button"
                      onClick={() => setShowBrandInput(true)}
                      className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 border-2 border-blue-700"
                      style={{ display: 'block', visibility: 'visible', minHeight: '44px' }}
                    >
                      ➕ Add New Brand
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        placeholder="Enter new brand"
                        className="block flex-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                      />
                      <button
                        type="button"
                        onClick={handleAddBrand}
                        className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBrandInput(false);
                          setNewBrand("");
                        }}
                        className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Category
                </label>
                <div className="mt-2">
                  <select
                    {...register("category", {
                      required: "category is required",
                    })}
                    onChange={handleCategoryChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">--choose category--</option>
                    {categories.map((category) => (
                      <option value={category.value} key={category.id}>
                        {category.label}{" "}
                      </option>
                    ))}
                  </select>
                </div>
                
               
               

                <div className="mt-4 w-full">
                  {!showCategoryInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCategoryInput(true)}
                      className="w-full rounded-md bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 border-2 border-purple-700"
                      style={{ display: 'block', visibility: 'visible', minHeight: '44px' }}
                    >
                      ➕ Add New Category
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter new category"
                        className="block flex-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCategoryInput(false);
                          setNewCategory("");
                        }}
                        className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {selectedBrand && selectedCategory && (
                <div className="sm:col-span-6">
                  <label
                    htmlFor="make"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Make
                  </label>
                  <div className="mt-2">
                    <select
                      {...register("make", {
                        required: "make is required",
                      })}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">--choose make--</option>
                      {makes.map((make) => (
                        <option value={make.value} key={make.id}>
                          {make.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    {!showMakeInput ? (
                      <button
                        type="button"
                        onClick={() => setShowMakeInput(true)}
                        className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                      >
                        Add New Make
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newMake}
                          onChange={(e) => setNewMake(e.target.value)}
                          placeholder="Enter new make"
                          className="block flex-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
                        />
                        <button
                          type="button"
                          onClick={handleAddMake}
                          className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMakeInput(false);
                            setNewMake("");
                          }}
                          className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {colors.length > 0 && (
                <>
                  <div className="flex flex-col justify-start items-start gap-4 col-span-full">
                    <h2 className="font-semibold col-span-full">
                      Colors Added
                    </h2>

                    <div className="col-span-full flex flex-wrap gap-4">
                      {colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <div
                            id={color}
                            className="block rounded-full aspect-square w-12 h-12 border-2 border-gray-200"
                            style={{ backgroundColor: color }}
                          ></div>
                          <button onClick={() => handleRemoveColor(color)}>
                            <TrashIcon className="h-6 w-6" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-full mt-4">
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Add Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    id="color"
                    onChange={(e) => setNewColor(e.target.value)}
                    className="block rounded-full aspect-square w-10 h-10 border-none cursor-pointer"
                  />
                  <button
                    onClick={handleColor}
                    className="px-4 py-2 bg-amber-600 text-white rounded-md shadow hover:bg-amber-700 transition-all"
                  >
                    Add Color
                  </button>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="sizes"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Sizes
                </label>
                <div className="mt-2 ">
                  {sizes.map((size) => (
                    <>
                      <input
                        type="checkbox"
                        className="m-1"
                        {...register("sizes", {})}
                        key={size.id}
                        value={size.id}
                      />{" "}
                      {size.name}
                    </>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Price
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="number"
                      {...register("price", {
                        required: "price is required",
                        min: 1,
                      })}
                      id="price"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="discountPercentage"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Discount Percentage
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="number"
                      {...register("discountPercentage", {
                        required: "discountPercentage is required",
                        min: 0,
                        max: 100,
                      })}
                      id="discountPercentage"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Stock
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="number"
                      {...register("stock", {
                        required: "stock is required",
                        min: 0,
                      })}
                      id="stock"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="thumbnail"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Thumbnail
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="text"
                      {...register("thumbnail", {
                        required: "thumbnail is required",
                      })}
                      id="thumbnail"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="image1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image 1
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="text"
                      {...register("image1", {
                        required: "image1 is required",
                      })}
                      id="image1"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="image2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image 2
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="text"
                      {...register("image2", {
                        required: "image is required",
                      })}
                      id="image2"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="image2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image 3
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="text"
                      {...register("image3", {
                        required: "image is required",
                      })}
                      id="image3"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="highlight1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 1
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="text"
                      {...register("highlight1", {})}
                      id="highlight1"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-6">
                <label
                  htmlFor="highlight2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 2
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="text"
                      {...register("highlight2", {})}
                      id="highlight2"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-6">
                <label
                  htmlFor="highlight3"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 3
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="text"
                      {...register("highlight3", {})}
                      id="highlight3"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-6">
                <label
                  htmlFor="highlight4"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 4
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-600 ">
                    <input
                      type="text"
                      {...register("highlight4", {})}
                      id="highlight4"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Link
            to="/admin"
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </Link>

          {selectedProduct && !selectedProduct.deleted && (
            <button
              onClick={() => {
                setOpenModal(true);
              }}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              Delete
            </button>
          )}

          <button
            type="submit"
            className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            Save
          </button>
        </div>
      </form>
      <Modal
        title={`Delete ${selectedProduct?.title}`}
        message="Are you sure you want to delete this Product ?"
        dangerOption="Delete"
        cancelOption="Cancel"
        dangerAction={handleDelete}
        cancelAction={() => setOpenModal(null)}
        showModal={openModal}
      ></Modal>
    </div>
  );
}

export default ProductForm;
