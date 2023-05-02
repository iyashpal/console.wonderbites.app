import {Role} from '~/contracts/schema'
export default interface User {
  id: number,
  first_name: string,
  last_name: string,
  name: string,
  email: string,
  mobile: string,
  avatar_url: string,
  status: number,
  created_at: string,
  updated_at: string,
  role?: Role,
}
