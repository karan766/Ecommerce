const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export function addToCart(item) {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      body: JSON.stringify(item),
      headers: { "content-type": "application/json" },
      credentials: 'include'
    });
    const data = await response.json();
  
    resolve({ data });
  });
}

export function fetchItemsByUserId() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else if (response.status === 401) {
        // User not authenticated, return empty cart
        resolve({ data: [] });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function updateCart(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_BASE_URL}/cart/${update.id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
      credentials: 'include'
    });
    const data = await response.json();
   
    resolve({ data });
  });
}

export function deleteItemFromCart(itemId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        credentials: 'include'
      });
      
      if (response.ok || response.status === 404) {
        // Success or item already deleted
        const data = response.ok ? await response.json() : { message: "Already deleted" };
        resolve({ data: { id: itemId } });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function resetCart() {
  // get all items of user's cart - and then delete each
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetchItemsByUserId();
      const items = response.data;
      
      if (!items || items.length === 0) {
        // Cart is already empty
        resolve({ status: "success", message: "Cart already empty" });
        return;
      }
      
      // Delete each item, ignoring 404 errors
      const deletePromises = items.map(item => 
        deleteItemFromCart(item.id).catch(err => {
          console.log(`Item ${item.id} already deleted or not found`);
          return { data: { id: item.id } };
        })
      );
      
      await Promise.all(deletePromises);
      resolve({ status: "success", message: "Cart cleared" });
    } catch (error) {
      console.error('Error resetting cart:', error);
      reject(error);
    }
  });
}
