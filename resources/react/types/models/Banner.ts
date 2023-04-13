export default interface Banner {
  id: number,
  title: string,
  options: {
    page: string,
    section: string,
    type: string,
    link: string,
  },
  status: string,
  created_at: string,
  updated_at: string,
}
