import {User} from './'

export default interface Banner {
  id: number,
  title: string,
  options: {
    page: string,
    section: string,
    type: string,
    link: string,
  },
  attachment_url: string,
  status: string,
  created_at: string,
  updated_at: string,
  user?: User
}
