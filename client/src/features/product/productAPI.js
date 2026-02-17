

export function fetchProductById(id) {
  return new Promise(async (resolve, reject) => {

    const response = await fetch("/products/" + id);
    const data = await response.json();
    if (response.ok) {
      resolve({ data });
    }
    reject( data );
  });
}



export async function createProduct(product) {
  try {
   
    const response = await fetch("/products/", {
      method: "POST",
      body: JSON.stringify(product),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Server responded with an error:", errorDetails);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}


export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      "/products/" + update.id,
      {
        method: "PATCH",
        body: JSON.stringify(update),
        headers: { "content-type": "application/json" },
      }
    );
    const data = await response.json();
   
    resolve({ data });
  });
}

export function fetchProductsByFilters(filter, sort, pagination, Admin) {
 
 

  let queryString = "";
  for (let key in filter) {
    const categoryValues = filter[key]
    if(categoryValues.length ){
      queryString += `${key}=${categoryValues}&`;
    }
  }
  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }

  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }
  if(Admin){
    queryString += `admin=true`;
  }

  return new Promise(async (resolve) => {

    const response = await fetch(
      "/products?" + queryString+"isAdmin=true"
    );
    const data = await response.json();
    const totalItems = data.totalProducts;
    resolve({ data: { products: {data: data.products}, totalItems: +totalItems } });
  });
}

export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch("/category");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch("/brands");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchMakes() {
  return new Promise(async (resolve) => {
    const response = await fetch("/makes");
    const data = await response.json();
    resolve({ data });
  });
}

export function createMake(make) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/makes", {
        method: "POST",
        body: JSON.stringify(make),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

export function createBrand(brand) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/brands", {
        method: "POST",
        body: JSON.stringify(brand),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

export function createCategory(category) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/category", {
        method: "POST",
        body: JSON.stringify(category),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}
