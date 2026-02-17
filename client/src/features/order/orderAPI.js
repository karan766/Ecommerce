export function createOrder(order) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/orders", {
        method: "POST",
        body: JSON.stringify(order),
        headers: { "content-type": "application/json" },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}


export function updateOrder(order) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/orders/" + order.id, {
        method: "PATCH",
        body: JSON.stringify(order),
        headers: { "content-type": "application/json" },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}



export function fetchAllOrder(sort, pagination) {
  let queryString = "";

  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }

  if (queryString === "") {
    queryString = "_sort=createdAt&_order=desc&";
  }

  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/orders?" + queryString, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const ordersData = await response.json();
        resolve({
          data: {
            orders: ordersData.products,
            totalOrders: ordersData.totalOrders,
          },
        });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}