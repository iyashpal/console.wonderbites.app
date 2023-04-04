import User from "@/types/models/User";

export default interface Order {
  id: number,
  status:number,
  created_at: string,
  user?: User
}
