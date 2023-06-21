import {Category, User} from "~/contracts/schema";

export default interface Cuisine {
  id: number,
  user_id: number,
  name: string,
  description: string,
  thumbnail: object,
  thumbnail_url: string,
  status: number,
  created_at: string,
  updated_at: string,
  deleted_at: string,
  user?: User
  categories?: Category[]
}
