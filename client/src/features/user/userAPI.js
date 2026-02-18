const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export function fetchLoggedInUserOrders(userId) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      `${API_BASE_URL}/orders/user/${userId}`, {
        credentials: 'include'
      }
    );
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchLoggedInUser() {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_BASE_URL}/users/own`, {
      credentials: 'include'
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateUser(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(`${API_BASE_URL}/users/${update.id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
      credentials: 'include'
    });
    const data = await response.json();
  
    resolve({ data });
  });
}
