export function createOrder(order) {
  return new Promise(async (resolve) => {
    const response = await fetch("/orders", {
      method: "POST",
      body: JSON.stringify(order),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
  
    resolve({ data });
  });
}


export function updateOrder(order) {
  return new Promise(async (resolve) => {
    const response = await fetch("/orders/" + order.id, {
      method: "PATCH",
      body: JSON.stringify(order),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
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

  return new Promise(async (resolve) => {
    const response = await fetch("/orders/" + queryString);
    const ordersData = await response.json();

    resolve({
      data: {
        orders: ordersData.products,
        totalOrders: ordersData.totalOrders,
      },
    });

  });
}