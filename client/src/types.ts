export interface PublicUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}

export interface UserResponse {
  user: PublicUser;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: "Breakfast" | "Lunch" | "À la carte" | "Sandwiches" | "Salads" | "Sides";
  price: number | null;
  unit: string;
  image?: string;
  tag?: string;
}

export interface CartEntry {
  item: MenuItem;
  quantity: number;
}

export interface ApiOrder {
  _id: string;
  owner: string;
  items: Array<{ itemId: string; quantity: number }>;
  status: "pending" | "paid";
  createdAt: string;
}

export interface ApiErrorResponse {
  message: string;
}
