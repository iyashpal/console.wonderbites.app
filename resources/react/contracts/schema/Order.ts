import User from "@/contracts/schema/User";

export default interface Order {
  id: number,
  status:number,
  created_at: string,
  user?: User
}
