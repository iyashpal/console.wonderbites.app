import { Attribute, Cuisine } from ".";

export default interface Category {
  id: number,
  name: string,
  parent: number,
  description: string,
  type: string,
  status: string,
  created_at: string,
  updated_at: string,
  thumbnail_url: string,
  cuisines?: Cuisine[],
  category?: Category,
  attributes?: Attribute[];
  options: {
    extras?: {id: string, title: string, type: string, checked: boolean}[]
  }
}
