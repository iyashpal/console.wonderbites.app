export default interface Media {
  id: number,
  user_id: number,
  title: string,
  caption: string,
  attachment: object,
  created_at: string,
  updated_at: string,
  attachment_url: string,

  meta: {
    pivot_order: number,
    pivot_is_default: string,
  }
}
