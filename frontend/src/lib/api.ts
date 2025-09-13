const API_URL = "http://localhost:5000/api";

export const authAPI = {
  register: async ({ email, password, full_name, role }: any) => {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name, role })
    });
    if (!res.ok) throw new Error((await res.json()).error || "Registration failed");
    return res.json();
  },

  login: async ({ email, password }: any) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).error || "Login failed");
    return res.json();
  }

  
};
