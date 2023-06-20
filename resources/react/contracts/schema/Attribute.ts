import {User, Variant} from "@/contracts/schema/index";

export default interface Attribute {
  id: number;
  user_id: number;
  name: string;
  description: string;
  price: string;
  quantity: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  variants?: Variant[];
  meta: {
    pivot_category_id: number;
    pivot_price: number;
  }
}
