export type Shop = {
  id: number;
  name: string;
  sellerId: number;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  shop: Shop;
  category: Category;
};
