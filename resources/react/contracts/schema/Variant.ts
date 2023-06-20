import { Attribute, Category, User } from "@/contracts/schema/index";

export default interface Variant {
  id: number;
  user_id: number;
  name: string;
  description: string;
  price: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  attributes?: Attribute[];
  categories?: Category[];
  meta: {
    pivot_product_id: number;
    pivot_price: string;
    pivot_proteins: string;
    pivot_vegetables: string;
  }
}
